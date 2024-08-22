import {SmpLoggingLevels} from "../shared/smp-logging-levels.enum";
import {SmpLoggerConfig} from "../shared/smp-logger-config.interface";
import {SmpLoggerMethods} from "../shared/smp-logger-methods.class";
import {smpNoop} from "../shared/smp-noop.function";
import {SmpGenericLoggerMethodKeys} from "../shared/smp-logger-method-keys.type";

const defaultAppName = "[DEFAULT]" as const;

/**
 * A logger service that provide the same functions as {@link console}.
 * The logger is bound to the console, so the Web Console shows the correct file and line number of the original call.
 */
export class SmpLoggerService extends SmpLoggerMethods {

    static get INSTANCE() {
        return this.get(defaultAppName);
    }

    static get INSTANCES() {
        return this._instances.keys();
    }

    protected static _defaults: SmpLoggerConfig = {
        level: SmpLoggingLevels.OFF
    };
    protected static _instance?: SmpLoggerService;
    protected static _instances: Map<string | typeof defaultAppName, SmpLoggerService> = new Map<string | typeof defaultAppName, SmpLoggerService>();
    protected static _level: SmpLoggingLevels = SmpLoggingLevels.OFF;

    //

    get activeLevels() {
        return Object.values(SmpLoggingLevels)
            .filter((v) => +v > SmpLoggingLevels.OFF && +v <= (this.level))
            .map((k) => `${SmpLoggingLevels[k as keyof typeof SmpLoggingLevels]}`.toLowerCase());
    }

    get appName(): string {
        return this._appName;
    }

    get level(): SmpLoggingLevels {
        return (this.constructor as typeof SmpLoggerService)._level;
    }

    protected _appName: string = defaultAppName;
    protected _sensitivePropMask: string = "*****";
    protected _sensitiveProps: string[];

    protected constructor(config: SmpLoggerConfig) {
        super();
        this._sensitiveProps = [...(config.sensitiveProps || []), ...["pwd", "password", "buffer", "token", "accessToken", "refreshToken"]];
        config.enablePreprocessing || (this.preprocessArgs = (...args: any[]): any[] => {
            return args;
        });
        this._updateLevel(config.level);
    }


    static get(appName: string = defaultAppName): SmpLoggerService {
        return this._instances.get(appName) || this._instances.get(defaultAppName) || new SmpLoggerMethods() as SmpLoggerService;
    }

    static init(config: SmpLoggerConfig,
                appName: string = defaultAppName): SmpLoggerService {
        this._instances.has(appName) || this._instances.set(appName, new SmpLoggerService(config));

        return this.get(appName);
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

    preprocessArgs(...args: any[]): any[] {
        return this._defaultPreprocessArgs.apply(this, args);
    }

    // PRIVATE

    protected _defaultPreprocessArgs(...args: any[]): [string, ...{ tags: (string | number)[], metadata: any }[]] {
        return [
            `${args.shift()}`.trim(),
            ...args.map(value => {
                return {
                    tags: [this._appName, `level-${this.level}`],
                    metadata: this.filterSensitiveData(value)
                };
            })
        ];
    }

    protected _setup(baseLogger: any): void {
        const preprocessArgs = this.preprocessArgs.bind(this);
        this.activeLevels.forEach((lvlKey) => {
            // typeof baseLogger[lvlKey] === typeof isNaN && (this[lvlKey as SmpGenericLoggerMethodKeys] = baseLogger[lvlKey].bind(baseLogger));
            if (typeof baseLogger[`${lvlKey}`] === typeof isNaN) {
                this[lvlKey as SmpGenericLoggerMethodKeys] = function (...args: any[]) {
                    // eslint-disable-next-line prefer-spread
                    const preprocessedArgs = preprocessArgs.apply(null, args);
                    baseLogger[lvlKey](...preprocessedArgs);
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
