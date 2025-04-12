# Yet another logging-the-progress tool

Yes, it's yet another logging tool. It first first created as a util of [rusted-chromium](https://github.com/BuZZ-T/rusted-chromium) and then extracted, to be used in other cli-tools, like [abandoned-packages](https://github.com/BuZZ-T/abandoned-packages).

Therefore, it only consists of logging functionality, which is used in these projects.

It has a really strange name? Yes, free package names starting with "yet another" are rare to find... :)

## (general functionality)

These methods are available in each of the following logging tools.

| Method | Description | Usage
|-|-|-
| `.silent()` | completely supress all output | |
| `.noColor()` | don't add special characters for color/bold output | Can be useful for server logs, where these characters are not interpreted, but simply printed, which makes the logging output hard to read |
| `.noProgress()` | Supress animations | Can be useful for server logs, where deleting characters in the current line is not supported and a new line is  printed instead |


## logger

A simple one-line logging statement, in severity "debug", "info", "warn" and "error".
"debug" can be de-/activated using:
```js
// on
logger.setDebugMode(DebugMode.DEBUG)
// off
logger.setDebugMode(DebugMode.NONE)
```

## spinner

| Method | Description | Usage
|-|-|-
| `.start(loggerConfig: AnyLoggerConfig)` | | |
| `.update(text: string)` | | |
| `.success()` | | |
| `.error()` | | |

## progress
