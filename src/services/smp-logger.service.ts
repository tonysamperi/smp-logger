import {SmpSessionManagerService} from "./smp-session-manager.service";
//
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

    static get NOOP_INSTANCE() {
        return this._noopInstance;
    }

    protected static _instances: Map<string | typeof defaultAppName, SmpLoggerService> = new Map<string | typeof defaultAppName, SmpLoggerService>();
    protected static _level: SmpLoggingLevels = SmpLoggingLevels.OFF;
    protected static _noopInstance: SmpLoggerService = new this({
        level: SmpLoggingLevels.OFF
    });

    //

    get activeLevels(): SmpLoggingLevels[] {
        return Object.values(SmpLoggingLevels)
            .filter((v) => +v > SmpLoggingLevels.OFF && +v <= (this.level))
            .map((k) => SmpLoggingLevels[k as keyof typeof SmpLoggingLevels]);
    }

    get appName(): string {
        return this._appName;
    }

    get currentConfig(): SmpLoggerConfig {
        return {
            level: this.level,
            enableSessionId: this.enableSessionId,
            enablePreprocessing: this.enablePreprocessing,
            sensitiveProps: this._sensitiveProps
        };
    }

    get enablePreprocessing(): boolean {
        return this.preprocessArgs !== this._noopPreprocessArgs;
    }

    get enableSessionId(): boolean {
        return !!this.sessionId;
    }

    get level(): SmpLoggingLevels {
        return (this.constructor as typeof SmpLoggerService)._level;
    }

    get sessionId(): string | void {
        return this._sessionId;
    }

    protected _appName: string;
    protected _sensitivePropMask: string = "*****";
    protected _sensitiveProps: string[];
    protected _sessionId: string | void;
    protected _sessionManager: SmpSessionManagerService = new SmpSessionManagerService();

    constructor(config: Partial<SmpLoggerConfig>) {
        super();
        this._loadConfig(config);
    }

    /* destroy an instance, returns true if found and destroyed, false otherwise */
    static destroy(appName: string): boolean {
        return this._instances.delete(appName);
    }

    static get(appName: string = defaultAppName): SmpLoggerService {
        return this._instances.get(appName) || this._instances.get(defaultAppName) || this._noopInstance;
    }

    static init(config: Partial<SmpLoggerConfig>,
                appName: string = defaultAppName): SmpLoggerService {
        let instance;
        if (this._instances.has(appName)) {
            instance = this.get(appName);
            const currentConfig: SmpLoggerConfig = instance.currentConfig;
            instance._loadConfig({
                ...currentConfig,
                ...config
            });
        }
        else {
            this._instances.set(appName, new this(config));
            instance = this.get(appName);
            instance._appName = appName;
        }

        return instance;
    }

    /**
     * Returns the current instance and destroys its reference
     * @param appName
     */
    static pop(appName: string) {
        const instance = this.get(appName);
        this.destroy(appName);

        return instance;
    }

    /* self destroy, returns true if found and destroyed, false otherwise */
    destroy(): boolean {
        return (this.constructor as typeof SmpLoggerService).destroy(this.appName);
    }

    filterSensitiveData<T>(value: T): T {
        if (value === null || typeof value !== "object" || Array.isArray(value) || value.constructor !== Object) {

            return value;
        }
        const filteredValue = {} as T;
        for (const key in value) {
            const fieldValue = (value as any)[key];
            if (!Object.prototype.hasOwnProperty.call(value, key) || fieldValue === null || fieldValue === undefined) {
                (filteredValue as any)[key] = fieldValue;

                continue;
            }
            if (this._sensitiveProps.includes(key)) {
                (filteredValue as any)[key] = this._sensitivePropMask;

                continue;
            }
            (filteredValue as any)[key] = this.filterSensitiveData(fieldValue);
        }

        return filteredValue;
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
                    sessionId: this.sessionId,
                    metadata: this.filterSensitiveData(value)
                };
            })
        ];
    }

    /**
     * Load config as the constructor does, with defaults
     * @param sensitiveProps
     * @param level
     * @param enablePreprocessing
     * @param enableSessionId
     * @protected
     */
    protected _loadConfig({
                              sensitiveProps = [],
                              level = SmpLoggingLevels.OFF,
                              enablePreprocessing = !1,
                              enableSessionId = !1
                          }: Partial<SmpLoggerConfig>) {
        this._sensitiveProps = [...(sensitiveProps), ...["pwd", "password", "buffer", "token", "accessToken", "refreshToken"]];
        this.preprocessArgs = enablePreprocessing ? this.preprocessArgs : this._noopPreprocessArgs;
        this._sessionId = enableSessionId ? this._sessionManager.sessionId : void 0;
        this._updateLevel(level);
    }

    protected _noopPreprocessArgs(...args: any[]): any[] {
        return args;
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

    protected _updateLevel(newValue: SmpLoggingLevels = SmpLoggingLevels.WARN) {
        (this.constructor as typeof SmpLoggerMethods).describe().forEach((key) => {
            this[key] = smpNoop;
        });
        (this.constructor as typeof SmpLoggerService)._level = newValue;
        !!console && this._setup(console);
    }
}
