import { SmpLoggingLevels } from "../shared/smp-logging-levels.enum";
import { SmpLoggerConfig } from "../shared/smp-logger-config.interface";
import { SmpLoggerMethods } from "../shared/smp-logger-methods.class";
import { smpNoop } from "../shared/smp-noop.function";
import { SmpLoggerMethodKeys } from "src/shared";

/**
 * A logger service that provide the same functions as {@link console}.
 * The logger is bound to the console, so the Web Console shows the correct file and line number of the original call.
 */
export class SmpLoggerService extends SmpLoggerMethods {
    static get instance() {
        if (!(this._instance instanceof SmpLoggerService)) {
            console.warn("SmpLoggerService instance doesn't exist! Call SmpLoggerService.init first! Initialising with defaults.");
            this._instance = new this(this._defaults);
        }

        return this._instance;
    }

    static get events(): Record<"updateLevel", string> {
        return {
            updateLevel: "loggerService:updateLevel"
        };
    }

    protected static _defaults: SmpLoggerConfig = {
        level: SmpLoggingLevels.OFF
    };
    protected static _instance?: SmpLoggerService;
    protected static _level: SmpLoggingLevels = SmpLoggingLevels.OFF;

    get level(): SmpLoggingLevels {
        return (this.constructor as typeof SmpLoggerService)._level;
    }

    protected _sensitiveProps: string[];
    protected _sensitivePropMask: string = "*****";

    protected constructor(config: SmpLoggerConfig) {
        super();
        this._sensitiveProps = [...(config.sensitiveProps || []), ...["pwd", "password", "buffer", "token", "accessToken", "refreshToken"]];
        this._updateLevel(config.level);
    }

    static init(config: SmpLoggerConfig) {
        this._instance = new this(config);

        return this._instance;
    }

    filterSensitiveData(value: any): any {
        let result;

        if (typeof value === typeof {} && !Array.isArray(value)) {
            const maskedString = JSON.stringify(value, (k, v) => {
                let masked = v;
                if (this._sensitiveProps.includes(k)) {
                    masked = this._sensitivePropMask;
                }

                return masked;
            });

            try {
                result = JSON.parse(maskedString);
            }
            catch (e) {
                console.error("KikRestLogger: failed to re-parse value during cleanup", value);
            }
        }
        return result;
    }

    protected _setup(baseLogger: any): void {
        const lvl = (this.constructor as typeof SmpLoggerService)._level;
        const activeLevels: SmpLoggerMethodKeys[] = Object.values(SmpLoggingLevels)
            .filter((v) => +v >= lvl)
            .map((k) => `${SmpLoggingLevels[k as keyof typeof SmpLoggingLevels]}`.toLowerCase() as SmpLoggerMethodKeys);

        activeLevels.forEach((lvlKey: SmpLoggerMethodKeys) => {
            typeof baseLogger[lvlKey] === "function" && (this[lvlKey] = baseLogger[lvlKey].bind(baseLogger));
        });

        if (lvl > SmpLoggingLevels.OFF && console) {
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
