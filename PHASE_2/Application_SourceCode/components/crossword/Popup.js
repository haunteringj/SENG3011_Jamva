import Link from "next/link";
import React from "react";
import { useRouter } from "next/router";

const Popup = ({ finished, forfun }) => {
  let finalMessage = "";
  let finalMessageRevealWord = "";
  let playable = true;
  let pointsMessage = "";
  const router = useRouter();
  const { disease } = router.query;
  if (finished) {
    finalMessage = "Congratulations! You won! 😃";
    playable = false;
  }
  if (forfun) {
    pointsMessage =
      "You have completed this crossword already, so you cannot earn any more points.";
  } else {
    pointsMessage = "You have earned 300 points for completing a crossword!";
  }
  const handleButton = (e) => {
    router.push(`/crosswords/${disease}`);
  };
  return (
    <div
      className="popup-container"
      style={finalMessage !== "" ? { display: "flex" } : {}}
    >
      <div className="popup">
        <h2>{finalMessage}</h2>
        <h2>{pointsMessage}</h2>
        <button onClick={handleButton}>Back to crosswords</button>
      </div>
    </div>
  );
};
Popup.getInitialProps = async function () {
  const res = await fetch("https://jamva-front.vercel.app/hangman");
  const data = await res.json();
  console.log(data);
  return { data: data };
};

export default Popup;
