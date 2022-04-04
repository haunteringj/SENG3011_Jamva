import React, { useState, useEffect } from "react";
import axios from "axios";
import Figure from "../../../components/hangman/Figure";
import WrongLetters from "../../../components/hangman/WrongLetters";
import Word from "../../../components/hangman/Word";
import Popup from "../../../components/hangman/Popup";
import Notification from "../../../components/hangman/Notification";
import { Center, ChakraProvider, Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { showNotification as show, checkWin } from "../../../utils/helpers/helpers";
var selectedWord = "";
export default function Hangman(data) {
  const [playable, setPlayable] = useState(true);
  const [correctLetters, setCorrectLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const router = useRouter();
  let words = data["wordList"];
  let disease = data.diseaseName;
  console.log(words);
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
    setPlayable(true);
    setCorrectLetters([]);
    setWrongLetters([]);
    console.log(words);
    const random = Math.floor(Math.random() * words.length);
    console.log("random", random);
    selectedWord = words[random];
  }
  if (selectedWord == "") {
    selectedWord = data.word;
  }
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
              <h1>Hangman</h1>
            </Center>
            <Center>
              <p>Find the hidden word - Enter a letter</p>
            </Center>
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
  const snapshot = await axios.get(
    `https://3.106.142.227/v1/hangman/${hangmanId}`
  );
  let allwords = [];
  if (snapshot.data != null) {
    allwords = snapshot.data["words"];
  }
  var selectedWord = allwords[Math.floor(Math.random() * allwords.length)];

  return selectedWord == undefined
    ? { props: { word: "", wordList: allwords, diseaseName: hangmanId } }
    : {
        props: {
          word: selectedWord,
          wordList: allwords,
          diseaseName: hangmanId,
        },
      };
}
