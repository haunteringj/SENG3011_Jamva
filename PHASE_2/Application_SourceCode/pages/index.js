import React from "react";
import https from "http";
import axios from "axios";
import Dashboard from "../components/dashboard/dashboard";
const index = (props) => {
  return <Dashboard data={props}></Dashboard>;
};

export async function getServerSideProps(context) {
  const httpsAgent = new https.Agent({ rejectUnauthorized: false });
  const snapshot = await axios.get(
    `http://${process.env.NEXT_PUBLIC_API_URL}/v1/users/details/f3BNKAJFnlZuLZVuX1Zpk77TCsr2`,
    { httpsAgent }
  );
  return {
    props: { profile: snapshot.data },
  };
}
export default index;
