import styles from "../styles/Home.module.scss";
import Earth from "../components/home/earth";
import { ChakraProvider } from "@chakra-ui/react";

export default function Home() {
  return (
    <ChakraProvider>
      <Earth />
    </ChakraProvider>
  );
}
