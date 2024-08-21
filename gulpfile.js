const {join} = require("path"),
    gulp = require("gulp"),
    argv = require("yargs").argv,
    log = require("plugin-log"),
    {obj} = require("through2"),
    {inc} = require("semver")
;

const srcPath = join(__dirname, "src");

const doBump = (type, pkgs = []) => {
    return Promise.all(pkgs.map((p) => {
        return gulp.src(join(p, "package.json"))
        .pipe(obj((file, enc, cb) => {
            const pkgData = JSON.parse(file.contents.toString());
            const prevVersion = pkgData.version;
            pkgData.version = inc(prevVersion, type);
            file.contents = Buffer.from(JSON.stringify(pkgData, null, 4));
            log(
                "Bumped", log.colors.cyan(prevVersion),
                "to", log.colors.magenta(pkgData.version),
                "with type:", log.colors.cyan(type)
            );
            cb(null, file);
        }))
        .pipe(gulp.dest(p));
    }));
};

// TASKS
// Usage: npx gulp bump --patch
gulp.task("bump", () => {
    const type = ["patch", "minor", "major"].find((t) => argv[t]);
    if (!type) {
        throw new Error("Invalid type!");
    }

    return doBump(type, [
        __dirname,
        srcPath
    ]);
});



