import React from "react";
import { useRef, useState } from "react";
import Crossword from "@jaredreisinger/react-crossword";
import axios from "axios";
import Popup from "../../../../components/crossword/Popup";
import { ChakraProvider, Heading } from "@chakra-ui/react";
import { Center } from "@chakra-ui/react";
import { ThemeProvider } from "styled-components";
import { useRouter } from "next/router";
import https from "https";

const index = (passed) => {
  const router = useRouter();
  const data = passed["crossword"];
  const [done, setDone] = useState(false);
  const disease = passed.diseaseName;
  const crosswordid = passed.id;
  const forfun = passed.completed.includes(crosswordid);

  async function finished() {
    console.log("DONE");
    if (!forfun) {
      const httpsAgent = new https.Agent({ rejectUnauthorized: false });
      const completeData = await axios.post(
        `http://${process.env.NEXT_PUBLIC_API_URL}/v1/crosswords/complete/${disease}/${crosswordid}/f3BNKAJFnlZuLZVuX1Zpk77TCsr2`,
        { httpsAgent }
      );
    }
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
          onClick={() => router.push(`/crosswords/${disease}`)}
        >
          Back
        </button>
        <Heading as="h1" size="lg">
          {disease} Crossword {crosswordid}
        </Heading>
        <Heading as="h2" size="md">
          {forfun ? "You cannot earn points from this crossword" : ""}
        </Heading>
      </div>
      <div className="crosswordContainer">
        <ThemeProvider theme={theme}>
          <Crossword
            ref={crosswordRef}
            onCrosswordCorrect={finished}
            data={data}
          />
        </ThemeProvider>
        <Popup finished={done} forfun={forfun} />
      </div>
    </ChakraProvider>
  );
};
export async function getServerSideProps(context) {
  const disease = context.query.disease;
  const crosswordId = context.query.id;
  const httpsAgent = new https.Agent({ rejectUnauthorized: false });
  const snapshot = await axios.get(
    `http://${process.env.NEXT_PUBLIC_API_URL}/v1/crosswords/${disease}/${crosswordId}`,
    { httpsAgent }
  );
  const completeData = await axios.get(
    `http://${process.env.NEXT_PUBLIC_API_URL}/v1/crosswords/getCompleted/${disease}/f3BNKAJFnlZuLZVuX1Zpk77TCsr2`,
    { httpsAgent }
  );
  return {
    props: {
      crossword: snapshot.data,
      diseaseName: disease,
      id: crosswordId,
      completed: completeData.data,
    },
  };
}
export default index;
