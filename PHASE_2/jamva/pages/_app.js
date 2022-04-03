import Layout from '../components/global/layout'
import { UserWrapper } from '../context/userState'
import '../styles/globals.scss'
import '../styles/disease.scss'
import navStyles from "../styles/Nav.module.scss"



function MyApp({ Component, pageProps }) {
  return (
    <UserWrapper>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </UserWrapper>
  )
}

export default MyApp
