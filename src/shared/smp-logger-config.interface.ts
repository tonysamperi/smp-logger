import {SmpLoggingLevels} from "./smp-logging-levels.enum";

export interface SmpLoggerConfig {
    enablePreprocessing?: boolean;
    level: SmpLoggingLevels;
    sensitiveProps?: string[];
}
