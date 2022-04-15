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
const Dashboard = ({ data }) => {
  console.log("HERE", data);
  const leaders = data.leaders;
  return (
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
                    <CardContent>Badges: {data.profile.badges}</CardContent>
                  </Card>
                </Grid>
                <Grid item xs={3}>
                  <Card className="bottom_profile ">
                    <CardContent>Welcome {data.profile.username}!</CardContent>
                    <CardContent>Points: {data.profile.score}</CardContent>
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
              <div style={{ height: 400, width: "100%" }}>
                <DataGrid
                  rows={leaders}
                  columns={[
                    {
                      field: "Name",
                      width: "165",
                      align: "center",
                      headerAlign: "center",
                    },
                    {
                      field: "Points",
                      width: "165",
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
              {Object.keys(data.diseaseProg).map((disease) => (
                <Link href={`disease/${disease}`}>
                  <div
                    style={{
                      width: 130,
                      height: 160,
                      justifyContent: "center",
                      textAlign: "center",
                      cursor: "pointer",
                    }}
                  >
                    <CircularProgressbar
                      value={data.diseaseProg[disease]}
                      text={`${data.diseaseProg[disease]}%`}
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
              {data.diseaseUnprog.map((disease) => (
                <Link href={`disease/${disease}`}>
                  <div
                    style={{
                      width: 130,
                      height: 160,
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
