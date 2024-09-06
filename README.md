# smp-logger

A logger service that **standardizes** and **centralizes** logs across your applications.

## What

It works as a **singleton** to avoid any computational waist.
You can configure multiple instances by passing an application name when you call the init method.
The logger is bound to the base logger (e.g. the console), so the Web Console shows the correct file and line number of the original call.
To create your own logger wrapping any logger other than console, just extend this to unlock all the power of a commonly controllable interface to logs.
This class allows adding more features, such as timestamp and metadata, or customizing the format of the logs, by enabling and configuring the preprocessingFn (again, extend it to customize the behaviour).

## Why

I needed a way to centralize my log handling, to make all the logs go through log applications that apparently don't work with **monkey patching** and also have a central switch to decide which logs need to be actually produced.
Also, while _Sentry_ for example can collect everything without any action on your side, Datadog cannot.
So I used this library to create a centralize handler for both FE and BE. At FE it wraps Datadog Browser Logger, at BE it wraps Winston to send logs with http calls.

## Usage

### Default singleton instance

```ts
SmpLoggerService.init({
    level: SmpLoggingLevels.DEBUG,
    enableSessionId: !0
});

//

const log = SmpLoggerService.INSTANCE;
const foo = "bar";
log.info("Set my var", foo);

```

### Named multi instance

In this scenario we exploit the preprocessing to automatically add the "checkout" context (actually a tag) to each log automatically.
See the customizing section to know how to change and improve this behaviour.

```ts
SmpLoggerService.init({
    level: SmpLoggingLevels.DEBUG,
    enableSessionId: !0,
    enablePreprocessing: !0
}, "checkout");

//

const log = SmpLoggerService.get("checkout");
const foo = "bar";
log.info("Set my var", foo);

```

### Change the logger

```ts
    protected _updateLevel(newValue: KikLoggingLevels = KikLoggingLevels.WARN) {
        KikLoggerMethods.describe().forEach((key) => {
            this[key] = kikNoop;
        });
        KikFirebaseLoggerService._level = newValue;
        this._setup(logger || console);
    }
```

Why do I need to override the whole "_updateLevel" method?

Because you may want to load your own logger asyncronously. E.g. 

```ts
    protected _updateLevel(newValue: KikLoggingLevels = KikLoggingLevels.WARN) {
        KikLoggerMethods.describe().forEach((key) => {
            this[key] = kikNoop;
        });
        KikFirebaseLoggerService._level = newValue;
        if(typeof window !== typeof void 0) {
            logger = await import("@datadog/browser-logs").then((lib) => lib.datadogLogs);
        }
        else {
            const winston = await import("winston");
            logger = winston.createLogger({
                // Don't even need to pass the level here, cause SmpLogger is already filtering enabled levels ;)
                format: winston.format.json() 
            });
        }
    }
```

### Customize

Extend it to add your custom logics, or override behaviours.
Here for example we want to exploit the default preprocessing, but convert all passed data to JSON

```ts
class MyLogger extends SmpLoggerService {
    preprocessArgs(level: KikGenericLoggerMethodKeys, ...args: any[]): [string, string, ...string[]] {
        const baseProcessing = this._defaultPreprocessArgs(level, ...args);

        return [
            baseProcessing.shift(), // Timestamp
            baseProcessing.shift(), // Message
            ...baseProcessing.map(value => {
                return JSON.stringify({
                    tags: [this._appName, `level-${KikLoggingLevels[this.level]}`, level],
                    timestamp: +now,
                    sessionId: this.sessionId,
                    metadata: this.filterSensitiveData(value)
                });
            })
        ];
    }

}

//

MyLogger.init({
    level: SmpLoggingLevels.INFO,
    enablePreprocessing: !0
});

//

const log = MyLogger.INSTANCE;
const someObject = {
    foo: new Date()
};
log.info("Set my var", someObject);

```