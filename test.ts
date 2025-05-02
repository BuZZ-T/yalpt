import { Table } from './src/table';

function main() {
    const table = new Table(process.stdout);

    const data = [
        [
            { name: 'John', age: 30, city: 'New York' },
            { name: 'Jane', age: 25, city: 'Los Angeles' },
        ],
        [
            { name: 'Mike', age: 35, city: 'Chicago' },
            { name: 'Alice', age: 28, city: 'San Francisco' },
        ],
        [
            { name: 'Bob', age: 32, city: 'Seattle' },
            { name: 'Charlie', age: 29, city: 'Boston' },
        ]
    ];

    // table.setTableCharacters('rounded');

    // table.table(data, ['name', 'age', 'city'], ['Name', 'Age', 'City']);

    table.table(data/* .flat() */, ['name', 'age', 'city'], ['Name', 'Age', 'City']);
}

main();
