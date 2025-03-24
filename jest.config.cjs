module.exports = {
    transform: {
        "^.+\\.tsx?$": [
            "ts-jest",
            {
                useESM: true
            }
        ]
    },
    "testEnvironment": "node",
    "testRegex": "\\.(spec|test)\\.ts$",
    "moduleFileExtensions": [
        "ts",
        "tsx",
        "js"
    ],
    extensionsToTreatAsEsm: [".ts"],
    moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1"
    },
    "coveragePathIgnorePatterns": [
        "/node_modules/",
        "/test/"
    ],
    "coverageThreshold": {
        "global": {
            "branches": 75,
            "functions": 90,
            "lines": 90,
            "statements": 90
        }
    },
    "collectCoverageFrom": [
        "src/*.{js,ts}"
    ]
};
