import React from "react";
import axios from "axios";
import {
  Box,
  Container,
  Divider,
  Flex,
  Heading,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
const index = (props) => {
  const quiz = JSON.parse(props.quiz);
  const router = useRouter();

  const generateQuizCard = (singleQuiz) => {
    return (
      <Box m={3} borderWidth="1px" borderRadius="lg" p={6} boxShadow="xl">
        <Heading as="h3" size="lg">
          {singleQuiz.title}
        </Heading>

        <Divider mt={3} mb={3} />
        <Text noOfLines={[1, 2, 3]}>{singleQuiz.description}</Text>
      </Box>
    );
  };

  return (
    <Box>
      <Head>
        <title>QuizApp</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
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
                    m={2}
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
    </Box>
  );
};

export async function getServerSideProps(context) {
  const disease = context.query.disease;
  console.log(disease);
  const snapshot = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/crosswords/${disease}/getAll`
  );
  return { props: { quiz: JSON.stringify(snapshot.data) } };
}
export default index;
