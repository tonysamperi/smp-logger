import {SmpGenericLoggerMethodKeys, SmpLoggerService, SmpLoggingLevels} from "../src/index";

describe("SmpLoggerService test", () => {

    it("should have the correct methods", () => {
        SmpLoggerService.init({
            level: SmpLoggingLevels.DEBUG
        });
        expect(Array.from(SmpLoggerService.INSTANCES)).toEqual(["[DEFAULT]"]);
        expect(SmpLoggerService.INSTANCE).toBeDefined();
        ["debug", "log", "info", "warn", "error"].forEach(method => {
            expect(typeof SmpLoggerService.INSTANCE[method as SmpGenericLoggerMethodKeys]).toBe(typeof isNaN);

            SmpLoggerService.INSTANCE[method as SmpGenericLoggerMethodKeys](`TEST LOG OF LEVEL "${method}"`, {
                foo: "bar"
            });

            // expect(SmpLoggerService.INSTANCE[method as SmpGenericLoggerMethodKeys]).toHaveBeenCalled();
        });


    });

});
