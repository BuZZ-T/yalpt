import { Printer } from './printer';

type TableCharacters = 'single' | 'double' | 'bold' | 'rounded';

type TableElement = 'horizontal' | 'vertical' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'left' | 'right' | 'middle' | 'top' | 'bottom';

const allTableCharacters: Record<TableCharacters, Record<TableElement, string>> = {
    single: {
        horizontal: '─',
        vertical: '│',
        topLeft: '┌',
        topRight: '┐',
        bottomLeft: '└',
        bottomRight: '┘',
        left: '├',
        right: '┤',
        middle: '┼',
        top: '┬',
        bottom: '┴',
    },
    double: {
        horizontal: '═',
        vertical: '║',
        topLeft: '╔',
        topRight: '╗',
        bottomLeft: '╚',
        bottomRight: '╝',
        left: '╠',
        right: '╣',
        middle: '╬',
        top: '╦',
        bottom: '╩',
    },
    bold: {
        horizontal: '━',
        vertical: '┃',
        topLeft: '┏',
        topRight: '┓',
        bottomLeft: '┗',
        bottomRight: '┛',
        left: '┣',
        right: '┫',
        middle: '╋',
        top: '┳',
        bottom: '┻',
    },
    rounded: {
        horizontal: '─',
        vertical: '│',
        topLeft: '╭',
        topRight: '╮',
        bottomLeft: '╰',
        bottomRight: '╯',
        left: '├',
        right: '┤',
        middle: '┼',
        top: '┬',
        bottom: '┴',
    },
};

function padCenter(value: string, length = 0): string {
    const valueLength = value.length;
    const padding = length - valueLength + 2;
    const leftPadding = Math.floor(padding / 2);
    const rightPadding = padding - leftPadding;
    const leftSpaces = ' '.repeat(leftPadding);
    const rightSpaces = ' '.repeat(rightPadding);
    return `${leftSpaces}${value}${rightSpaces}`;
}

function padEnd(value: string, length = 0): string {
    const valueLength = value.length;
    const padding = length - valueLength + 2;

    return `${value}${' '.repeat(padding)}`;
}

type CreateLineParams = {
    column: Array<string>;
    columnWidths: Array<number>;
    left: string;
    middle: string;
    right: string;
    alignCenter: boolean;
}

export class Table extends Printer<Table> {

    #tableCharacters = allTableCharacters.double;

    public constructor(stdio: NodeJS.WriteStream) {
        super(stdio);
    }

    public self(): Table {
        return this;
    }

    /**
     * No state, no stop
     */
    public stop(): Table {
        return this;
    }

    public setTableCharacters(characters: TableCharacters): void {
        this.#tableCharacters = allTableCharacters[characters];
    }

    public setCustomTableCharacters(characters: Record<TableElement, string>): void {
        this.#tableCharacters = {
            horizontal: characters.horizontal,
            vertical: characters.vertical,
            topLeft: characters.topLeft,
            topRight: characters.topRight,
            bottomLeft: characters.bottomLeft,
            bottomRight: characters.bottomRight,
            left: characters.left,
            right: characters.right,
            middle: characters.middle,
            top: characters.top,
            bottom: characters.bottom
        };
    }

    #createLine({ column, columnWidths, left, middle, right, alignCenter }: CreateLineParams): string {
        const padFn = alignCenter ? padCenter : padEnd;

        return `${left}${column.map((cell, index) => padFn(cell, columnWidths[index])).join(middle)}${right}`;
    }

    #drawTable<T extends Record<string, unknown>>(data: Array<T>, columns: Array<keyof T>, columnTitles: Array<string | undefined | null>, widths: Array<number>): string {
        const topLine = this.#createLine({
            column: columns.map((_, index) => this.#tableCharacters.horizontal.repeat((widths[index] || 0) + 2)),
            columnWidths: widths,
            left: this.#tableCharacters.topLeft,
            middle: this.#tableCharacters.top,
            right: this.#tableCharacters.topRight,
            alignCenter: true
        });

        const tableTitles = columns.map((column, index) =>
            columnTitles[index] || String(column));

        const header = this.#createLine(
            {
                column: tableTitles,
                columnWidths: widths,
                left: this.#tableCharacters.vertical,
                middle: this.#tableCharacters.vertical,
                right: this.#tableCharacters.vertical,
                alignCenter: true
            }
        );
        const separator = this.#createLine({
            column: columns.map((_, index) => this.#tableCharacters.horizontal.repeat((widths[index] || 0) + 2)),
            columnWidths: widths,
            left: this.#tableCharacters.left,
            middle: this.#tableCharacters.middle,
            right: this.#tableCharacters.right,
            alignCenter: true
        });

        const content = data.map(row =>
            this.#createLine({
                column: columns.map(column => ` ${row[column]} `),
                columnWidths: widths,
                left: this.#tableCharacters.vertical,
                middle: this.#tableCharacters.vertical,
                right: this.#tableCharacters.vertical,
                alignCenter: false
            })
        ).join('\n');

        const bottomLine = this.#createLine({
            column: columns.map((_, index) => this.#tableCharacters.horizontal.repeat((widths[index] || 0) + 2)),
            columnWidths: widths,
            left: this.#tableCharacters.bottomLeft,
            middle: this.#tableCharacters.bottom,
            right: this.#tableCharacters.bottomRight,
            alignCenter: true
        });

        const table = topLine + '\n' + header + '\n' + separator + '\n' + content + '\n' + bottomLine;
        return table;
    }

    #calculateColumnWidth<T extends Record<string, unknown>>(
        data: Array<T>,
        columns: Array<keyof T>,
        columnTitles: Array<string | undefined | null>): Array<number> {

        return data.reduce<Array<number>>((acc, row) => {
            columns.forEach((column, columnIndex) => {
                const value = row[column];
                const valueLength = String(value).length;

                if (!acc[columnIndex] || valueLength > acc[columnIndex]) {
                    acc[columnIndex] = valueLength;
                }
            });

            return acc;
        }, columns.map((column, index) => String(columnTitles[index] || column).length));
    }

    public table<T extends Record<string, unknown>>(
        data: Array<T>,
        columns: Array<keyof T>,
        columnTitles: Array<string | undefined | null> = []): void {
        const widths = this.#calculateColumnWidth(data, columns, columnTitles);

        const table = this.#drawTable(data, columns, columnTitles, widths);

        this.clearLine()
            .write(table)
            .newline();
    }
}
