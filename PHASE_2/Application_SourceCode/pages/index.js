import React from "react";
import https from "http";
import axios from "axios";
import Dashboard from "../components/dashboard/dashboard";
const index = (props) => {
  return <Dashboard data={props}></Dashboard>;
};

export async function getServerSideProps(context) {
  const httpsAgent = new https.Agent({ rejectUnauthorized: false });
  const profleData = await axios.get(
    `http://${process.env.NEXT_PUBLIC_API_URL}/v1/users/details/f3BNKAJFnlZuLZVuX1Zpk77TCsr2`,
    { httpsAgent }
  );
  const diseaseProgress = await axios.get(
    `http://${process.env.NEXT_PUBLIC_API_URL}/v1/users/progressDiseases/f3BNKAJFnlZuLZVuX1Zpk77TCsr2`,
    { httpsAgent }
  );

  const unProgressed = await axios.get(
    `http://${process.env.NEXT_PUBLIC_API_URL}/v1/users/unProgressedDiseases/f3BNKAJFnlZuLZVuX1Zpk77TCsr2`,
    { httpsAgent }
  );
  const leaderboard = await axios.get(
    `http://${process.env.NEXT_PUBLIC_API_URL}/v1/users/getLeaderboard`,
    { httpsAgent }
  );
  return {
    props: {
      profile: profleData.data,
      diseaseProg: diseaseProgress.data,
      diseaseUnprog: unProgressed.data,
      leaders: leaderboard.data,
    },
  };
}
export default index;
