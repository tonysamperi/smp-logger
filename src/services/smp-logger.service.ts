import {SmpLoggingLevels} from "../shared/smp-logging-levels.enum";
import {SmpLoggerConfig} from "../shared/smp-logger-config.interface";
import {SmpLoggerMethods} from "../shared/smp-logger-methods.class";
import {smpNoop} from "../shared/smp-noop.function";
import {SmpGenericLoggerMethodKeys} from "../shared/smp-logger-method-keys.type";

const defaultAppName = "[DEFAULT]" as const;

export class SmpLoggerService extends SmpLoggerMethods {

    static get INSTANCE() {
        return this.get(defaultAppName);
    }

    static get INSTANCES() {
        return this._instances.keys();
    }

    protected static _instances: Map<string | typeof defaultAppName, SmpLoggerService> = new Map<string | typeof defaultAppName, SmpLoggerService>();
    protected static _level: SmpLoggingLevels = SmpLoggingLevels.OFF;

    //

    get activeLevels(): SmpLoggingLevels[] {
        return Object.values(SmpLoggingLevels)
            .filter((v) => +v > SmpLoggingLevels.OFF && +v <= (this.level))
            .map((k) => SmpLoggingLevels[k as keyof typeof SmpLoggingLevels]);
    }

    get appName(): string {
        return this._appName;
    }

    get level(): SmpLoggingLevels {
        return (this.constructor as typeof SmpLoggerService)._level;
    }

    get sessionId(): string | void {
        return this._sessionId || this._storage.getItem(this._sessionIdKey) || void 0;
    }

    protected _appName: string;
    protected _sensitivePropMask: string = "*****";
    protected _sensitiveProps: string[];
    protected _sessionId: string | void;
    protected _sessionIdKey: string = "lggr_sid";
    protected _storage: Pick<Storage, "getItem" | "setItem" | "removeItem" | "clear">;

    protected constructor({
                              sensitiveProps = [],
                              level = SmpLoggingLevels.OFF,
                              enablePreprocessing = !1,
                              enableSessionId = !1
                          }: SmpLoggerConfig) {
        super();
        this._sensitiveProps = [...(sensitiveProps), ...["pwd", "password", "buffer", "token", "accessToken", "refreshToken"]];
        enablePreprocessing || (this.preprocessArgs = (...args: any[]): any[] => {
            return args;
        });
        enableSessionId && this._setupSessionManager();
        this._updateLevel(level);
    }


    static get(appName: string = defaultAppName): SmpLoggerService {
        return this._instances.get(appName) || this._instances.get(defaultAppName) || new SmpLoggerMethods() as SmpLoggerService;
    }

    static init(config: SmpLoggerConfig,
                appName: string = defaultAppName): SmpLoggerService {
        this._instances.has(appName) || this._instances.set(appName, new SmpLoggerService(config));
        const instance = this.get(appName);
        instance._appName = appName;

        return instance;
    }

    filterSensitiveData(value: any): any {
        if (typeof value === typeof {} && !Array.isArray(value)) {
            const maskedString = JSON.stringify(value, (k, v) => {
                let masked = v;
                if (this._sensitiveProps.includes(k)) {
                    masked = this._sensitivePropMask;
                }

                return masked;
            });

            try {
                return JSON.parse(maskedString);
            }
            catch (e) {
                console.warn(`${this.constructor.name} [${this._appName}]: failed to re-parse value during cleanup`, value);
                return maskedString;
            }
        }
    }

    preprocessArgs(level: SmpGenericLoggerMethodKeys, ...args: any[]): any[] {
        // eslint-disable-next-line prefer-spread
        return this._defaultPreprocessArgs.apply(this, [level, ...args]);
    }

    // PRIVATE

    protected _defaultPreprocessArgs(level: SmpGenericLoggerMethodKeys, ...args: any[]): [string, string, ...{
        tags: (string | number | symbol)[],
        metadata: any
    }[]] {
        const now = new Date();

        return [
            `${now.toISOString()}`,
            `${args.shift()}`.trim(),
            ...args.map(value => {
                return {
                    tags: [this._appName, `level-${SmpLoggingLevels[this.level]}`, level],
                    timestamp: +now,
                    sessionId: this._sessionId,
                    metadata: this.filterSensitiveData(value)
                };
            })
        ];
    }

    protected _generateSessionId(): string {
        const sessionId = this._generateUUID();
        this._storage.setItem(this._sessionIdKey, sessionId);

        return sessionId;
    }


    protected _generateUUID(): string {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0;
            const v = c === "x" ? r : (r & 0x3) | 0x8;

            return v.toString(16);
        });
    }

    protected _getStorage(): Pick<Storage, "getItem" | "setItem" | "removeItem" | "clear"> {
        try {
            if (typeof window !== "undefined" && typeof window.sessionStorage === typeof isNaN) {
                return sessionStorage;
            }
        }
        catch (e: any) {
            console.debug(`${this.constructor.name} [${this._appName}]: error while checking sessionStorage`, e);
        }

        return {
            getItem: () => null,
            setItem: () => null,
            removeItem: () => null,
            clear: () => null
        };
    }

    protected _setup(baseLogger: any): void {
        const preprocessArgs = this.preprocessArgs.bind(this);
        this.activeLevels.forEach((loggingLevel: SmpLoggingLevels) => {
            const loggerMethodKey = `${loggingLevel}`.toLowerCase() as SmpGenericLoggerMethodKeys;
            // typeof baseLogger[loggerMethodKey] === typeof isNaN && (this[loggerMethodKey] = baseLogger[lvlKey].bind(baseLogger));
            if (typeof baseLogger[loggerMethodKey] === typeof isNaN) {
                this[loggerMethodKey] = function (...args: any[]) {
                    // eslint-disable-next-line prefer-spread
                    baseLogger[loggerMethodKey].apply(baseLogger, preprocessArgs.apply(null, [loggerMethodKey, ...args]));
                };
            }
        });

        if (this.level > SmpLoggingLevels.OFF && console) {
            if (console.group && console.groupEnd) {
                this.group = console.group.bind(console);
                this.groupEnd = console.groupEnd.bind(console);
            }

            if (console.groupCollapsed) {
                this.groupCollapsed = console.groupCollapsed.bind(console);
            }

            if (console.time && console.timeEnd) {
                this.time = console.time.bind(console);
                this.timeEnd = console.timeEnd.bind(console);
            }
        }
    }

    protected _setupSessionManager(): void {
        this._storage = this._getStorage();
        this._sessionId = this.sessionId || this._generateSessionId();
    }

    protected _updateLevel(newValue: SmpLoggingLevels = SmpLoggingLevels.WARN) {
        (this.constructor as typeof SmpLoggerMethods).describe().forEach((key) => {
            this[key] = smpNoop;
        });
        (this.constructor as typeof SmpLoggerService)._level = newValue;
        !!console && this._setup(console);
    }
}
