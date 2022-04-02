import React from "react";
import Crossword from "@jaredreisinger/react-crossword";
import axios from "axios";
const index = (passed) => {
  const data = passed["crossword"];
  return (
    <div className="crosswordContainer">
      <Crossword data={data} />
    </div>
  );
};
export async function getServerSideProps(context) {
  const disease = context.query.disease;
  const crosswordId = context.query.id;
  const snapshot = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/crosswords/${disease}/${crosswordId}`
  );
  return { props: { crossword: snapshot.data } };
}
export default index;
