import {
  Button,
  Center,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  RadioGroup,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import { Field, Form, Formik } from "formik";
import { NextPageContext } from "next";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import nav from "../../../components/global/nav";
import { addAnswerApi } from "../../../utils/service";

const ShowQuiz = (quiz, onSubmit) => {
  return (
    <Container
      maxW="7xl"
      mt={5}
      mb={5}
      borderWidth="1px"
      borderRadius="lg"
      p={6}
      boxShadow="xl"
    >
      <Center flexDirection="column">
        <Heading>{quiz.title}</Heading>
      </Center>
      <Text mt={4}>{quiz.description}</Text>
      <Heading mt={4} size="lg">
        Questions:
      </Heading>
      <Divider
        mt={4}
        mb={4}
        css={{
          boxShadow: "1px 1px #888888",
        }}
      />
      <Formik initialValues={{}} onSubmit={onSubmit}>
        {(props) => (
          <Form>
            {quiz.questions.map((singleQuiz, key) => (
              <Field name={singleQuiz.questionId} key={key}>
                {({ field, _form }) => (
                  <FormControl
                    as="fieldset"
                    isRequired={true}
                    mb={{ base: 4, md: 0 }}
                  >
                    <FormLabel as="legend">{singleQuiz.title}</FormLabel>
                    <RadioGroup>
                      <SimpleGrid minChildWidth="120px" mb={2}>
                        {singleQuiz.options.map((option, subkey) => (
                          <HStack key={subkey}>
                            <Field
                              {...field}
                              type="radio"
                              name={singleQuiz.questionId}
                              value={option.optionId}
                            />
                            <Text>{option.title}</Text>
                          </HStack>
                        ))}
                      </SimpleGrid>
                    </RadioGroup>
                  </FormControl>
                )}
              </Field>
            ))}
            <Center mt={10}>
              <Button
                type="submit"
                isLoading={props.isSubmitting}
                colorScheme="green"
              >
                Submit
              </Button>
            </Center>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

const SingleQuiz = (props) => {
  const router = useRouter();
  const quiz = JSON.parse(props.quiz);

  const onSubmit = async (values, actions) => {
    try {
      const questions = [];
      for (const [key, value] of Object.entries(values)) {
        questions.push({ questionId: key, answerId: value });
      }
      const resp = await addAnswerApi(props.quizId, questions);
      console.log(resp);
      const answerId = resp.data.answerId;
      router.push(`/quiz/${props.quizId}/answer/${answerId}`);
    } catch (error) {
      console.log("error", error);
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <>
      <nav />
      {quiz && ShowQuiz(quiz, onSubmit)}
    </>
  );
};

export async function getServerSideProps(context) {
  const quizId = context.query.id;
  const snapshot = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/quiz/${quizId}`
  );
  return { props: { quiz: JSON.stringify(snapshot.data), quizId } };
}

export default SingleQuiz;
