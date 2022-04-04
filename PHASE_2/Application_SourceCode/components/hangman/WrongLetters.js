import React from "react";

const WrongLetters = ({ wrongLetters }) => {
  return (
    <div className="wrong-letters-container">
      <div>
        {wrongLetters.length > 0 && <p>Wrong</p>}
        {wrongLetters
          .map((letter, i) => <span key={i}>{letter}</span>)
          .reduce(
            (prev, curr) => (prev === null ? [curr] : [prev, ", ", curr]),
            null
          )}
      </div>
    </div>
  );
};

WrongLetters.getInitialProps = async function () {
  const res = await fetch("https://jamva-front.vercel.app/hangman");
  const data = await res.json();
  return { wrongLetters: data };
};

export default WrongLetters;

