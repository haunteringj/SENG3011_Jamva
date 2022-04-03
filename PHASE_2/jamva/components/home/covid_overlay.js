import { useState, useEffect } from "react";
import styles from '../../styles/Home.module.scss'

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

    // return component
    return (
        <div>
            <h><b>{props.continent}'s Covid-19</b></h>
            <body>
                <b>Cases: </b>{data["cases"]}{"\n"}
                <b>Today Cases: </b>{data["todayCases"]}{"\n"}
                <b>Deaths: </b>{data["deaths"]}{"\n"}
                <b>Today Deaths: </b>{data["todayDeaths"]}{"\n"}
                <b>Tests: </b>{data["tests"]}
            </body>
        </div>
    )
}

export default ContinentCovidData