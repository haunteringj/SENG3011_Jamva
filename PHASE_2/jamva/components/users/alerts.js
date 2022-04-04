import { useContext } from "react";
import { userContext } from "../../context/userState";
import { Box, Button, Collapse, Table, TableContainer, Text, Tr, Th, Thead, Tbody, Td, Link, useDisclosure } from '@chakra-ui/react'
import { InfoIcon, ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import AlertLink from "./alertLinks";

const Alerts = () => {
  const { isOpen, onToggle } = useDisclosure();
  const { userValues, setUserValues } = useContext(userContext);
  console.log({userValues})

  return (
    <div>
      {userValues.alerts.length != 0 && (
      <>
        <Button 
          onClick={() => {
            onToggle();
          }} 
          className="alert-button"
          bg="red.400"
          _hover="none"
        >
          <div className="button-container">
            <InfoIcon width="24px" height="24px" className="info-icon" />
            <Text fontSize="md" className="text-alert">Alerts</Text>
            {isOpen ? <ChevronDownIcon width="24px" height="24px" /> : <ChevronUpIcon width="24px" height="24px" className="arrow-up" />}
          </div>
        </Button>
        <Collapse in={isOpen} animateOpacity className="collapse-alert">
          <Box
            p="40px"
            color="white"
            mt="4"
            bg="red.400"
            rounded="md"
            shadow="md"
          >
            {console.log(userValues.alerts)}
            {userValues.alerts.map(alert => (
              <div className="alert-links" key={alert.article}>
                <TableContainer>
                  <Table size="sm">
                    <Thead>
                      <Tr>
                        <Th>Diseases</Th>
                        <Th>Cases</Th>
                        <Th>Article Link</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td>
                          {alert.diseases[0]}
                        </Td>
                        <Td>
                          {alert.cases}
                        </Td>
                        <Td>
                          <Link color="teal.500" href="#">
                            Link to article! {alert.articleLink}
                          </Link>
                        </Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </TableContainer>
              </div>
            ))}
          </Box>
        </Collapse>
      </>
      )}
    </div>
  );
}

export default Alerts