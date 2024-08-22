import {SmpGenericLoggerMethodKeys, SmpLoggerService, SmpLoggingLevels, smpNoop} from "../src/index";

describe("SmpLoggerService", () => {

    const loggerKeys: SmpGenericLoggerMethodKeys[] = Object.values(SmpLoggingLevels)
        .filter((v) => +v > SmpLoggingLevels.OFF)
        .map((k) => `${SmpLoggingLevels[k as keyof typeof SmpLoggingLevels]}`.toLowerCase() as SmpGenericLoggerMethodKeys);

    beforeEach(() => {
        SmpLoggerService.init({
            level: SmpLoggingLevels.DEBUG
        });
        SmpLoggerService.init({
            level: SmpLoggingLevels.ERROR
        }, "foo");
    });

    it("should have the correct methods", () => {
        expect(Array.from(SmpLoggerService.INSTANCES)).toEqual(["[DEFAULT]", "foo"]);
        expect(SmpLoggerService.INSTANCE).toBeDefined();
        loggerKeys.forEach(method => {
            expect(typeof SmpLoggerService.INSTANCE[method]).toBe(typeof isNaN);
        });
    });

    it("should use the correct methods", () => {
        loggerKeys.forEach((method) => {
            console.info(`CHECKING ${method}`);
            const debugSpy = jest.spyOn(SmpLoggerService.INSTANCE, method);
            const logArgs = [`TEST LOG OF LEVEL "${method}"`, {
                foo: "bar"
            }];
            SmpLoggerService.INSTANCE[method](...logArgs);
            expect(debugSpy).toHaveBeenCalledWith(...logArgs);
            debugSpy.mockRestore();
        });
    });

    it("should call noop when level is lower than debug", () => {
        const logger = SmpLoggerService.get("foo");
        const noopSpy = jest.spyOn(logger, "debug");
        logger.debug("This should not log");
        expect(noopSpy).toHaveBeenCalledTimes(1);
        noopSpy.mockRestore();
        expect(logger.debug).toBe(smpNoop);
    });

});
