import {SmpConsoleOnlyMethods, SmpLoggerMethods} from "./smp-logger-methods.class.js";

export type SmpLoggerMethodKeys = keyof SmpLoggerMethods;

export type SmpGenericLoggerMethodKeys = keyof Omit<SmpLoggerMethods, keyof SmpConsoleOnlyMethods>;
