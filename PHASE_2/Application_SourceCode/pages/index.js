import React from "react";
import https from "http";
import axios from "axios";
import Dashboard from "../components/dashboard/dashboard";
import { useEffect, useContext, useState } from "react";
import { userContext } from "../context/userState";
const index = (props) => {
  const { userValues, setUserData } = useContext(userContext);
  const [profileData, setProfileData] = useState(null);
  const [diseaseProgress, setDiseaseProgress] = useState(null);
  const [unProgressed, setDiseaseUnProgressed] = useState(null);
  const [leaderboard, setLeaderboard] = useState(null);
  useEffect(() => {
    if (userValues.userId != "") {
      const httpsAgent = new https.Agent({ rejectUnauthorized: false });
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/users/details/${userValues.userId}`,
          { httpsAgent }
        )
        .then((response) => {
          setProfileData(response.data);
        });
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/users/progressDiseases/${userValues.userId}`,
          { httpsAgent }
        )
        .then((response) => {
          setDiseaseProgress(response.data);
        });

      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/users/unProgressedDiseases/${userValues.userId}`,
          { httpsAgent }
        )
        .then((response) => {
          setDiseaseUnProgressed(response.data);
        });
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/v1/users/getLeaderboard`, {
          httpsAgent,
        })
        .then((response) => {
          setLeaderboard(response.data);
        });
    }
  }, [userValues]);

  return (
    <Dashboard
      profile={profileData}
      progress={diseaseProgress}
      unprogress={unProgressed}
      leaderboard={leaderboard}
    ></Dashboard>
  );
};

export default index;
