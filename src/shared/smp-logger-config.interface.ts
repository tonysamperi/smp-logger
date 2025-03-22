import {SmpLoggingLevels} from "./smp-logging-levels.enum.js";

export interface SmpLoggerConfig {
    enablePreprocessing: boolean;
    enableSessionId: boolean;
    level: SmpLoggingLevels;
    sensitiveProps: string[];
}
