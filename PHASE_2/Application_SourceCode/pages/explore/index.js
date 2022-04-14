import styles from "../../styles/Explore.module.scss";
import Earth from "../../components/explore/earth";
import { ChakraProvider } from "@chakra-ui/react";

export default function Home() {
  return (
    <ChakraProvider>
      <Earth />
    </ChakraProvider>
  );
}
