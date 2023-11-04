import { useState } from 'react';
import styles from '../styles/Home.module.css';


export default function NameRow(props) {
    function nameChange(event) {
        var newRow = props.row;
        newRow.name = event.target.value;
        props.rowChange(props.index, newRow);
    }

    return (
        <div className={styles.row}>
            <p className={styles.sheetrowelement}>{props.index + 1}.</p>
            <input className={styles.sheetrowelement} placeholder="Item name" value={props.row.name} onChange={nameChange}/>
        </div>
    )
}