import { ChakraProvider } from "@chakra-ui/react";
import Layout from "../components/global/layout";
import { UserWrapper } from "../context/userState";
import "../styles/globals.scss";

import "../styles/hangman.scss";
function MyApp({ Component, pageProps }) {
  return (
    <UserWrapper>
      <div className="main-wrapper">
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </div>
    </UserWrapper>
  );
}

export default MyApp;
