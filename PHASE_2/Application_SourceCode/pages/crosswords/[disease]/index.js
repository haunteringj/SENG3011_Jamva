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
const index = (props) => {
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
  return quiz.length == 0 ? (
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
                {quiz.map((singleQuiz) => (
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
                    {generateQuizCard(singleQuiz)}
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

export async function getServerSideProps(context) {
  const disease = context.query.disease;
  const httpsAgent = new https.Agent({ rejectUnauthorized: false });
  const snapshot = await axios.get(
    `https://3.106.142.227/v1/crosswords/${disease}/getAll`,
    { httpsAgent }
  );
  return {
    props: { quiz: JSON.stringify(snapshot.data), diseaseName: disease },
  };
}
export default index;
