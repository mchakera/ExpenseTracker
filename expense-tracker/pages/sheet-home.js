import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { useEffect, useState } from 'react';
import ExpenseRow from '../components/expense-row';
import { useRouter } from 'next/router';
import { toFloat, createCSV, download } from '../utils/utils.js';



export default function SheetHome() {
  const { query } = useRouter();
  var queryNames = query.names ? query.names : [];
  let [members, setMembers] = useState([...queryNames]);
  let [items, setItems] = useState([]);
  let [tax, setTax] = useState({ name: "Tax", price: 0, shares: new Array(members.length).fill(1) });
  let [tip, setTip] = useState({ name: "Tip", price: 0, shares: new Array(members.length).fill(1) });
  let [totals, setTotals] = useState({ name: "Totals", price: 0, shares: new Array(members.length).fill(0) });
  let [error, setError] = useState(false);

  function insertRow() {
    setItems([...items, { name: "", price: 0, shares: new Array(members.length).fill(1) }]);
    totalsChange(-1, {});
  }

  function removeRow() {
    setItems(items.slice(0, -1));
    totalsChange(-1, {});
  }

  function downloadCsv() {
    if(error) return;
    var csv = createCSV(members, items, tax, tip, totals);
    download("split.csv", csv);
  }

  function rowChange(index, newRow) {
    var newItems = [...items];
    newItems[index] = newRow;
    setItems(newItems);
    totalsChange(-1, {});
  }

  function taxChange(index, newRow) {
    setTax({ ...newRow });
    totalsChange(-1, {});
  }

  function tipChange(index, newRow) {
    setTip({ ...newRow });
    totalsChange(-1, {});
  }

  function totalsChange(index, newRow) {
    var newTotals = { ...totals }
    var totalValue = 0;
    var shares = new Array(members.length).fill(0);

    try {
      setError(false);

      // calculate individual item shares
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var price = toFloat(item.price);
        totalValue += price;

        var totalshares = item.shares.reduce((a, b) => toFloat(a) + toFloat(b), 0);

        for (var j = 0; j < item.shares.length; j++) {
          shares[j] += price * (toFloat(item.shares[j]) / totalshares);
        }
      }

      // calculate tax and tip split
      var taxValue = toFloat(tax.price);
      var tipValue = toFloat(tip.price);
      for (var i = 0; i < members.length; i++) {
        var proportion = (shares[i] / totalValue);
        shares[i] += taxValue * proportion + tipValue * proportion;
      }
      totalValue += taxValue + tipValue;
    } catch (e) {
      setError(true);
    }

    newTotals.price = totalValue;
    newTotals.shares = shares;
    setTotals({ ...newTotals });
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className={styles.title}>
          Expense Sheet Creator
        </h1>

        <div className={styles.controls}>
          <button onClick={insertRow}>
            Insert Row
          </button>

          <button onClick={removeRow}>
            Remove Row
          </button>

          {!error && <button onClick={downloadCsv}>
            Download CSV
          </button>}
        </div>
        <br />
        {
          error && <p className={styles.error}>There is an error with inputs, make sure all numbers are numbers.</p>
        }

        {items.length > 0 &&
          <div className={styles.sheet}>
            <div className={styles.row}>
              <h3 className={styles.sheetheaderelement}> S No. </h3>
              <h3 className={styles.sheetheaderelement}> Item Name</h3>
              <h3 className={styles.sheetheaderelement}> Item Price</h3>
              {
                members.map(function (member, i) {
                  return <h3 key={i} className={styles.sheetheaderelement}>{member}</h3>
                })
              }
            </div>
            {items.map(function (item, i) {
              return <ExpenseRow row={item} key={i} index={i} rowChange={rowChange} />;
            })}
            <ExpenseRow row={tax} index={items.length + 1} rowChange={taxChange} editable='false' />
            <ExpenseRow row={tip} index={items.length + 2} rowChange={tipChange} editable='false' />
            <ExpenseRow row={totals} index={items.length + 3} rowChange={totalsChange} editable='false' totalsRow='true' />
          </div>
        }

      </main>

      <footer>
      </footer>
    </div>
  );
}
