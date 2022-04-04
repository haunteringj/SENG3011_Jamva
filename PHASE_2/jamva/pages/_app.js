import Layout from "../components/global/layout";
import { UserWrapper } from "../context/userState";
import "../styles/globals.scss";
import "../styles/hangman.scss";
import '../styles/disease.scss'

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
