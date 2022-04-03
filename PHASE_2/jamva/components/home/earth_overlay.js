import { useState, useEffect } from "react";
import Link from "next/link"
import styles from '../../styles/Home.module.scss'

// receives a continent and a list of dieseases and prints then out
const TopDiseases = (props) => {

    const [data, setData] = useState([]);

    // process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    // const https = require("https");
    // const agent = new https.Agent({
    // rejectUnauthorized: false
    // })

    // load from backend api the top dieseases in the continent
    useEffect(() => {
        fetch("http://127.0.0.1:8000/v1/top5Dieseases?continent=" + props.continent)
            .then(result => result.json())
                .then(json => {
                    setData(json)
                })
    }, [props.continent]);

    // format the data into a string
    const D1 = data[1] + "\n"
    const D2 = data[2] + "\n"
    const D3 = data[3] + "\n"

    // return component
    return (
        <div className={styles.overlay}>
            <b>{props.continent}'s Top Dieseases</b>
            <div className={styles.diseaseList}>
                <ol>
                    <li>
                    <Link href="/user">{D1}</Link>
                    </li>
                    <li>
                    <Link href="/user">{D2}</Link>
                    </li>
                    <li>
                    <Link href="/user">{D3}</Link>
                    </li>
                </ol>
                </div>
        </div>
    )
}

export default TopDiseases