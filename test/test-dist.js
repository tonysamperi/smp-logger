import {VERSION} from "../dist/esm/index.js";
import pkg from "../package.json" with {type: "json"};

if (pkg.version !== VERSION) {
    console.error(`Version mismatch! Expected ${pkg.version}, got ${VERSION}. Rebuild the package to solve!`);
    throw new Error(`PGK-LIB VERSION MISMATCH!`);
}
