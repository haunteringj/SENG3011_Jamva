import { ChakraProvider } from '@chakra-ui/react'
import Layout from '../components/global/layout'
import { UserWrapper } from '../context/userState'
import '../styles/globals.scss'

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <UserWrapper>
        <div className="main-wrapper">
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </div>
      </UserWrapper>
    </ChakraProvider>
  )
}

export default MyApp
