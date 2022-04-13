import React, { useEffect, useState } from "react";
import axios from "axios";
import { Center, ChakraProvider, Heading } from "@chakra-ui/react";
import Link from "next/link";
import https from "https";


export default function disease_info(data) {
  let name = data["diseaseName"];
  let definition = data["definition"];
  let syndromes = data["syndromes"];
  let treatments = data["treatments"];
  let diagnosis = data["diagnosis"];
  let prevention = data["prevention"];

  return (
    <div>
      <div className="centered">
        <div className="align-right">
          <Link href={`/disease/${name}/games`}>
            <button className="button">
              <span>Play a Game!</span>
            </button>
          </Link>
        </div>
        <h1 className="white">{name}</h1>
      </div>
      <div className="title"></div>

      <div className="row">
        <div className="column middle">
          <div className="left">
            <h2 className="white">Overview</h2>
            <p className="white">What is {name}?</p>
            <p className="white">
              <small>{definition}</small>
            </p>
          </div>
        </div>
        <div className="column side">
          <img className="image" />
        </div>
      </div>

      <div className="centered">
        <h2 className="white">Syndromes</h2>
        <p className="white">What are the symptoms of {name}?</p>
        <p className="white">
          <small>{syndromes}</small>
        </p>
      </div>
      <div className="title"></div>
      <div className="row">
        <div className="column side">
          <div className="left">
            <div className="spacing">
              <h2 className="white">
                How should we diagnose and treat {name}?
              </h2>
              <p className="white">To diagnose, look out for...</p>
              <p className="white">
                <small>{diagnosis}</small>
              </p>
              <p className="white">How we treat patients with {name}</p>
              <p className="white">
                <small>{treatments}</small>
              </p>
            </div>
          </div>
        </div>
        <div className="column side">
          <div className="spacing">
            <h2 className="white">What can we do to prevent {name}?</h2>
            <p className="white">
              <small>{prevention}</small>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const disease_name = context.query.id;
  const httpsAgent = new https.Agent({ rejectUnauthorized: false });
  const snapshot = await axios.get(
    `https://3.106.142.227/v1/diseases/search?disease=${disease_name}`,
    { httpsAgent }
  );
  console.log("not here")
  let name = snapshot.data["diseaseName"];
  // for elements in API which are incomplete for empty
  if (snapshot.data["syndromes"].length == 0) {
    return { props: {diseaseName: name} };
  }

  let defin = snapshot.data["definition"];
  let synd = snapshot.data["syndromes"];
  let treatmen = snapshot.data["treatment"];
  let diagnose = snapshot.data["diagnosis"];
  let preventing = snapshot.data["prevention"];

  let def = defin.join(". ");
  let syn = synd.join(". ");
  let treat = treatmen.join(". ");
  let diag = diagnose.join(". ");
  let prevent = preventing.join(". ");
  return {
    props: {
      diseaseName: name,
      definition: def,
      syndromes: syn,
      treatments: treat,
      diagnosis: diag,
      prevention: prevent,
    },
  };
}
