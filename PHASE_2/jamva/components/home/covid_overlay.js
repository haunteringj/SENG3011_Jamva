import { useState, useEffect } from "react";

// Display continent covid data
const ContinentCovidData = (props) => {
    const [data, setData] = useState([]);

    // load from backend api the top dieseases in the continent
    useEffect(() => {
        if (props.continent == "World"){
            fetch("https://disease.sh/v3/covid-19/all")
                .then(result => result.json())
                    .then(json => {
                        setData(json)
                    })
        }
        else{
            fetch("https://disease.sh/v3/covid-19/continents/" + props.continent)
                .then(result => result.json())
                    .then(json => {
                        setData(json)
                    })
        }
    }, [props.continent]);

    // format the data into a string
    var body = "Cases: " + data["cases"] + 
        "Today Cases: " + data["todayCases"] + 
        "Deaths: " + data["deaths"] + 
        "Today Deaths" + data["todayDeaths"] +
        "Tests" + data["tests"]

    // return component
    return (
        <div>
            <h> {props.continent}'s Top Dieseases</h>
            <body>{body}</body>
        </div>
    )
}

export default ContinentCovidData