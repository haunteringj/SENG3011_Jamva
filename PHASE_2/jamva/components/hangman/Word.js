import React from "react";

const Word = ({ selectedWord, correctLetters }) => {
  return (
    <div className="word">
      {selectedWord.split("").map((letter, i) => {
        return (
          <span className="letter" key={i}>
            {correctLetters.includes(letter) ? letter : ""}
          </span>
        );
      })}
    </div>
  );
};
Word.getInitialProps = async function () {
  const res = await fetch("http://localhost:3000/hangman");
  const data = await res.json();
  console.log(data);
  return { data: data };
};
export default Word;
