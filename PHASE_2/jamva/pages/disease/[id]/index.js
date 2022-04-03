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
    `${process.env.NEXT_PUBLIC_API_URL}/v1/diseases/search?disease=${disease_name}`
  );

  // for elements in API which are incomplete for empty
  if (snapshot.data["syndromes"].length  == 0) {
    return { props: {}}
  }

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

