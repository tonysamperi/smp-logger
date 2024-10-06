import { SmpGenericLoggerMethodKeys, SmpLoggerService, SmpLoggingLevels, smpNoop } from "../src/index";

describe("SmpLoggerService", () => {

    const appNames = {
        _: "[DEFAULT]",
        foo: "foo",
        withSession: "withSession",
        withPreprocessing: "withPreprocessing"
    };
    const loggerKeys: SmpGenericLoggerMethodKeys[] = Object.values(SmpLoggingLevels)
        .filter((v) => +v > SmpLoggingLevels.OFF)
        .map((k) => `${SmpLoggingLevels[k as keyof typeof SmpLoggingLevels]}`.toLowerCase() as SmpGenericLoggerMethodKeys);

    beforeEach(() => {
        SmpLoggerService.init({
            level: SmpLoggingLevels.DEBUG
        });
        SmpLoggerService.init({
            level: SmpLoggingLevels.ERROR
        }, appNames.foo);
        SmpLoggerService.init({
            level: SmpLoggingLevels.DEBUG,
            enableSessionId: !0
        }, appNames.withSession);
        SmpLoggerService.init({
            level: SmpLoggingLevels.DEBUG,
            enablePreprocessing: !0
        }, appNames.withPreprocessing);
    });

    it("should have the correct methods", () => {
        expect(Array.from(SmpLoggerService.INSTANCES)).toEqual(Object.values(appNames));
        expect(SmpLoggerService.INSTANCE.appName).toBe(appNames._);
        expect(SmpLoggerService.INSTANCE).toBeDefined();
        loggerKeys.forEach(method => {
            expect(typeof SmpLoggerService.INSTANCE[method]).toBe(typeof isNaN);
        });
    });

    it("should use the correct methods", () => {
        loggerKeys.forEach((method) => {
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
        const logger = SmpLoggerService.get(appNames.foo);
        expect(logger.appName).toBe(appNames.foo);
        const noopSpy = jest.spyOn(logger, "debug");
        logger.debug("This should not log");
        expect(noopSpy).toHaveBeenCalledTimes(1);
        noopSpy.mockRestore();
        expect(logger.debug).toBe(smpNoop);
    });

    it("should manage sessions properly", () => {
        const logger = SmpLoggerService.get(appNames.withSession);
        expect(logger.appName).toBe(appNames.withSession);
        const sid = logger.sessionId;
        expect(sid).toBeDefined();
        expect(`${sid}`.length).toBe(36);
    });

    it("should filter data without altering", () => {
        const logger = SmpLoggerService.get(appNames.withSession);
        const foo = {
            password: "abcd",
            date: new Date(),
            someMap: new Map()
        };
        const filtered = logger.filterSensitiveData(foo);
        filtered.password = foo.password;
        expect(foo).toEqual(filtered);
    });

    it("should not create metadata properties recursively w/ args", () => {
        const logger = SmpLoggerService.get(appNames.withPreprocessing);
        const preprocessedArgs = logger.preprocessArgs("info", "foo", {
            base: "base-fubar",
            password: "abc123",
            deep: {
                nested: "nested-fubar",
                password: "abc123",
                deeper: {
                    deepest: "deepest-fubar",
                    password: "abc123"
                }
            }
        });
        const expected = {
            base: "base-fubar",
            password: "*****",
            deep: {
                nested: "nested-fubar",
                password: "*****",
                deeper: {
                    deepest: "deepest-fubar",
                    password: "*****",
                },
            }
        };
        expect(preprocessedArgs[2].metadata).toEqual(expected);
    });

});
