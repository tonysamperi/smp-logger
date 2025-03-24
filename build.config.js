import {execSync} from "child_process";
import {build} from "esbuild";
import fg from "fast-glob";
import {cpSync, renameSync} from "fs";
import {replaceInFile} from "replace-in-file";
import pkg from "./package.json" with {type: "json"};

async function duplicateTypings() {
    cpSync("dist/raw-types", "dist/esm", {recursive: true});
    cpSync("dist/raw-types", "dist/cjs", {recursive: true});

    const files = await fg("dist/cjs/**/*.d.ts");

    for (const f of files) {
        renameSync(f, f.replace(/\.d\.ts$/, ".d.cts"));
    }

    await replaceInFile({
        files: "dist/cjs/**/*.d.cts",
        from: /(from\s+["'].*?)(\.js)(["'])/g,
        to: (_match_, p1, _p2_, p3) => `${p1}.cjs${p3}`
    });

    console.log(`✅ ${files.length} typings copied and fixed!`);
}

async function doBuild() {
    const isProd = process.env.NODE_ENV === "production";

    execSync("tsc -p tsconfig.esm.json", {stdio: "inherit"});

    await replaceInFile({
        files: "dist/**/*",
        from: "__BUILD_VRS__",
        to: pkg.version
    });

    await build({
        entryPoints: ["dist/raw-esm/**/*.js"],
        outdir: "dist/esm",
        format: "esm",
        bundle: !1,
        minify: !1 // never minify as it's only a source to work on
    });

    await build({
        entryPoints: ["dist/raw-esm/index.js"],
        outfile: "dist/cjs/index.cjs",
        format: "cjs",
        bundle: !0,
        minify: isProd
    });

    await duplicateTypings();
}

try {
    doBuild();
}
catch (e) {
    console.error("Error");
}
