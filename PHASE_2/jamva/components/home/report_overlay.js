import react from "react";
import Link from "next/link"
import styles from '../../styles/Home.module.scss'
import { Box } from '@chakra-ui/react'
import ReportBox from "./report_box";


export default function ReportOverlay({ reports }) {

  const [visible, setVisible] = react.useState(true)

  // console.log(reports);
  
  // react.useEffect(() => {
  //   if (reports !== []) setVisible(true);
  //   else setVisible(false);

  //   console.log(reports)
  // }, [reports]);


  return (visible ?

    <Box display="flex" flexDir="column" overflowY="scroll" w='sm' h='sm' borderWidth='1px' borderRadius='lg' opacity={0.5} overflow='hidden' backgroundColor={'whitesmoke'}>
      <Box p='3'>
        <Box
          mt='1'
          fontWeight='Bold'
          fontSize={25}
          as='h1'
          lineHeight='tight'
          isTruncated
          textAlign="center"
        >
          Reports
        </Box>
        {/* <Box display='flex' alignItems='baseline'>
             
              <Box
                color='gray.500'
                fontWeight='semibold'
                letterSpacing='wide'
                fontSize='xs'
                textTransform='uppercase'
                ml='2'
              >
                Some other text
              </Box>
            </Box> */}
          <Box>
        {reports.map((r, i) => (
          <ReportBox key={i} title={r['headline']} id={r['id']} date={r['date']} />
        ))}
        </Box>





        {/* <Box>
              DATE
              <Box as='span' color='gray.600' fontSize='sm'>
                / wk
              </Box>
            </Box> */}

      </Box>
    </Box> : null
  )




}