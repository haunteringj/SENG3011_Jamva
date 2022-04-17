import React, { useEffect } from "react";
import { checkWin } from "../../utils/helpers/helpers";

const Popup = ({
  correctLetters,
  wrongLetters,
  selectedWord,
  wordsLeft,
  setPlayable,
  fact,
  forfun,
  playAgain,
}) => {
  let finalMessage = "";
  let finalMessageRevealWord = "";
  let forfunMessage2 = "";
  let points = "";
  let forFunMessage1 = "";
  let playable = true;
  let playAgainText = "Play Again";
  if (checkWin(correctLetters, wrongLetters, selectedWord) === "win") {
    finalMessage = `Congratulations! You won! 😃`;
    if (wordsLeft.length == 1 || forfun == true) {
      forFunMessage1 = "You have completed all of the words for this disease!";
      forfunMessage2 =
        "You wont earn points anymore for playing this hangman, but you can still play it for fun!";
    }
    if (forfun == false) {
      points = `Congratulations you earned ${selectedWord.length * 10} points!`;
      playAgainText = "Claim Points";
    }
    forfun = true;
    playable = false;
  } else if (checkWin(correctLetters, wrongLetters, selectedWord) === "lose") {
    finalMessage = "Unfortunately you lost. 😕";
    finalMessageRevealWord = `...the word was: ${selectedWord}`;
    playable = false;
  }

  useEffect(() => {
    setPlayable(playable);
  });

  return (
    <div
      className="popup-container"
      style={finalMessage !== "" ? { display: "flex" } : {}}
    >
      <div className="popup">
        <h2>{finalMessage}</h2>

        <h3>{finalMessageRevealWord}</h3>
        <h3>{fact}</h3>
        <h3>{forFunMessage1}</h3>
        <h3>{forfunMessage2}</h3>
        <h3>{points}</h3>
        <button onClick={playAgain}>{playAgainText}</button>
      </div>
    </div>
  );
};
Popup.getInitialProps = async function () {
  const res = await fetch("https://jamva.vercel.app/hangman");
  const data = await res.json();
  console.log(data);
  return { data: data };
};
export default Popup;
