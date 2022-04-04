import Link from "next/link";
import React from "react";
import { useRouter } from "next/router";

const Popup = ({ finished }) => {
  let finalMessage = "";
  let finalMessageRevealWord = "";
  let playable = true;
  const router = useRouter();
  const { disease } = router.query;
  if (finished) {
    finalMessage = "Congratulations! You won! 😃";
    playable = false;
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
        <button onClick={handleButton}>Back to crosswords</button>
      </div>
    </div>
  );
};
Popup.getInitialProps = async function () {
  const res = await fetch("http://localhost:3000/hangman");
  const data = await res.json();
  console.log(data);
  return { data: data };
};
export default Popup;
