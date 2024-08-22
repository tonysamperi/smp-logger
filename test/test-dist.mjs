import * as smpLogger from "../dist/smp-logger.js";
import pkg from "../package.json" assert { type: "json" };

if (pkg.version !== smpLogger.VERSION) {
    console.error(`Version mismatch! Expected ${pkg.version}, got ${smpLogger.VERSION}. Rebuild the package to solve!`);
    throw new Error(`PGK-LIB VERSION MISMATCH!`);
}
