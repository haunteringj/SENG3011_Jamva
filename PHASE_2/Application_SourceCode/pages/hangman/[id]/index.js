import React, { useState, useEffect } from "react";
import axios from "axios";
import Figure from "../../../components/hangman/Figure";
import WrongLetters from "../../../components/hangman/WrongLetters";
import Word from "../../../components/hangman/Word";
import Popup from "../../../components/hangman/Popup";
import Notification from "../../../components/hangman/Notification";
import { Center, ChakraProvider, Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";
import NotLogged from "../../../components/users/notLogged";
import {
  showNotification as show,
  checkWin,
} from "../../../utils/helpers/helpers";
import https from "https";
import { userContext } from "../../../context/userState";
import { useContext } from "react";
import ReactLoading from "react-loading";
export default function Hangman() {
  const { userValues, setUserData } = useContext(userContext);
  const [playable, setPlayable] = useState(true);
  const [correctLetters, setCorrectLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [word, setWord] = useState("");
  const [wordList, setWordList] = useState(null);
  const [facts, setFacts] = useState(null);
  const [forfun, setFun] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allwords, setAllwords] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const handleKeydown = (event) => {
      const { key, keyCode } = event;
      if (playable && keyCode >= 65 && keyCode <= 90) {
        const letter = key.toLowerCase();
        if (word.includes(letter)) {
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

  useEffect(() => {
    if (userValues.userId == "") {
      return <NotLogged></NotLogged>;
    }
    const httpsAgent = new https.Agent({ rejectUnauthorized: false });
    axios
      .get(
        `http://${process.env.NEXT_PUBLIC_API_URL}/v1/hangman/${id}/${userValues.userId}`,
        { httpsAgent }
      )
      .then((response) => {
        console.log(response);
        setWordList(response.data["difference"]);
        setAllwords(response.data["allwords"]);
        setFacts(response.data["facts"]);
        if (response.data["difference"].length == 0) {
          setFun(true);
          setWord(
            response.data["allwords"][
              Math.floor(Math.random() * response.data["allwords"].length)
            ]
          );
        } else {
          setFun(false);
          setWord(
            response.data["difference"][
              Math.floor(Math.random() * response.data["difference"].length)
            ]
          );
        }
        setLoading(false);
      });
  }, []);
  if (userValues.userId == "") {
    return <NotLogged></NotLogged>;
  }
  if (loading) {
    return (
      <div style={{ paddingTop: "40vh" }}>
        <ReactLoading type={"spin"} />
      </div>
    );
  }
  function playAgain() {
    if (checkWin(correctLetters, wrongLetters, word) === "win") {
      let remove = wordList.indexOf(word);
      wordList.splice(remove, 1);
      if (forfun == false) {
        const httpsAgent = new https.Agent({ rejectUnauthorized: false });
        const profleData = axios.post(
          `http://${process.env.NEXT_PUBLIC_API_URL}/v1/hangman/complete/${id}/${userValues.userId}/${word}`,
          { httpsAgent }
        );
      }
    }
    setPlayable(true);
    setCorrectLetters([]);
    setWrongLetters([]);

    if (wordList.length == 0) {
      setFun(true);
      setWordList(allwords);
      console.log(wordList);
      const random = Math.floor(Math.random() * allwords.length);
      setWord(allwords[random]);
    } else {
      const random = Math.floor(Math.random() * wordList.length);
      setWord(wordList[random]);
    }
  }
  console.log(word);
  return word == null || facts == null || wordList == null || forfun == null ? (
    <ChakraProvider>
      <div className="selectionHeader">
        <button
          className="backButton custom-btn"
          onClick={() => router.push(`/disease/${id}/games`)}
        >
          Back
        </button>
        <Heading color="white">
          There are currently no words for this hangman!
        </Heading>
        <Heading color="white">Check back later!</Heading>
      </div>
    </ChakraProvider>
  ) : (
    <div>
      <ChakraProvider>
        <div className="hangman-container">
          <div className="selectionHeader">
            <button
              className="backButton custom-btn"
              onClick={() => router.push(`/disease/${id}/games`)}
            >
              Back
            </button>
            <Center>
              <h1>{id} Hangman</h1>
            </Center>
            <Center>
              <p>Find the hidden word - Enter a letter</p>
            </Center>
            {forfun ? (
              <p>
                You have completed this Disease's hangman! Currently playing for
                fun.
              </p>
            ) : (
              <></>
            )}
          </div>

          <div className="game-container">
            <div>
              <Figure wrongLetters={wrongLetters} />
              <WrongLetters wrongLetters={wrongLetters} />
              <Word selectedWord={word} correctLetters={correctLetters} />
            </div>
            <Popup
              correctLetters={correctLetters}
              wrongLetters={wrongLetters}
              fact={facts[word]}
              forfun={forfun}
              wordsLeft={wordList}
              selectedWord={word}
              setPlayable={setPlayable}
              playAgain={playAgain}
            />
            <Center>
              <Notification showNotification={showNotification} />
            </Center>
          </div>
        </div>
      </ChakraProvider>
    </div>
  );
}
