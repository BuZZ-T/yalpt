# Yet another logging-the-progress tool

Yes, it's yet another logging tool. It was first created as a util of [rusted-chromium](https://www.npmjs.com/package/rusted-chromium) and then extracted, to be used in other cli-tools, like [abandoned-packages](https://github.com/BuZZ-T/abandoned-packages).

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

### usage
**create**
```
const logger = new Logger(process.stdout);
```

"debug" can be de-/activated using:
```js
// on
logger.setDebugMode(DebugMode.DEBUG)
// off
logger.setDebugMode(DebugMode.NONE)
```

## spinner

**create**
```ts
const spinner = new Spinner(process.stdout);
```

**start spinning**
```
spinner.start(...)
```

**update Text (to publish process)**
```
spinner.update(text);
```

| Method | Description | Usage
|-|-|-
| `.start(loggerConfig: AnyLoggerConfig)` | | |
| `.update(text: string)` | | |
| `.success()` | | |
| `.error()` | | |

## progress

## table

### .table

Draws a table.

```
.table<T extends Record<string, unknown>>(
  data: Array<T>,
  columns: Array<keyof T>,
  columnTitles: Array<string | undefined | null> = []
)
```

"`data`" is the complete array of data. May include fields which are not displayed in the table.

"`columns`" are the keys of the fields which should be displayed.

"`columnTitles`" is an optional array of strings to set as value of the header field of the column. | `table.table([{first: 'Michael', last: 'Smith', age: 25}, {first: 'John', last: 'Doe', age: '?'}, ['first', 'last'], ['Firstname', 'Lastname'])`