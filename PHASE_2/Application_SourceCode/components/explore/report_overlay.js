import react from "react";
import Link from "next/link";
import { Box } from "@chakra-ui/react";
import ReportBox from "./report_box";

export default function ReportOverlay({ reports, country }) {
  const [visible, setVisible] = react.useState(true);

  return visible ? (
    <Box
      display="flex"
      flexDir="column"
      overflowY="scroll"
      width="400px"
      h="sm"
      borderWidth="1px"
      borderRadius="lg"
      opacity={0.7}
      overflow="hidden"
      backgroundColor={"whitesmoke"}
      alignItems="center"

      // width="100%"
    >
      <Box p="3">
        <Box
          mt="1"
          fontWeight="Bold"
          fontSize={25}
          as="h1"
          lineHeight="tight"
          isTruncated
          textAlign="center"
        >
          Reports in {country}
        </Box>
        <Box>
          {reports.map((r, i) => (
            <ReportBox
              key={i}
              title={r["headline"]}
              id={r["id"]}
              date={r["date"]}
            />
          ))}
        </Box>
      </Box>
    </Box>
  ) : null;
}
