import { useContext } from "react";
import { userContext } from "../../context/userState";
import { Box, Button, Collapse, Slide, Text, useDisclosure } from '@chakra-ui/react'
import { InfoIcon, ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";

const Alerts = () => {
  const { isOpen, onToggle } = useDisclosure();
  const { userValues, setUserValues } = useContext(userContext);

  return (
    <div>
      {userValues.alerts.length == 0 && (
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
            Pop up alerts!
          </Box>
        </Collapse>
      </>
      )}
    </div>
  );
}

export default Alerts