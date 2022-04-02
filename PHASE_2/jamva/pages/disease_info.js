import React, { useEffect, useState } from "react";
import axios from "axios";



export default function disease_info(data) {

  let name = data["diseaseName"];
  let definition = data["definition"];
  let syndromes = data["syndromes"];
  let treatments = data["treatments"];
  let diagnosis = data["diagnosis"];
  let prevention = data["prevention"]

  console.log(name);

  return (
    <div>
    <h1> {name} </h1>
      <div> 
        <h2>Overview</h2>
        <b1>Something about the disease and how it spreads </b1>
        <ul>{definition}</ul>
      </div>
      <div> 
        <h2>Syndromes</h2>
        <b1>List of syndromes</b1>
        <ul>{syndromes}</ul>
      </div>
      <div> 
        <h2>Diagnosis and Treatments</h2>
        <b1>How to diagnose</b1>
        <ul>{diagnosis}</ul>
        <b1>List of possible treatments</b1>
        <ul>{treatments}</ul>
        <b1>How to prevent</b1>
        <ul>{prevention}</ul>
      </div>
  </div>
  );
}

export async function getServerSideProps(context) {
  const disease_name = context.query.id;
  const snapshot = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/diseases/search?disease=Tuberculosis`
  );
  let name = snapshot.data["diseaseName"];
  let def = snapshot.data["definition"] 
  let syn = snapshot.data["syndromes"] 
  let treat = snapshot.data["treatment"] 
  let diag = snapshot.data["diagnosis"] 
  let prevent = snapshot.data["prevention"] 


  console.log(name);
  return { props: { 
    diseaseName: name, 
    definition: def, 
    syndromes: syn,  
    treatments: treat,
    diagnosis: diag,
    prevention: prevent
  }};
}



/*
export default function disease_info() {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/diseases/search?id=Ebola`).then((response) => {
      setPost(response.data);
    });
  }, []);
  if (!data) return null;

  return (
    <div>
    <h1>{data.diseaseName}</h1>
    <p>{data.id}</p>
  </div>
  )
}

********************************

export default function disease_info(data) {

  let name = data["diesase_name"];
  console.log(name);

  return (
    <div>
    <h1> Top Dieseases </h1>
      <b1>{name}</b1>
  </div>
  );
}

export async function getServerSideProps(context) {
  const diseaseId = context.query.id;
  const snapshot = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/diseases/search?disease=${diseaseId}`
  );
  let name = snapshot.data["diseaseName"];
  console.log(name);
  let selectedWord = allwords[Math.floor(Math.random() * allwords.length)];
  return { props: { disease_name: name } };
}



***********************
*
const disease_info = (props) => {

  const [data, setData] = useState([]);

  setData({"reports":[],"id":10,"diseaseName":"Ebola","syndromes":[]});
  /*
  useEffect(() => {
    fetch("http://127.0.0.1:8000/v1/diseases/search?disease=Ebola")
  }, []);
  

  const snapshot = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/diseases/search?disease=Ebola`
  );


  // format the data into a string
  const D1 = data[1] + "\n"
  const D2 = data[2] + "\n"
  const D3 = data[3] + "\n"

  return (
    <div>
      <h1> Top Dieseases </h1>
        <b1>{snapshot}</b1>
    </div>
  )
}

export default disease_info;

*/