import { Printer } from './printer';

const tableCharacters = {
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

    private createLine({ column, columnWidths, left, middle, right, alignCenter }: CreateLineParams): string {
        const padFn = alignCenter ? padCenter : padEnd;

        return `${left}${column.map((cell, index) => padFn(cell, columnWidths[index])).join(middle)}${right}`;
    }

    private drawTable(data: Array<Record<string, string | number>>, columns: Array<string>, widths: Array<number>): string {
        const topLine = this.createLine({
            column: columns.map((_, index) => tableCharacters.horizontal.repeat((widths[index] || 0) + 2)),
            columnWidths: widths,
            left: tableCharacters.topLeft,
            middle: tableCharacters.top,
            right: tableCharacters.topRight,
            alignCenter: true
        });
        const header = this.createLine(
            {
                column: columns.map(cell => ` ${cell} `),
                columnWidths: widths,
                left: tableCharacters.vertical,
                middle: tableCharacters.vertical,
                right: tableCharacters.vertical,
                alignCenter: true
            }
        );
        const separator = this.createLine({
            column: columns.map((_, index) => tableCharacters.horizontal.repeat((widths[index] || 0) + 2)),
            columnWidths: widths,
            left: tableCharacters.left,
            middle: tableCharacters.middle,
            right: tableCharacters.right,
            alignCenter: true
        });

        const content = data.map(row =>
            this.createLine({
                column: columns.map(column => ` ${row[column]} `),
                columnWidths: widths,
                left: tableCharacters.vertical,
                middle: tableCharacters.vertical,
                right: tableCharacters.vertical,
                alignCenter: false
            })
        ).join('\n');

        const bottomLine = this.createLine({
            column: columns.map((_, index) => tableCharacters.horizontal.repeat((widths[index] || 0) + 2)),
            columnWidths: widths,
            left: tableCharacters.bottomLeft,
            middle: tableCharacters.bottom,
            right: tableCharacters.bottomRight,
            alignCenter: true
        });

        const table = topLine + '\n' + header + '\n' + separator + '\n' + content + '\n' + bottomLine;
        return table;
    }

    private calculateColumnWidth(
        data: Array<Record<string, string | number>>,
        columns: Array<string>): Array<number> {

        return data.reduce<Array<number>>((acc, row) => {
            columns.forEach((column, columnIndex) => {
                const value = row[column];
                const valueLength = String(value).length;

                if (!acc[columnIndex] || valueLength > acc[columnIndex]) {
                    acc[columnIndex] = valueLength;
                }
            });

            return acc;
        }, columns.map(column => column.length));
    }

    public table(
        data: Array<Record<string, string | number>>,
        columns: Array<string>): void {
        const widths = this.calculateColumnWidth(data, columns);

        const table = this.drawTable(data, columns, widths);

        this.clearLine()
            .write(table)
            .newline();
    }
}