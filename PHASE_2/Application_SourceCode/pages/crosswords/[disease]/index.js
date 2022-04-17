import React from "react";
import axios from "axios";
import https from "https";
import {
  Box,
  Container,
  Divider,
  Flex,
  Heading,
  SimpleGrid,
  Text,
  ChakraProvider,
} from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { userContext } from "../../../context/userState";
import ReactLoading from "react-loading";
import NotLogged from "../../../components/users/notLogged";
const index = () => {
  const [quiz, setQuiz] = useState(null);
  const [completed, setCompleted] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userValues, setUserData } = useContext(userContext);
  const router = useRouter();
  const { disease } = router.query;
  useEffect(() => {
    const httpsAgent = new https.Agent({ rejectUnauthorized: false });
    if (userValues.userId == "") {
      return <NotLogged></NotLogged>;
    }
    const { disease } = router.query;
    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/crosswords/${disease}/getAll`,
        { httpsAgent }
      )
      .then((response) => {
        setQuiz(response.data);
      });
    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/crosswords/getCompleted/${disease}/${userValues.userId}`,
        { httpsAgent }
      )
      .then((response) => {
        setCompleted(response.data);
        setLoading(false);
      });
  }, [disease]);

  const generateQuizCard = (singleQuiz, completed) => {
    return (
      <Box
        m={3}
        width={500}
        height={180}
        borderWidth="1px"
        borderRadius="lg"
        p={6}
        backgroundColor={
          completed.includes(singleQuiz.crosswordId) ? "#44a832" : "#a83232"
        }
        boxShadow="xl"
      >
        <Heading color="white" as="h3" size="lg">
          {singleQuiz.title}
        </Heading>

        <Divider mt={3} mb={3} />
        <Text color="white" noOfLines={[1, 2, 3]}>
          {singleQuiz.description}
        </Text>
      </Box>
    );
  };
  if (loading) {
    return (
      <div style={{ paddingTop: "40vh" }}>
        <ReactLoading type={"spin"} />
      </div>
    );
  }
  return completed == null || quiz == null || quiz.length == 0 ? (
    <ChakraProvider>
      <div className="selectionHeader">
        <button
          className="backButton custom-btn"
          onClick={() => router.push(`/disease/${disease}/games`)}
        >
          Back
        </button>
        <Heading color="white">
          There are currently no crosswords for {disease}
        </Heading>
        <Heading color="white">Check back later!</Heading>
      </div>
    </ChakraProvider>
  ) : (
    <ChakraProvider>
      <div className="selectionHeader">
        <button
          className="backButton custom-btn"
          onClick={() => router.push(`/disease/${disease}/games`)}
        >
          Back
        </button>
        <Heading color="white">Crosswords about {disease}</Heading>
      </div>
      <main>
        <header>
          <nav />
          <Container maxW="6xl">
            {quiz.length > 0 && (
              <SimpleGrid minChildWidth="400px">
                {quiz.map((singleQuiz, index) => (
                  <Box
                    key={singleQuiz.id}
                    onClick={() =>
                      router.push(
                        `/crosswords/${singleQuiz.diseaseId}/${singleQuiz.crosswordId}`
                      )
                    }
                    as="button"
                    textAlign="start"
                  >
                    {generateQuizCard(
                      singleQuiz,
                      completed,
                      singleQuiz.crosswordId
                    )}
                  </Box>
                ))}
              </SimpleGrid>
            )}
          </Container>
        </header>
      </main>
      <footer></footer>
    </ChakraProvider>
  );
};

export default index;
