import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { useEffect, useState } from 'react';
import NameRow from '../components/name-row';
import { useRouter } from 'next/router'

export default function Home() {
    const router = useRouter();
    let [items, setItems] = useState([]);

    function insertRow() {
        setItems([...items, { name: "" }]);
    }

    function removeRow() {
        setItems(items.slice(0, -1));
    }

    function rowChange(index, newRow) {
        var newItems = [...items];
        newItems[index] = newRow;
        setItems(newItems);
    }

    function goToSheet() {
        if(!validateMemberNames()) return;
        var names = items.map((name) => {
            return name.name;
        });
        router.push({
            pathname: '/sheet-home',
            query: {
                names: [...names]
            }
        }, '/sheet-home');
    }

    function validateMemberNames() {
        var ret = false;
        for (var i = 0; i < items.length; i++) {
            if(items[i].name == "") return false;
            ret = true;
        }
        return ret;
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Expense Tracker</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                <h1 className={styles.title}>
                    Expense Sheet Creator
                </h1> <br />

                <h2>
                    Please input names of split members:
                </h2>

                <div className={styles.controls}>
                    <button onClick={insertRow}>
                        Insert Row
                    </button>

                    <button onClick={removeRow}>
                        Remove Row
                    </button>
                </div>

                <div className={styles.sheet}>
                    {
                        items.length > 0 && 
                        <div>
                            <div className={styles.row}>
                                <h3 className={styles.sheetheaderelement}> S No. </h3>
                                <h3 className={styles.sheetheaderelement}> Member Name</h3>
                            </div>
                            {items.map(function (item, i) {
                                return <NameRow row={item} key={i} index={i} rowChange={rowChange} />;
                            })}
                        </div>
                    }

                </div>
                <br/>
                { validateMemberNames() && <button onClick={goToSheet}>Next</button> }
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
