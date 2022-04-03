import React from "react";
import { useRef, useState } from "react";
import Crossword from "@jaredreisinger/react-crossword";
import axios from "axios";
import Popup from "../../../../components/crossword/Popup";

const index = (passed) => {
  const data = passed["crossword"];
  const [done, setDone] = useState(false);

  function finished() {
    console.log("DONE");
    crosswordRef.current.reset();
    setDone(true);
  }
  const crosswordRef = useRef(null);
  return (
    <div className="crosswordContainer">
      <Crossword ref={crosswordRef} onCrosswordCorrect={finished} data={data} />
      <Popup finished={done} />
    </div>
  );
};
export async function getServerSideProps(context) {
  const disease = context.query.disease;
  const crosswordId = context.query.id;

  const snapshot = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/crosswords/${disease}/${crosswordId}`
  );
  return { props: { crossword: snapshot.data } };
}
export default index;
