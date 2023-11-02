import { useState } from 'react';
import styles from '../styles/Home.module.css';


export default function ExpenseRow(props) {
    function nameChange(event) {
        var newRow = props.row;
        newRow.name = event.target.value;
        props.rowChange(props.index, newRow);
    }

    return (
        <div className={styles.row}>
            {props.index + 1}.
            <input placeholder="Item name" value={props.row.name} onChange={nameChange}/>
        </div>
    )
}