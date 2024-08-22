module.exports = {
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "project": "tsconfig.json",
        "tsconfigRootDir": "."
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
        "node_modules/**",
        "test/**",
        "gulpfile.js",
        ".eslintrc.js",
        "jest.config.js"
    ],
    "rules": {
        "accessor-pairs": [
            "error",
            {
                "getWithoutSet": true,
                "setWithoutGet": true,
                "enforceForClassMembers": false
            }
        ],
        "eol-last": "warn",
        "grouped-accessor-pairs": [
            "error",
            "setBeforeGet"
        ],
        "@typescript-eslint/consistent-type-definitions": "error",
        "@typescript-eslint/no-unused-vars": [
            "error",
            {
                "argsIgnorePattern": "_.*_"
            }
        ],
        "@typescript-eslint/dot-notation": "off",
        "@typescript-eslint/explicit-member-accessibility": [
            "off",
            {
                "accessibility": "explicit"
            }
        ],
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/interface-name-prefix": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-inferrable-types": "off",
        "@typescript-eslint/member-ordering": [
            "error",
            {
                "default": {
                    "order": "alphabetically",
                    "memberTypes": [
                        [
                            "set",
                            "get"
                        ]
                    ]
                },
                "classes": {
                    "order": "alphabetically",
                    "memberTypes": [
                        [
                            "public-static-set",
                            "public-static-get"
                        ],
                        [
                            "protected-static-set",
                            "protected-static-get"
                        ],
                        [
                            "private-static-set",
                            "private-static-get"
                        ],
                        "public-static-field",
                        "protected-static-field",
                        "private-static-field",
                        [
                            "public-decorated-set",
                            "public-decorated-get",
                            "public-instance-set",
                            "public-instance-get"
                        ],
                        [
                            "protected-decorated-set",
                            "protected-decorated-get",
                            "protected-instance-set",
                            "protected-instance-get"
                        ],
                        [
                            "private-decorated-set",
                            "private-decorated-get",
                            "private-instance-set",
                            "private-instance-get"
                        ],
                        "public-field",
                        "protected-field",
                        "private-field",
                        "constructor",
                        "public-static-method",
                        "protected-static-method",
                        "private-static-method",
                        "public-instance-method",
                        "protected-instance-method",
                        "private-instance-method"
                    ]
                }
            }
        ],
        "@typescript-eslint/naming-convention": [
            "error",
            {
                "selector": "default",
                "format": [
                    "camelCase"
                ]
            },
            {
                "selector": "objectLiteralProperty",
                "format": null,
                "modifiers": [
                    "requiresQuotes"
                ]
            },
            {
                "selector": "objectLiteralProperty",
                "format": [
                    "camelCase",
                    "snake_case",
                    "PascalCase"
                ]
            },
            {
                "selector": "variable",
                "format": [
                    "camelCase"
                ],
                "leadingUnderscore": "forbid"
            },
            {
                "selector": "variable",
                "modifiers": [
                    "exported"
                ],
                "format": [
                    "camelCase",
                    "UPPER_CASE",
                    "PascalCase"
                ],
                "leadingUnderscore": "forbid"
            },
            {
                "selector": "parameter",
                "format": [
                    "camelCase"
                ],
                "leadingUnderscore": "forbid"
            },
            {
                "selector": "parameter",
                "modifiers": [
                    "unused"
                ],
                "format": [
                    "camelCase"
                ],
                "leadingUnderscore": "require",
                "trailingUnderscore": "require"
            },
            {
                "selector": "memberLike",
                "modifiers": [
                    "public",
                    "static",
                    "readonly"
                ],
                "format": [
                    "UPPER_CASE"
                ],
                "leadingUnderscore": "forbid"
            },
            {
                "selector": "memberLike",
                "modifiers": [
                    "protected",
                    "static",
                    "readonly"
                ],
                "format": [
                    "UPPER_CASE"
                ],
                "leadingUnderscore": "require"
            },
            {
                "selector": "memberLike",
                "modifiers": [
                    "private",
                    "static",
                    "readonly"
                ],
                "format": [
                    "UPPER_CASE"
                ],
                "leadingUnderscore": "require"
            },
            {
                "selector": "memberLike",
                "modifiers": [
                    "public"
                ],
                "format": [
                    "camelCase",
                    "PascalCase"
                ],
                "leadingUnderscore": "forbid"
            },
            {
                "selector": "memberLike",
                "modifiers": [
                    "protected"
                ],
                "format": [
                    "camelCase"
                ],
                "leadingUnderscore": "require"
            },
            {
                "selector": "memberLike",
                "modifiers": [
                    "private"
                ],
                "format": [
                    "camelCase"
                ],
                "leadingUnderscore": "require"
            },
            {
                "selector": "classicAccessor",
                "modifiers": [
                    "static",
                    "public"
                ],
                "format": [
                    "UPPER_CASE"
                ],
                "leadingUnderscore": "forbid"
            },
            {
                "selector": "classicAccessor",
                "modifiers": [
                    "static",
                    "protected"
                ],
                "format": [
                    "UPPER_CASE"
                ],
                "leadingUnderscore": "require"
            },
            {
                "selector": "classicAccessor",
                "modifiers": [
                    "static",
                    "private"
                ],
                "format": [
                    "UPPER_CASE"
                ],
                "leadingUnderscore": "require"
            },
            {
                "selector": "typeLike",
                "format": [
                    "PascalCase"
                ]
            },
            {
                "selector": "enumMember",
                "format": [
                    "UPPER_CASE",
                    "PascalCase",
                    "camelCase"
                ]
            }
        ]
    }
};
