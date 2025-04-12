export type PrinterWriteStream = Pick<NodeJS.WriteStream, 'write' | 'clearLine' | 'cursorTo' | 'moveCursor'>

export type LoggerConfig<Success extends string | TextFunction, Fail extends string | TextFunction> = {
    start: string
    success: Success
    fail: Fail
}

export type StringLoggerConfig = LoggerConfig<string, string>

export type AnyLoggerConfig = LoggerConfig<string | TextFunction, string | TextFunction>

export type ProgressConfig = {
    start: string
    success: string
    fail: string
    showNumeric?: boolean
    barLength?: number
    steps?: number
    unit?: string
}

export type TextFunction = (key: string) => string
