import {SmpLoggerService, VERSION} from "../src/index";
import * as pkg from "../package.json";

describe("SmpLoggerService test", () => {

    it("should have the correct version", () => {
        expect(VERSION).toBe(pkg.version);
    });
    
});