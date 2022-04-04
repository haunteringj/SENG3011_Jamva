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

const Home = (props) => {
  const quiz = JSON.parse(props.quiz);
  const router = useRouter();
  const disease = props.diseaseName;
  const generateQuizCard = (singleQuiz) => {
    return (
      <Box
        m={3}
        width={500}
        height={180}
        className="selectionBox"
        borderWidth="1px"
        borderRadius="lg"
        p={6}
        boxShadow="xl"
      >
        <Heading as="h3" size="lg" color="white">
          {singleQuiz.title}
        </Heading>

        <Text color="white" mt={2}>
          No of Questions: {singleQuiz.questions.length}
        </Text>

        <Divider mt={3} mb={3} />
        <Text color="white" noOfLines={[1]}>
          {singleQuiz.description}
        </Text>
      </Box>
    );
  };
  return quiz.length == 0 ? (
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
                    {generateQuizCard(singleQuiz)}
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

export async function getServerSideProps(context) {
  const disease = context.query.disease;
  const snapshot = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/quizzes/${disease}/getAll`
  );
  return {
    props: { quiz: JSON.stringify(snapshot.data), diseaseName: disease },
  };
}

export default Home;
