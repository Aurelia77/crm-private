'use client'

import React from 'react';
import ReactDOM from 'react-dom';
import { Column, Table, TableRowProps, TableCellProps } from 'react-virtualized';
import 'react-virtualized/styles.css'; // only needs to be imported once

// Table data as an array of objects
const list = [
    { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
    { name: '2Brian Vaughn', description: 'Software engineer', coucou: "hello" },
    { name: '3Brian Vaughn', description: 'Software engineer', coucou: "hello" },
    { name: '4Brian Vaughn', description: 'Software engineer', coucou: "hello" },
    { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
    { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
    { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
    { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
    { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
    { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
    { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
    { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
    { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
    { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
    { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
    { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
    { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
    { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
    { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
    { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
    { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
    { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
    { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
    { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
    { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
    { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
    { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
    { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
    { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
    { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
    { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
    { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
    { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
    { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
    { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
    { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
    { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
    { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
    { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
    { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
    { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
    { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
    { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
    { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
    { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
    { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
    { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
    { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
    { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
    { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
    { name: 'Brian Vaughn', description: 'Software engineer', coucou: "hello" },
];



export default function TestVirtualise2() {

    function rowRenderer({
        key, // Unique key within array of rows
        index, // Index of row within collection
        style, // Style object to be applied to row (to position it)
        //parent // Reference to the parent List (instance)
    }: TableRowProps) {
        return (
            <tr key={key} 
            //style={style}
            >
                <td key="name">{list[index].name}</td>
                <td key="description">{list[index].description}</td>
                <td key="coucou">{list[index].coucou}</td>
            </tr>           
        );
    }

    function cellRenderer({ cellData }: TableCellProps) {
        // Personnalisez le rendu de votre cellule ici
        return <div style={{color: "purple"}} >{cellData}</div>;
    }


    

    return <Table
        width={1100}
        height={300}
        headerHeight={20}
        rowHeight={30}
        rowCount={list.length}
        rowGetter={({ index }) => list[index]}
        //rowRenderer={rowRenderer}
    >
        <Column
            label='Name'
            dataKey='name'
            width={400}
            cellRenderer={cellRenderer}
        />
        <Column
            width={500}
            label='Description'
            dataKey='description'
        />
        <Column
            width={200}
            label='Coucou'
            dataKey='coucou'
        />
    </Table>
}


