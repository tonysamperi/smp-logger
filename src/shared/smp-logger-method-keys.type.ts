import {SmpConsoleOnlyMethods, SmpLoggerMethods} from "./smp-logger-methods.class";

export type SmpLoggerMethodKeys = keyof SmpLoggerMethods;

export type SmpGenericLoggerMethodKeys = keyof Omit<SmpLoggerMethods, keyof SmpConsoleOnlyMethods>;
