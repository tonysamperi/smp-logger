const {version, peerDependencies} = require("./package.json");

module.exports = {
    mode: "production",
    optimization: {
        minimize: process.env.NODE_ENV === "production"
    },
    externals: [
        ...Object.keys(peerDependencies || {}),
        // This needs to be forced cause even autoExternal fails and excluding "firebase" doesn't work. Weird.
        /^@?firebase*/
    ],
    devtool: "source-map",
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: [".ts", ".tsx", ".js"],
        // Add support for TypeScripts fully qualified ESM imports.
        extensionAlias: {
            ".js": [".js", ".ts"],
            ".mjs": [".mjs", ".mts"]
        }
    },
    module: {
        rules: [
            {
                test: /\.m?[jt]s$/,
                loader: "string-replace-loader",
                options: {
                    search: "__BUILD_VRS__",
                    replace: version
                }
            }
        ]
    },
    plugins: [
    ],
};  
