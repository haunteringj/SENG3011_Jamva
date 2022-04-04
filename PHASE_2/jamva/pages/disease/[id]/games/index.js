import React from "react";
import Link from "next/link";
import { Center, ChakraProvider, Container, HStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
const index = () => {
  const router = useRouter();
  const { id } = router.query;
  return (
    <ChakraProvider className="scroll">
      <div>
        <div className="gameHeader">
          <button
            className="backButton custom-btn"
            onClick={() => router.push(`/disease/${id}`)}
          >
            Back
          </button>
          <Center>
            <h1 className="title">Pick a Game to learn about {id}!</h1>
          </Center>
        </div>
        <Center>
          <HStack spacing={30}>
            <Link href={`/hangman/${id}`}>
              <button className="btn-games custom-btn">
                <Center>
                  <img className="buttonIcon" src="/hangman.png" />
                </Center>
              </button>
            </Link>
            <Link href={`/quizzes/${id}`}>
              <button className="btn-games custom-btn">
                <Center>
                  <img className="buttonIcon" src="/quiz.png" />
                </Center>
              </button>
            </Link>
            <Link href={`/crosswords/${id}`}>
              <button className="btn-games custom-btn">
                <Center>
                  <img className="buttonIcon" src="/crossword.png" />
                </Center>
              </button>
            </Link>
          </HStack>
        </Center>
      </div>
    </ChakraProvider>
  );
};

export default index;
