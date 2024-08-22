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

