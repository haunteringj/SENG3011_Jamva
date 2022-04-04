import Layout from '../components/global/layout'
import { UserWrapper } from '../context/userState'
import '../styles/globals.scss'
import { ChakraProvider } from '@chakra-ui/react'

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
    <UserWrapper>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </UserWrapper>
    </ChakraProvider>
  )
}

export default MyApp
