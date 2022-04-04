import {
  Box,
  Center,
  ChakraProvider,
  Container,
  Divider,
  Heading,
  Radio,
  RadioGroup,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import { NextPageContext } from "next";
import React from "react";
import { getAnswer, getSingleQuiz } from "../../../../../utils/db";
import { useRouter } from "next/router";
const answer = (props) => {
  const quiz = JSON.parse(props.quiz);
  const answer = JSON.parse(props.answer);
  const diseaseName = props.disease;
  const router = useRouter();
  return (
    <ChakraProvider>
      <div className="selectionHeader">
        <button
          className="backButton custom-btn"
          onClick={() => router.push(`/quizzes/${diseaseName}`)}
        >
          Back
        </button>
      </div>
      {quiz && answer && (
        <Container maxW="3xl">
          <Center flexDirection="column">
            <Heading color="white">Correct Answers for {quiz.title}</Heading>
            <Text color="white" mt={4}>
              {quiz.description}
            </Text>
          </Center>
          <Divider
            mt={4}
            mb={4}
            css={{
              boxShadow: "1px 1px #888888",
            }}
          />
          {quiz.questions.map((singleQuiz, index) => {
            return (
              <Box
                mt={index !== 0 && 4}
                key={index}
                borderWidth="1px"
                borderRadius="lg"
                p={6}
                boxShadow="xl"
                backgroundColor={
                  answer.questions[index].answerId &&
                  singleQuiz.options[singleQuiz.answer].optionId ===
                    answer.questions[index].answerId
                    ? "green.200"
                    : "red.200"
                }
              >
                <Text>
                  {index + 1}) {singleQuiz.title}
                </Text>
                <RadioGroup>
                  <SimpleGrid minChildWidth="120px" mt={2}>
                    {singleQuiz.options.map((option, index) => (
                      <Radio value={option.title} isDisabled key={index}>
                        {option.title}
                      </Radio>
                    ))}
                  </SimpleGrid>
                </RadioGroup>
                <Text mt={3}>
                  Correct Answer: {singleQuiz.options[singleQuiz.answer].title}
                </Text>
                {answer.questions[index].answerId ? (
                  <Text>
                    Selected Answer:{" "}
                    {
                      singleQuiz.options.find(
                        (option) =>
                          option.optionId === answer.questions[index].answerId
                      ).title
                    }
                  </Text>
                ) : (
                  <Text>Not Answered</Text>
                )}
              </Box>
            );
          })}
        </Container>
      )}
    </ChakraProvider>
  );
};

export async function getServerSideProps(context) {
  const quizId = context.query.id;
  const diseaseName = context.query.disease;
  const answerId = context.query.answerId;
  const quizData = await axios.get(
    `https://3.106.142.227/v1/quiz/${diseaseName}/${quizId}`
  );
  const answerData = await axios.get(
    `https://3.106.142.227/v1/answer/${answerId}`
  );
  console.log(answerData.data);
  return {
    props: {
      answer: JSON.stringify(answerData.data),
      quiz: JSON.stringify(quizData.data),
      disease: diseaseName,
    },
  };
}

export default answer;
