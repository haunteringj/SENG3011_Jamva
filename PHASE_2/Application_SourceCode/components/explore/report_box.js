import { Box } from "@chakra-ui/react";
import react from "react";

export default function ReportBox({ title, date, id }) {

  return (
    <Box p={2} m={3} as="button" display="flex" justifyContent={"center"} alignItems="center" flexDir="column" backgroundColor="white" border="1px" shadow={'2xl'} borderColor="black" borderRadius="md">
      <Box fontSize="sm" fontWeight="semibold" textAlign={'center'} inlineSize="300px" overflowWrap="break-word">
        {title}
      </Box>
      <Box fontSize="sm" textAlign={'center'}>
        reported date: {date}
      </Box>
    </Box>
  );
}