const baseEsLint = require("../.eslintrc.js");

module.exports = {
    ...baseEsLint,
    "parserOptions": {
        "project": "tsconfig.json",
        "tsconfigRootDir": "./"
    },
    "plugins": [
        "@typescript-eslint"
    ],
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "root": true,
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "ignorePatterns": [
        ".eslintrc.js"
    ]
};
