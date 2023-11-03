import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { useEffect, useState } from 'react';
import ExpenseRow from '../components/expense-row';
import { useRouter } from 'next/router';



export default function SheetHome() {
  const { query } = useRouter();
  let [members, setMembers] = useState([...query.names]);
  let [items, setItems] = useState([]);
  let [tax, setTax] = useState({name: "Tax", price: 0, shares: new Array(members.length).fill(1)});
  let [tip, setTip] = useState({name: "Tip", price: 0, shares: new Array(members.length).fill(1)});
  let [totals, setTotals] = useState({name: "Totals", price: 0, shares: new Array(members.length).fill(0)});
  let [error, setError] = useState(false);

  function insertRow() {
    setItems([...items, { name: "", price: 0, shares: new Array(members.length).fill(1) }]);
    totalsChange(-1, {});
  }

  function removeRow() {
    setItems(items.slice(0, -1));
    totalsChange(-1, {});
  }

  function rowChange(index, newRow) {
    var newItems = [...items];
    newItems[index] = newRow;
    setItems(newItems);
    totalsChange(-1, {});
  }

  function taxChange(index, newRow) {
    setTax({...newRow});
    totalsChange(-1, {});
  }

  function tipChange(index, newRow) {
    setTip({...newRow});
    totalsChange(-1, {});
  }

  function totalsChange(index, newRow) {
    var newTotals = {...totals}
    var totalValue = 0;
    var shares = new Array(members.length).fill(0);

    try {
      setError(false);
      
      // calculate individual item shares
      for(var i = 0; i < items.length; i++) {
        var item = items[i];
        var price = parseFloat(item.price);
        totalValue += price;
        
        var totalshares = item.shares.reduce((a, b) => parseFloat(a) + parseFloat(b), 0);
        
        for(var j = 0; j < item.shares.length; j++) {
          shares[j] += price * (parseFloat(item.shares[j]) / totalshares);
        }
      }

      // calculate tax and tip split
      var taxValue = parseFloat(tax.price);
      var tipValue = parseFloat(tip.price);
      for(var i = 0; i < members.length; i++) {
        var proportion = (shares[i] / totalValue);
        shares[i] += taxValue * proportion + tipValue * proportion;
      }
      totalValue += taxValue + tipValue;
    } catch {
      setError(true);
    }

    newTotals.price = totalValue;
    newTotals.shares = shares;
    setTotals({...newTotals});
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
        </div>
        <br/>
        {
          error && <p>There is an error with inputs, make sure all numbers are numbers.</p>
        }

        { items.length > 0 && 
          <div className={styles.sheet}>
            <div className={styles.row}>
              <h3 className={styles.sheetheaderelement}> S No. </h3>
              <h3 className={styles.sheetheaderelement}> Item Name</h3>
              <h3 className={styles.sheetheaderelement}> Item Price</h3>
              {
                members.map(function(member, i) {
                  return <h3 key={i} className={styles.sheetheaderelement}>{member}</h3>
                })
              }
            </div>
            {items.map(function (item, i) {
              return <ExpenseRow row={item} key={i} index={i} rowChange={rowChange}/>;
            })}
            <ExpenseRow row={tax} index={items.length + 1} rowChange={taxChange} editable='false'/>
            <ExpenseRow row={tip} index={items.length + 2} rowChange={tipChange} editable='false'/>
            <ExpenseRow row={totals} index={items.length + 3} rowChange={totalsChange} editable='false' totalsRow='true'/>
          </div>
        }

      </main>

      <footer>
      </footer>

      <style jsx>{`
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        footer img {
          margin-left: 0.5rem;
        }
        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
          text-decoration: none;
          color: inherit;
        }
        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family:
            Menlo,
            Monaco,
            Lucida Console,
            Liberation Mono,
            DejaVu Sans Mono,
            Bitstream Vera Sans Mono,
            Courier New,
            monospace;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family:
            -apple-system,
            BlinkMacSystemFont,
            Segoe UI,
            Roboto,
            Oxygen,
            Ubuntu,
            Cantarell,
            Fira Sans,
            Droid Sans,
            Helvetica Neue,
            sans-serif;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}
