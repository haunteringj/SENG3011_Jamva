import React from "react";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import axios from "axios";
import https from "https";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";

import { CardContent, CardMedia } from "@mui/material";
const columns = [
  { field: "name", width: 90 },
  { field: "score", width: 90 },
];
const Dashboard = ({ data }) => {
  console.log("HERE", data);
  const leaders = [
    { id: 1, name: "string", score: 0 },
    { id: 2, name: "string", score: 0 },
    { id: 3, name: "string", score: 0 },
    { id: 4, name: "string", score: 0 },
    { id: 5, name: "string", score: 0 },
    { id: 6, name: "string", score: 0 },
    { id: 7, name: "string", score: 0 },
    { id: 8, name: "string", score: 0 },
    { id: 9, name: "string", score: 0 },
    { id: 10, name: "string", score: 0 },
    { id: 11, name: "string", score: 0 },
  ];
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
                  columns={columns}
                  pageSize={100}
                  rowsPerPageOptions={[5]}
                  sx={{
                    boxShadow: 2,
                    border: 2,
                    borderColor: "primary.light",
                    "& .MuiDataGrid-cell:hover": {
                      color: "primary.main",
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
            <div
              style={{
                width: 180,
                height: 180,
                justifyContent: "center",
                textAlign: "center",
                marginLeft: 20,
              }}
            >
              <CircularProgressbar value={20} text={`20%`} />
              Influenza
            </div>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card className="progress_box">
            <CardContent>Look at Next</CardContent>
            <div
              style={{
                width: 180,
                height: 180,
                justifyContent: "center",
                textAlign: "center",
                marginLeft: 20,
              }}
            >
              <CircularProgressbar value={0} text={`0%`} />
              Covid
            </div>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};
export default Dashboard;
