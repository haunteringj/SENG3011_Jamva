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
import https from "https";
import { useEffect } from "react";
import http from "http";
import { useState, useContext } from "react";
import { userContext } from "../../../../../context/userState";
const answer = () => {
  const [points, setPoints] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const { userValues, setUserData } = useContext(userContext);
  const [answer, setAnswer] = useState(null);
  const router = useRouter();
  const { disease, id, answerId } = router.query;
  let numRight = 0;

  let numCounted = 0;
  useEffect(() => {
    if (answer != null && numCounted == answer.questions.length) {
      numCounted += 1;
      console.log("SET SCORE", numRight)
      const httpsAgent = new https.Agent({ rejectUnauthorized: false });
      axios
        .post(
          `http://${process.env.NEXT_PUBLIC_API_URL}/v1/quiz/complete/${disease}/${userValues.userId}/${id}/${numRight}`,
          { httpsAgent }
        )
        .then((response) => {
          if (response.data["score"] != 0) {
            setPoints(response.data["score"]);
          }
        });
    }
  })
  useEffect(() => {
    console.log(numRight, answer);
    const httpsAgent = new https.Agent({ rejectUnauthorized: false });
    axios
      .get(
        `http://${process.env.NEXT_PUBLIC_API_URL}/v1/quiz/${disease}/${id}`,
        { httpsAgent }
      )
      .then((response) => {
        setQuiz(response.data);
      });
    axios
      .get(`http://${process.env.NEXT_PUBLIC_API_URL}/v1/answer/${answerId}`, {
        httpsAgent,
      })
      .then((response) => {
        setAnswer(response.data);
      });
  }, []);
  return (
    <ChakraProvider>
      <div className="selectionHeader">
        <button
          className="backButton custom-btn"
          onClick={() => router.push(`/quizzes/${disease}`)}
        >
          Back
        </button>
      </div>
      {quiz && answer && (
        <Container maxW="3xl">
          <Center flexDirection="column">
            <Heading color="white">Correct Answers for {quiz.title}</Heading>
            <Heading color="white" textAlign="center">
              {points > 0
                ? `You scored ${points} points for this attempt!`
                : `You didnt get any extra points for this attempt.`}
            </Heading>
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
            if (
              answer.questions[index].answerId &&
              singleQuiz.options[singleQuiz.answer].optionId ===
              answer.questions[index].answerId
            ) {
              numRight += 1;
            }
            numCounted += 1;
            console.log("COUNTED", numCounted);
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

export default answer;
