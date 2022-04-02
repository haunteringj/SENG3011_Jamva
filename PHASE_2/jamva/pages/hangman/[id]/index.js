import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../../components/hangman/Header";
import Figure from "../../../components/hangman/Figure";
import WrongLetters from "../../../components/hangman/WrongLetters";
import Word from "../../../components/hangman/Word";
import Popup from "../../../components/hangman/Popup";
import Notification from "../../../components/hangman/Notification";
import { showNotification as show, checkWin } from "./helpers/helpers";

export default function Hangman(data) {
  const [playable, setPlayable] = useState(true);
  const [correctLetters, setCorrectLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  let selectedWord = data["word"];
  let words = data["wordList"];
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

    // Empty Arrays
    setCorrectLetters([]);
    setWrongLetters([]);
    console.log(words);
    const random = Math.floor(Math.random() * words.length);
    selectedWord = words[random];
  }
  return (
    <div className="hangman-container">
      <Header />
      <div className="game-container">
        <Figure wrongLetters={wrongLetters} />
        <WrongLetters wrongLetters={wrongLetters} />
        <Word selectedWord={selectedWord} correctLetters={correctLetters} />
      </div>
      <Popup
        correctLetters={correctLetters}
        wrongLetters={wrongLetters}
        selectedWord={selectedWord}
        setPlayable={setPlayable}
        playAgain={playAgain}
      />
      <Notification showNotification={showNotification} />
    </div>
  );
}
export async function getServerSideProps(context) {
  const hangmanId = context.query.id;
  const snapshot = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/hangman/${hangmanId}`
  );
  let allwords = snapshot.data["words"];
  console.log(allwords);
  let selectedWord = allwords[Math.floor(Math.random() * allwords.length)];
  return { props: { word: selectedWord, wordList: allwords } };
}
