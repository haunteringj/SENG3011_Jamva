import React, { useEffect, useState } from "react";
import axios from "axios";

const disease_info = (props) => {

  const [data, setData] = useState([]);

  useEffect(() => {
    //fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/diseases/search?${disease}=` + props.disease)
    fetch("http://127.0.0.1:8000/v1/diseases/search?disease=Ebola")
        .then(result => result.json())
            .then(json => {
                setData(json)
            })
  }, [props.continent]);

  // format the data into a string
  const D1 = data[1] + "\n"
  const D2 = data[2] + "\n"
  const D3 = data[3] + "\n"

  return (
    <div>
      <h1> {props.continent}'s Top Dieseases </h1>
        <b1>{D1}</b1>
        </div>
  )
}

export default disease_info;

/*
import React, { useEffect, useState } from "react";
import axios from "axios";

const disease_info = () => {
  const [data, setData] = useState([]);

  /*
  // load from backend api the top dieseases in the continent
  useEffect(() => {
      //fetch("http://127.0.0.1:8000/v1/top5Dieseases?continent=" + props.continent)
      fetch("http://127.0.0.1:8000/v1/diseases/search?disease=" + "Ebloa")
          .then(result => result.json())
              .then(json => {
                  setData(json)
              })
  }, [props.continent]);
  

  let disease_inf;
  disease_inf = this.diseaseses_info("Ebola");
  
  // return component
  return (
      <div>
          <h1>{diseaseses_info}</h1>
      </div>
  )
}

export default disease_info

export async function getDiseases(disease) {
  const snapshot = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/diseases/search?${disease})`
  );

  return snapshot
}


diseaseses_info =  async() => {
  await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/diseases/search?${disease})`
    );
  }

*/