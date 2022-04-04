import Layout from "../components/global/layout";
import { UserWrapper } from "../context/userState";
import "../styles/globals.scss";
import "../styles/hangman.scss";
function MyApp({ Component, pageProps }) {
  return (
    <UserWrapper>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </UserWrapper>
  );
}

export default MyApp;
