import react from "react";
import Link from "next/link"
import styles from '../../styles/Home.module.scss'

export default function ReportOverlay({ report }) {

    const [visible, setVisible] = react.useState(false)

    react.useEffect(() => {
        if (report !== {}) setVisible(true);
        else setVisible(false);
    }, [report]);

    console.log(report);

    return ( visible ? 
        <div>
            <h> <b>Reports</b></h>
            <body>
            <div className={styles.diseaseList}>
                <ol>
                    <li>
                    
                    {report["headline"]}
                    hello
                    </li>
                    {/* <li>
                    <Link href="/user">{D2}</Link>
                    </li>
                    <li>
                    <Link href="/user">{D3}</Link>
                    </li> */}
                </ol>
                </div>
            </body>
        </div> : null
    )




}