import { useState, useEffect } from "react";
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
    const toplimit = 3
    var body = ""
    for(var key in data) {
        if (key <= toplimit){
            var value = data[key];
            body = body + key + ". " + value + "\n"
        }
    }

    // return component
    return (
        <div>
            <h> {props.continent}'s Top Dieseases</h>
            <body>{body}</body>
        </div>
    )
}

export default TopDiseases