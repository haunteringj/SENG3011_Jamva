import { useState, useEffect } from "react";
import { Box, Link } from "@chakra-ui/react";
import axios from "axios";

// receives a continent and a list of dieseases and prints then out
const TopDiseases = (props) => {
  const [data, setData] = useState([]);
  // load from backend api the top dieseases in the continent
  console.log(process.env.NEXT_PUBLIC_API_URL);
  useEffect(() => {
    axios
      .get(
        `http://${process.env.NEXT_PUBLIC_API_URL}/v1/top5Dieseases?continent=` +
          props.continent
      )
      .then((result) => {
        setData(result);
        
      }).catch((err) => alert(err));
  }, [props.continent]);

  // format the data into a string
  const D1 = data[1] + "\n";
  const D2 = data[2] + "\n";
  const D3 = data[3] + "\n";

  // return component
  return (
    <Box
      display="flex"
      padding={"5px"}
      flexDir="column"
      w="200px"
      h="230px"
      borderWidth="1px"
      borderRadius="lg"
      opacity={0.7}
      backgroundColor={"whitesmoke"}
    >
      <Box
        mt="1"
        fontWeight="Bold"
        fontSize={20}
        as="h1"
        lineHeight="tight"
        isTruncated
        textAlign="center"
      >
        {props.continent}
      </Box>
      <Box
        textAlign={"center"}
        fontWeight="Bold"
        fontSize={20}
        as="h1"
        lineHeight="tight"
      >
        Top Diseases
        <Box textAlign="start">
          <li>
            <Link color="blue" href={`/disease/${D1}`}>
              {D1}
            </Link>
          </li>
          <li>
            <Link color="blue" href={`/disease/${D2}`}>
              {D2}
            </Link>
          </li>
          <li>
            <Link color="blue" href={`/disease/${D3}`}>
              {D3}
            </Link>
          </li>
        </Box>
      </Box>
    </Box>
  );
};

export default TopDiseases;
