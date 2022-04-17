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
import { useEffect } from "react";
import { useContext } from "react";
import { userContext } from "../../../../context/userState";
import NotLogged from "../../../../components/users/notLogged";
const index = (passed) => {
  const router = useRouter();
  const [done, setDone] = useState(false);
  const [crossword, setCrossword] = useState(null);
  const [completed, setCompleted] = useState(null);
  const { userValues, setUserData } = useContext(userContext);
  const { disease, id } = router.query;
  const [forfun, setFun] = useState(null);
  useEffect(() => {
    const httpsAgent = new https.Agent({ rejectUnauthorized: false });
    if (userValues.userId == "") {
      return <NotLogged></NotLogged>;
    }
    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/crosswords/${disease}/${id}`,
        { httpsAgent }
      )
      .then((response) => {
        setCrossword(response.data);
      });
    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/crosswords/getCompleted/${disease}/${userValues.userId}`,
        { httpsAgent }
      )
      .then((response) => {
        console.log(response.data);
        setCompleted(response.data);
        setFun(response.data.includes(id));
      });
  }, [disease]);

  async function finished() {
    console.log("DONE");
    if (!forfun) {
      const httpsAgent = new https.Agent({ rejectUnauthorized: false });
      const completeData = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/crosswords/complete/${disease}/${id}/${userValues.userId}`,
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
  const crosswordRef = useRef(crossword);
  return completed == null || crossword == null ? (
    <div></div>
  ) : (
    <ChakraProvider>
      <div className="selectionHeader">
        <button
          className="backButton custom-btn"
          onClick={() => router.push(`/crosswords/${disease}`)}
        >
          Back
        </button>
        <Heading as="h1" size="lg">
          {disease} Crossword {id}
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
            data={crossword}
          />
        </ThemeProvider>
        <Popup finished={done} forfun={forfun} />
      </div>
    </ChakraProvider>
  );
};
export default index;
