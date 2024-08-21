import {SmpLoggingLevels} from "./smp-logging-levels.enum";

export interface SmpLoggerConfig {
    level: SmpLoggingLevels;
    sensitiveProps?: string[];
}
