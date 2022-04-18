import React from "react";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import axios from "axios";
import https from "https";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import Carousel from "react-elastic-carousel";
import Link from "next/link";
import { CardContent, CardMedia, Tooltip, Typography } from "@mui/material";
import { userContext } from "../../context/userState";
import { useContext } from "react";
import ReactLoading from "react-loading";
import { Center } from "@chakra-ui/react";
import navStyles from "../../styles/Nav.module.scss";
import { useRouter } from "next/router";
import { textAlign } from "@mui/system";
const Dashboard = ({ profile, progress, unprogress, leaderboard }) => {
  console.log("HERE", profile);
  const router = useRouter();
  const { userValues, setUserData } = useContext(userContext);
  const leaders = leaderboard;
  if (userValues == null) {
    router.reload();
  }
  if (
    userValues.userId != "" &&
    (profile == null ||
      progress == null ||
      unprogress == null ||
      leaderboard == null)
  ) {
    return (
      <div style={{ paddingTop: "40vh" }}>
        <ReactLoading type={"spin"} />
      </div>
    );
  }
  return profile == null ||
    progress == null ||
    unprogress == null ||
    leaderboard == null ? (
    <div>
      <div style={{ textAlign: "center", color: "white", paddingTop: "20vh" }}>
        <h1>The best form of preparation,</h1>
        <h1>is education.</h1>
        <h1>Why not start learning today?</h1>
        <h2 style={{ fontSize: "1vw" }}>
          With over 20 diseases to learn about, you would be crazy not to.
        </h2>
        <button
          className="btn-games custom-btn"
          style={{
            width: "10vw",
            height: "7vh",
            fontSize: "1vw",
            backgroundColor: "#3e98c7",
          }}
          onClick={() => router.push(`/signup`)}
        >
          Start Now
        </button>
      </div>
      <div></div>
    </div>
  ) : (
    <div className="dashboard_container">
      <Grid container spacing={2}>
        <Grid item xs={9}>
          <Card className="first_half">
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <CardMedia
                    component="img"
                    className="top_profile"
                    image="/images/defaultProfile.jpg"
                  />
                </Grid>
                <Grid item xs={9}>
                  <Card className="top_profile">
                    <CardContent>Badges:</CardContent>
                    {profile.badges.length == 0 ? (
                      <CardContent style={{ paddingTop: "8vh" }}>
                        <Center>
                          You have no badges! Play a game to earn some!
                        </Center>
                      </CardContent>
                    ) : (
                      <Carousel itemsToShow={3}>
                        {profile["badges"].map((badge) => (
                          <div
                            style={{
                              width: "7.5vw",
                              height: "18vh",
                              justifyContent: "center",
                              textAlign: "center",
                              cursor: "pointer",
                            }}
                          >
                            <Center>
                              <Tooltip
                                title={
                                  <Typography>
                                    {badge["description"]}
                                  </Typography>
                                }
                                style={{ fontSize: "100px" }}
                                placement="bottom"
                              >
                                <Tooltip
                                  title={
                                    <Typography>{badge["name"]}</Typography>
                                  }
                                  placement="top"
                                >
                                  <img
                                    style={{ height: "9vw", width: "9vw" }}
                                    src={`/badges/${badge["file"]}`}
                                  />
                                </Tooltip>
                              </Tooltip>
                            </Center>
                          </div>
                        ))}
                      </Carousel>
                    )}
                  </Card>
                </Grid>
                <Grid item xs={3}>
                  <Card className="bottom_profile ">
                    <CardContent>Welcome {profile.username}!</CardContent>
                    <CardContent>Points: {profile.score}</CardContent>
                  </Card>
                </Grid>
                <Grid item xs={9}>
                  <Card className="bottom_profile ">
                    <CardContent>Alerts</CardContent>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card className="first_half">
            <CardContent>
              <Center>Leaderboard</Center>
              <div style={{ height: "43vh", width: "100%" }}>
                <DataGrid
                  rows={leaders}
                  getRowClassName={(params) => {
                    console.log(params.row.userId);
                    return params.row.userId == userValues.userId
                      ? "highlight"
                      : "";
                  }}
                  columns={[
                    {
                      field: "id",
                      headerName: "Rank",
                      flex: 0.5,
                      align: "center",
                      headerAlign: "center",
                    },
                    {
                      field: "Name",
                      flex: 1,
                      align: "center",
                      headerAlign: "center",
                    },
                    {
                      field: "Points",
                      flex: 1,
                      align: "center",
                      headerAlign: "center",
                    },
                  ]}
                  pageSize={100}
                  rowsPerPageOptions={[5]}
                  sx={{
                    boxShadow: 2,
                    border: 2,
                    borderColor: "primary.light",
                    ".highlight:hover": {
                      bgcolor: "#3e98c7",
                    },
                    width: "100%",
                    ".highlight": {
                      bgcolor: "#3e98c7",
                    },
                  }}
                  hideFooter
                />
              </div>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card className="progress_box">
            <CardContent>Diseases In Progress</CardContent>
            {Object.keys(progress).length == 0 ? (
              <CardContent style={{ paddingTop: "8vh", textAlign: "center" }}>
                <Center>
                  You havent progressed any diseases yet! Have a look at the
                  list to the right!
                </Center>
              </CardContent>
            ) : (
              <Carousel itemsToShow={3}>
                {Object.keys(progress).map((disease) => (
                  <Link href={`disease/${disease}/games`}>
                    <div
                      style={{
                        width: "7.5vw",
                        height: "18vh",
                        justifyContent: "center",
                        textAlign: "center",
                        cursor: "pointer",
                      }}
                    >
                      <CircularProgressbar
                        value={progress[disease]}
                        text={`${progress[disease]}%`}
                      />

                      {disease}
                    </div>
                  </Link>
                ))}
              </Carousel>
            )}
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card className="progress_box">
            <CardContent>Look at Next</CardContent>
            {unprogress.length == 0 ? (
              "You have no badges! Play a game to earn some!"
            ) : (
              <Carousel itemsToShow={3} itemsToScroll={3}>
                {unprogress.map((disease) => (
                  <Link href={`disease/${disease}`}>
                    <div
                      style={{
                        width: "7.5vw",
                        height: "18vh",
                        justifyContent: "center",
                        textAlign: "center",
                        cursor: "pointer",
                      }}
                    >
                      <CircularProgressbar value={0} text={`0%`} />

                      {disease}
                    </div>
                  </Link>
                ))}
              </Carousel>
            )}
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export async function getServerSideProps(context) {
  const disease = context.query.disease;
  const httpsAgent = new https.Agent({ rejectUnauthorized: false });
  const snapshot = await axios.get(`https://3.106.142.227/v1/listDiseases`, {
    httpsAgent,
  });
  return { props: { diseases: snapshot.data } };
}
export default Dashboard;
