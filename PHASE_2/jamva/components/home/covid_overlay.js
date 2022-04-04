import { useState, useEffect } from "react";
import styles from '../../styles/Home.module.scss'
import { Box } from "@chakra-ui/react";

// Display continent covid data
const ContinentCovidData = (props) => {
    const [data, setData] = useState([]);

    // load from backend api the top dieseases in the continent
    useEffect(() => {
        if (props.continent == "World") {
            fetch("https://disease.sh/v3/covid-19/all")
                .then(result => result.json())
                .then(json => {
                    setData(json)
                })
        }
        else {
            fetch("https://disease.sh/v3/covid-19/continents/" + props.continent)
                .then(result => result.json())
                .then(json => {
                    setData(json)
                })
        }
    }, [props.continent]);

    // return component
    return (
        <Box display="flex" padding={"5px"} flexDir="column" w="200px" h="230px" borderWidth='1px' borderRadius='lg' opacity={0.7} backgroundColor={'whitesmoke'} >
            <Box
                mt='1'
                fontWeight='Bold'
                fontSize={20}
                as='h1'
                lineHeight='tight'
                textAlign="center"
            >
                {props.continent}
            </Box>
            <Box textAlign={'center'}
                fontWeight='Bold'
                fontSize={20}
                as='h1'
                lineHeight='tight'
            >
                Covid-19
            </Box>
            <Box as="p" p={"3px"} display="flex" flexDir="column" fontSize={17}>
                <span> <b>Total Cases: </b> {data["cases"]} </span>
                <span><b>Today Cases: </b>{data["todayCases"]}</span>
                <span><b>Deaths: </b>{data["deaths"]}</span>
                <span><b>Today Deaths: </b>{data["todayDeaths"]}</span>
                <span><b>Tests: </b>{data["tests"]}</span>
            </Box>
        </Box>
    )
}




export default ContinentCovidData