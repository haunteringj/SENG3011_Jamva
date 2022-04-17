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
import { CardContent, CardMedia } from "@mui/material";
import { userContext } from "../../context/userState";
import { useContext } from "react";
import ReactLoading from "react-loading";
import { Center } from "@chakra-ui/react";
import navStyles from "../../styles/Nav.module.scss";
import { useRouter } from "next/router";
const Dashboard = ({ profile, progress, unprogress, leaderboard }) => {
  console.log("HERE", profile);
  const router = useRouter();
  const { userValues, setUserData } = useContext(userContext);
  const leaders = leaderboard;
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
        <h1>The best form of preperation,</h1>
        <h1>is education.</h1>
        <h1>Why not start learning today?</h1>
        <h2 style={{ fontSize: "1vw" }}>
          With over 20 diseases to learn about, you would be crazy not to.
        </h2>
        <button
          className="btn-games custom-btn"
          style={{ width: "10vw", height: "7vh", fontSize: "1vw" }}
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
                    image="/images/defaultprofile.jpg"
                  />
                </Grid>
                <Grid item xs={9}>
                  <Card className="top_profile">
                    <CardContent>Badges: {profile.badges}</CardContent>
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
              Leaderboard
              <div style={{ height: "43vh", width: "100%" }}>
                <DataGrid
                  rows={leaders}
                  columns={[
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
                    "& .MuiDataGrid-cell:hover": {
                      color: "primary.main",
                    },
                    width: "100%",
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
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card className="progress_box">
            <CardContent>Look at Next</CardContent>
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
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};
export default Dashboard;
