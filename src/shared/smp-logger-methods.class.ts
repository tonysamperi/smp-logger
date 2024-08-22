import {SmpLoggerMethodKeys} from "./smp-logger-method-keys.type";
import {smpNoop} from "./smp-noop.function";

export class SmpConsoleOnlyMethods {
    /**
     * Creates a new inline group in the Web Console log.
     * @param groupTitle An optional title for the group.
     */
    group: (groupTitle?: string) => void = smpNoop;

    /**
     * Creates a new inline group in the Web Console log that is initially collapsed.
     * @param groupTitle An optional title for the group.
     */
    groupCollapsed: (groupTitle?: string) => void = smpNoop;

    /**
     * Exits the current inline group in the Web Console.
     */
    groupEnd: () => void = smpNoop;

    /**
     * Starts a timer you can use to track how long an operation takes.
     * It works only with log {@link KikLoggingLevels} equal or higher than DEBUG.
     *
     * @param timerName The name to give the new timer. This will identify the timer.
     */
    time: (timerName?: string) => void = smpNoop;

    /**
     * Stops a timer that was previously started by calling {@link KikLoggingLevels.time}.
     * It works only with log {@link KikLoggingLevels} equal or higher than DEBUG.
     *
     * @param timerName The name of the timer to stop. Once stopped, the elapsed time is automatically displayed in the Web Console.
     */
    timeEnd: (timerName?: string) => void = smpNoop;

    /**
     * Outputs a warning message to the Web Console.
     * @param message A JavaScript string containing zero or more substitution strings.
     * @param optionalParams A list of JavaScript objects to output
     *                       OR JavaScript objects with which to replace substitution strings within message.
     */

}

export class SmpLoggerMethods extends SmpConsoleOnlyMethods {
    /**
     * Outputs a debugging message to the Web Console.
     * @param message A JavaScript string containing zero or more substitution strings.
     * @param optionalParams A list of JavaScript objects to output
     *                       OR JavaScript objects with which to replace substitution strings within message.
     */
    debug: (message?: any, ...optionalParams: any[]) => void = smpNoop;

    /**
     * Outputs an error message to the Web Console.
     * @param message A JavaScript string containing zero or more substitution strings.
     * @param optionalParams A list of JavaScript objects to output
     *                       OR JavaScript objects with which to replace substitution strings within message.
     */
    error: (message?: any, ...optionalParams: any[]) => void = smpNoop;

    /**
     * Outputs an informational message to the Web Console.
     * @param message A JavaScript string containing zero or more substitution strings.
     * @param optionalParams A list of JavaScript objects to output
     *                       OR JavaScript objects with which to replace substitution strings within message.
     */
    info: (message?: any, ...optionalParams: any[]) => void = smpNoop;

    /**
     * Outputs a message to the Web Console.
     * @param message A JavaScript string containing zero or more substitution strings.
     * @param optionalParams A list of JavaScript objects to output
     *                       OR JavaScript objects with which to replace substitution strings within message.
     */
    log: (message?: any, ...optionalParams: any[]) => void = smpNoop;

    warn: (message?: any, ...optionalParams: any[]) => void = smpNoop;

    static describe(): SmpLoggerMethodKeys[] {
        return Object.getOwnPropertyNames(new SmpLoggerMethods()).map((k) => k as SmpLoggerMethodKeys);
    }
}

