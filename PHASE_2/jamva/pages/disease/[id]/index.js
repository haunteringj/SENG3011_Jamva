import React, { useEffect, useState } from "react";
import axios from "axios";
import { Center, ChakraProvider, Heading } from "@chakra-ui/react";
import Link from "next/link";
import "../../../styles/disease.css";
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
        <h1>{name}</h1>
      </div>
      <div className="title"></div>

      <div className="row">
        <div className="column middle">
          <div className="left">
            <h2>Overview</h2>
            <p>What is {name}?</p>
            <p>
              <small>{definition}</small>
            </p>
          </div>
        </div>
        <div className="column side">
          <img className="image" />
        </div>
      </div>

      <div className="centered">
        <h2>Syndromes</h2>
        <p>What are the symptoms of {name}?</p>
        <p>
          <small>{syndromes}</small>
        </p>
      </div>
      <div className="title"></div>
      <div className="row">
        <div className="column side">
          <div className="left">
            <div className="spacing">
              <h2>How should we diagnose and treat {name}?</h2>
              <p>To diagnose, look out for...</p>
              <p>
                <small>{diagnosis}</small>
              </p>
              <p>How we treat patients with {name}</p>
              <p>
                <small>{treatments}</small>
              </p>
            </div>
          </div>
        </div>
        <div className="column side">
          <div className="spacing">
            <h2>What can we do to prevent {name}?</h2>
            <p>
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
  const snapshot = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/diseases/search?disease=${disease_name}`
  );

  // for elements in API which are incomplete for empty
  if (snapshot.data["syndromes"].length == 0) {
    return { props: {} };
  }

  let name = snapshot.data["diseaseName"];
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
