import { useState } from 'react';
import styles from '../styles/Home.module.css';


export default function ExpenseRow(props) {
    console.log(props);
    var editable = props.editable != undefined ? props.editable == 'true' : true;
    var totalsRow = props.totalsRow != undefined ? props.totalsRow == 'true' : false;
    function nameChange(event) {
        var newRow = props.row;
        newRow.name = event.target.value;
        props.rowChange(props.index, newRow);
    }

    function priceChange(event) {
        var newRow = props.row;
        newRow.price = event.target.value;
        props.rowChange(props.index, newRow);
    }

    function shareChange(idx, share) {
        var newRow = props.row;
        newRow.shares[idx] = share;
        props.rowChange(props.index, newRow);

    }

    return (
        <div className={styles.row}>
            <p className={styles.sheetrowelement}>{props.index + 1}.</p>
            <input className={styles.sheetrowelement} placeholder="Item name" value={props.row.name} onChange={nameChange} disabled={!editable}/>
            <input className={styles.sheetrowelement} value={props.row.price} onChange={priceChange} disabled={totalsRow}/>
            {(editable || totalsRow) && props.row.shares.map(function (share, i) {
              return <input disabled={!editable} className={styles.sheetrowelement} key={i} value={share} onChange={(event) => {shareChange(i, event.target.value)}}/>;
            })}
        </div>
    )
}