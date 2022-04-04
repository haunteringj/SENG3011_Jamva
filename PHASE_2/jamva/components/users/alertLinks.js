import { Table, TableContainer, Text, Tr, Th, Thead, Tbody, Td, Link } from '@chakra-ui/react'


const AlertLink = (articleLink, diseases, cases) => {
  console.log(cases)
  return (

    <div className="alert-links">
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
                {diseases[0]}
              </Td>
              <Td>
                {cases}
              </Td>
              <Td>
                <Link color="teal.500" href="#">
                  Link to article! {articleLink}
                </Link>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default AlertLink