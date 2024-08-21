import {SmpLoggerService, SmpLoggingLevels} from "../src/index";
import * as pkg from "../package.json";

describe("SmpLoggerService test", () => {

    it("should have the correct methods", () => {
        SmpLoggerService.init({
            level: SmpLoggingLevels.DEBUG
        });

        expect(SmpLoggerService.INSTANCE).toBeDefined();
        expect(SmpLoggerService.INSTANCE.debug)
    });
    
});