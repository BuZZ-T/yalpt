import { PrinterWriteStream } from '../../types/printer.types';

export const createStdioMock = (): jest.MaybeMockedDeep<PrinterWriteStream> => ({
    write: jest.fn(),
    clearLine: jest.fn(),
    cursorTo: jest.fn(),
    moveCursor: jest.fn(),
})
