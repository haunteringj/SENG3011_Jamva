import React from "react";
import { useRef, useState } from "react";
import Crossword from "@jaredreisinger/react-crossword";
import axios from "axios";
import Popup from "../../../../components/crossword/Popup";
import { ChakraProvider } from "@chakra-ui/react";
import { Center } from "@chakra-ui/react";
import { ThemeProvider } from "styled-components";
const index = (passed) => {
  const data = passed["crossword"];
  const [done, setDone] = useState(false);

  function finished() {
    console.log("DONE");
    crosswordRef.current.reset();
    setDone(true);
  }
  const theme = {
    gridBackground: "#2c2c2c",
    numberColor: "white",
    textColor: "white",
    cellBackground: "#6e6e6e",
    highlightBackground: "#2c2c2c78",
    focusBackground: "rgb(0,0,0,0.1)",
  };
  const crosswordRef = useRef(null);
  return (
    <ChakraProvider>
      <div className="selectionHeader">
        <button
          className="backButton custom-btn"
          onClick={() => router.push(`/disease/${disease}/games`)}
        >
          Back
        </button>
      </div>
      <div className="crosswordContainer">
        <ThemeProvider theme={theme}>
          <Crossword
            ref={crosswordRef}
            onCrosswordCorrect={finished}
            data={data}
          />
        </ThemeProvider>
        <Popup finished={done} />
      </div>
    </ChakraProvider>
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
