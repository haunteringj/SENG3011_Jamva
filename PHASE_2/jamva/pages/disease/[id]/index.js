import React, { useEffect, useState } from "react";
import axios from "axios";
import { Center, ChakraProvider, Heading } from "@chakra-ui/react";
import Link from "next/link";

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
      <div class="centered">
        <div class="align-right">
          <Link href={`/disease/${name}/games`}>
            <button class="button"><span>Play a Game!</span></button>
          </Link>
        </div>
      <h1>{name}</h1>
         

      </div>

      <div class="row">
        <div class="column middle">            
          <div class="left">
              <h2>Overview</h2>
              <p>What is {name}?</p>
              <p><small>{definition}</small></p>
            </div>
          </div>
        <div class="column side">
          <img class="image"/>
        </div>
      </div>


      <div class="centered">
        <h2>Syndromes</h2>
        <p>What are the symptoms of {name}?</p>
        <p><small>{syndromes}</small></p>
      </div>

      <div class="row">
        <div class="column side">            
          <div class="left">
            <h2>How should we diagnose and treat {name}?</h2>
            <p>To diagnose, look out for...</p>
            <p><small>{diagnosis}</small></p>
            <p>How we treat patients with {name}</p>
            <p><small>{treatments}</small></p>
            </div>
          </div>
        <div class="column side">
          <h2>What can we do to prevent {name}?</h2>
          <p><small>{prevention}</small></p>
        </div>
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
  let def = snapshot.data["definition"];
  let syn = snapshot.data["syndromes"];
  let treat = snapshot.data["treatment"]; 
  let diag = snapshot.data["diagnosis"]; 
  let prevent = snapshot.data["prevention"]; 


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

