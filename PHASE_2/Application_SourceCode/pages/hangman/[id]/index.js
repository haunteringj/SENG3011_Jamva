import React, { useState, useEffect } from "react";
import axios from "axios";
import Figure from "../../../components/hangman/Figure";
import WrongLetters from "../../../components/hangman/WrongLetters";
import Word from "../../../components/hangman/Word";
import Popup from "../../../components/hangman/Popup";
import Notification from "../../../components/hangman/Notification";
import { Center, ChakraProvider, Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";
import {
  showNotification as show,
  checkWin,
} from "../../../utils/helpers/helpers";
import https from "https";

var selectedWord = "";
export default function Hangman(data) {
  const [playable, setPlayable] = useState(true);
  const [correctLetters, setCorrectLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const router = useRouter();
  let words = data["wordList"];
  let forfun = data["fun"];
  if (words.length == 0) {
    forfun = true;
    words = data["allwords"];
  }
  let disease = data.diseaseName;
  let facts = data["facts"];
  useEffect(() => {
    const handleKeydown = (event) => {
      const { key, keyCode } = event;
      if (playable && keyCode >= 65 && keyCode <= 90) {
        const letter = key.toLowerCase();
        if (selectedWord.includes(letter)) {
          if (!correctLetters.includes(letter)) {
            setCorrectLetters((currentLetters) => [...currentLetters, letter]);
          } else {
            show(setShowNotification);
          }
        } else {
          if (!wrongLetters.includes(letter)) {
            setWrongLetters((currentLetters) => [...currentLetters, letter]);
          } else {
            show(setShowNotification);
          }
        }
      }
    };
    window.addEventListener("keydown", handleKeydown);

    return () => window.removeEventListener("keydown", handleKeydown);
  }, [correctLetters, wrongLetters, playable]);

  function playAgain() {
    if (checkWin(correctLetters, wrongLetters, selectedWord) === "win") {
      let remove = words.indexOf(selectedWord);
      words.splice(remove, 1);
    }
    if (forfun == false) {
      const httpsAgent = new https.Agent({ rejectUnauthorized: false });
      const profleData = axios.post(
        `http://${process.env.NEXT_PUBLIC_API_URL}/v1/hangman/complete/${disease}/f3BNKAJFnlZuLZVuX1Zpk77TCsr2/${selectedWord}`,
        { httpsAgent }
      );
    } else setPlayable(true);
    setCorrectLetters([]);
    setWrongLetters([]);
    if (words.length == 0) {
      words = data["allwords"];
    }
    const random = Math.floor(Math.random() * words.length);

    selectedWord = words[random];
    console.log(words.length);
  }
  if (selectedWord == "") {
    selectedWord = data.word;
  }
  console.log(selectedWord);
  return selectedWord == "" ? (
    <ChakraProvider>
      <div className="selectionHeader">
        <button
          className="backButton custom-btn"
          onClick={() => router.push(`/disease/${disease}/games`)}
        >
          Back
        </button>
        <Heading color="white">
          There are currently no words for this hangman!
        </Heading>
        <Heading color="white">Check back later!</Heading>
      </div>
    </ChakraProvider>
  ) : (
    <div>
      <ChakraProvider>
        <div className="hangman-container">
          <div className="selectionHeader">
            <button
              className="backButton custom-btn"
              onClick={() => router.push(`/disease/${disease}/games`)}
            >
              Back
            </button>
            <Center>
              <h1>{disease} Hangman</h1>
            </Center>
            <Center>
              <p>Find the hidden word - Enter a letter</p>
            </Center>
            {forfun ? (
              <p>
                You have completed this Disease's hangman! Currently playing for
                fun.
              </p>
            ) : (
              <></>
            )}
          </div>

          <div className="game-container">
            <div>
              <Figure wrongLetters={wrongLetters} />
              <WrongLetters wrongLetters={wrongLetters} />
              <Word
                selectedWord={selectedWord}
                correctLetters={correctLetters}
              />
            </div>
            <Popup
              correctLetters={correctLetters}
              wrongLetters={wrongLetters}
              fact={facts[selectedWord]}
              forfun={forfun}
              wordsLeft={words}
              selectedWord={selectedWord}
              setPlayable={setPlayable}
              playAgain={playAgain}
            />
            <Center>
              <Notification showNotification={showNotification} />
            </Center>
          </div>
        </div>
      </ChakraProvider>
    </div>
  );
}
export async function getServerSideProps(context) {
  const hangmanId = context.query.id;
  const httpsAgent = new https.Agent({ rejectUnauthorized: false });
  const snapshot = await axios.get(
    `http://${process.env.NEXT_PUBLIC_API_URL}/v1/hangman/${hangmanId}/f3BNKAJFnlZuLZVuX1Zpk77TCsr2`,
    { httpsAgent }
  );
  let wordSelection = [];
  let forfun = false;
  if (snapshot.data != null) {
    wordSelection = snapshot.data["difference"];
  }
  console.log(snapshot.data);
  var selectedWord = "";
  if (wordSelection.length == 0) {
    forfun = true;
    var selectedWord =
      snapshot.data["allwords"][
        Math.floor(Math.random() * snapshot.data["allwords"].length)
      ];
  } else {
    var selectedWord =
      wordSelection[Math.floor(Math.random() * wordSelection.length)];
  }
  console.log(selectedWord);
  return selectedWord == undefined
    ? {
        props: {
          word: "",
          wordList: wordSelection,
          diseaseName: hangmanId,
          facts: snapshot.data["facts"],
          fun: forfun,
          allwords: snapshot.data["allwords"],
        },
      }
    : {
        props: {
          word: selectedWord,
          wordList: wordSelection,
          diseaseName: hangmanId,
          facts: snapshot.data["facts"],
          fun: forfun,
          allwords: snapshot.data["allwords"],
        },
      };
}
