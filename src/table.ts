import { Printer } from './printer';
import { isArrayOfArrays } from './utils/typeguards';

type TableCharacters = 'single' | 'double' | 'bold' | 'rounded';

type TableElement =
    | 'horizontal'
    | 'vertical'
    | 'topLeft'
    | 'topRight'
    | 'bottomLeft'
    | 'bottomRight'
    | 'left'
    | 'right'
    | 'middle'
    | 'top'
    | 'bottom'
    | 'separatorLeft'
    | 'separatorRight'
    | 'separatorMiddle'
    | 'separatorHorizontal';

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
        separatorLeft: '├',
        separatorRight: '┤',
        separatorMiddle: '┼',
        separatorHorizontal: '─',
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
        separatorLeft: '╟',
        separatorRight: '╢',
        separatorMiddle: '╫',
        separatorHorizontal: '─',
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
        separatorLeft: '┠',
        separatorRight: '┨',
        separatorMiddle: '╂',
        separatorHorizontal: '─',
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
        separatorLeft: '├',
        separatorRight: '┤',
        separatorMiddle: '┼',
        separatorHorizontal: '─',
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
            bottom: characters.bottom,
            separatorLeft: characters.separatorLeft,
            separatorRight: characters.separatorRight,
            separatorMiddle: characters.separatorMiddle,
            separatorHorizontal: characters.separatorHorizontal,
        };
    }

    #createLine({ column, columnWidths, left, middle, right, alignCenter }: CreateLineParams): string {
        const padFn = alignCenter ? padCenter : padEnd;

        return `${left}${column.map((cell, index) => padFn(cell, columnWidths[index])).join(middle)}${right}`;
    }

    #createSeparator<T extends Record<string, unknown>>(columns: Array<keyof T>, widths: Array<number>, isHeadline: boolean): string {
        return this.#createLine({
            column: columns.map((_, index) => (isHeadline ? this.#tableCharacters.horizontal : this.#tableCharacters.separatorHorizontal).repeat((widths[index] || 0) + 2)),
            columnWidths: widths,
            left: isHeadline ? this.#tableCharacters.left : this.#tableCharacters.separatorLeft,
            middle: isHeadline ? this.#tableCharacters.middle : this.#tableCharacters.separatorMiddle,
            right: isHeadline ? this.#tableCharacters.right : this.#tableCharacters.separatorRight,
            alignCenter: true
        });
    }

    #drawTable<T extends Record<string, unknown>>(
        data: Array<Array<T>>,
        columns: Array<keyof T>,
        columnTitles: Array<string | undefined | null>,
        widths: Array<number>): string {

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
        const separator = this.#createSeparator(columns, widths, true);
        const groupSeparator = this.#createSeparator(columns, widths, false);

        const content = data.map(group => {

            return group.map(row =>
                this.#createLine({
                    column: columns.map(column => ` ${row[column]} `),
                    columnWidths: widths,
                    left: this.#tableCharacters.vertical,
                    middle: this.#tableCharacters.vertical,
                    right: this.#tableCharacters.vertical,
                    alignCenter: false
                })
            ).join('\n');
        }).join(`\n${groupSeparator}\n`);

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

    /**
     * TODO
     * If an array of arrays is passed, the content is grouped by the given inner arrays
     */
    public table<T extends Record<string, unknown>>(
        data: Array<T> | Array<Array<T>>,
        columns: Array<keyof T>,
        columnTitles: Array<string | undefined | null> = []): void {

        const dataArr: Array<Array<T>> = isArrayOfArrays(data) ? data : [data];

        const widths = this.#calculateColumnWidth(dataArr.flat(), columns, columnTitles);

        const table = this.#drawTable(dataArr, columns, columnTitles, widths);

        this.clearLine()
            .write(table)
            .newline();
    }
}

export const table = new Table(process.stdout);
export const tableErr = new Table(process.stderr);
