import {
  Box,
  Center,
  ChakraProvider,
  Container,
  Divider,
  Flex,
  Heading,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import React from "react";
import https from "https";
import { useState, useEffect, useContext } from "react";
import { userContext } from "../../../context/userState";
import NotLogged from "../../../components/users/notLogged";
import ReactLoading from "react-loading";
const Home = () => {
  const router = useRouter();
  const { disease } = router.query;
  const { userValues, setUserData } = useContext(userContext);
  const [quiz, setQuiz] = useState(null);
  const [completed, setCompletedQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (userValues.userId != "") {
      const httpsAgent = new https.Agent({ rejectUnauthorized: false });
      axios
        .get(
          `http://${process.env.NEXT_PUBLIC_API_URL}/v1/quizzes/${disease}/getAll`,
          { httpsAgent }
        )
        .then((response) => {
          setQuiz(response.data);
        });
      axios
        .get(
          `http://${process.env.NEXT_PUBLIC_API_URL}/v1/quizzes/${disease}/${userValues.userId}`,
          { httpsAgent }
        )
        .then((response) => {
          setCompletedQuiz(response.data);
          setLoading(false);
        });
    }
  }, []);
  if (loading) {
    return (
      <div style={{ paddingTop: "40vh" }}>
        <ReactLoading type={"spin"} />
      </div>
    );
  }
  const generateQuizCard = (singleQuiz, completed, index) => {
    console.log(singleQuiz);
    return (
      <Box
        m={3}
        width={500}
        height={180}
        className="selectionBox"
        borderWidth="1px"
        backgroundColor={
          Object.keys(completed).includes(String(index)) &&
          completed[String(index)] == singleQuiz.questions.length
            ? "#44a832"
            : Object.keys(completed).includes(String(index))
            ? "#cc7337"
            : "#a83232"
        }
        borderRadius="lg"
        p={6}
        boxShadow="xl"
      >
        <Heading as="h3" size="lg" color="white">
          {singleQuiz.title}
        </Heading>

        <Text color="white" mt={2}>
          No of Questions: {singleQuiz.questions.length}{" "}
          {Object.keys(completed).includes(String(index))
            ? `| Best attempt: ${completed[String(index)]}/${
                singleQuiz.questions.length
              }`
            : ""}
        </Text>

        <Divider mt={3} mb={3} />
        <Text color="white" noOfLines={[1]}>
          {singleQuiz.description}
        </Text>
      </Box>
    );
  };
  if (userValues.userId == "") {
    return <NotLogged></NotLogged>;
  }
  return quiz == null || completed == null || quiz.length == 0 ? (
    <ChakraProvider>
      <div className="selectionHeader">
        <button
          className="backButton custom-btn"
          onClick={() => router.push(`/disease/${disease}/games`)}
        >
          Back
        </button>
        <Center>
          <h1>Looks like there arent any quizzes for this disease!</h1>
        </Center>
      </div>
      <div>
        <Box>
          <main>
            <header>
              <Container maxW="6x1">
                <Box
                  m={3}
                  borderWidth="1px"
                  borderRadius="lg"
                  className="selectionBox buttonAdd"
                  p={5}
                  as="button"
                  width={500}
                  height={180}
                  boxShadow="xl"
                  onClick={() => router.push(`/quiz/new`)}
                >
                  <Heading color="white" as="h3" size="lg">
                    <Center>Create New Quiz</Center>
                  </Heading>
                </Box>
              </Container>
            </header>
          </main>
          <footer></footer>
        </Box>
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
        <Center>
          <u>
            <h1 className="title">{disease} Quizzes</h1>
          </u>
        </Center>
      </div>
      <Box paddingTop={0}>
        <main>
          <header>
            {quiz.length > 0 && (
              <SimpleGrid columns={2} spacing={10}>
                {quiz.map((singleQuiz, index) => (
                  <Box
                    as="button"
                    key={singleQuiz.id}
                    onClick={() =>
                      router.push(`/quizzes/${singleQuiz.disease}/${index}`)
                    }
                  >
                    {generateQuizCard(singleQuiz, completed, index)}
                  </Box>
                ))}
                <Box
                  m={3}
                  borderWidth="1px"
                  borderRadius="lg"
                  className="selectionBox buttonAdd"
                  p={5}
                  as="button"
                  width={500}
                  height={180}
                  boxShadow="xl"
                  onClick={() => router.push(`/quiz/new`)}
                >
                  <Heading color="white" as="h3" size="lg">
                    <Center>Create New Quiz</Center>
                  </Heading>
                </Box>
              </SimpleGrid>
            )}
          </header>
        </main>
        <footer></footer>
      </Box>
    </ChakraProvider>
  );
};

export default Home;
