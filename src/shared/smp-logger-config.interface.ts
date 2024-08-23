import {SmpLoggingLevels} from "./smp-logging-levels.enum";

export interface SmpLoggerConfig {
    enablePreprocessing?: boolean;
    enableSessionId?: boolean;
    level: SmpLoggingLevels;
    sensitiveProps?: string[];
}
