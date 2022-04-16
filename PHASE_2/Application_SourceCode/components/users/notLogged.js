import React from "react";

function notLogged() {
  return (
    <div>
      <h1
        style={{
          color: "white",
          paddingTop: "100px",
          width: "50vw",
          textAlign: "center",
        }}
      >
        Looks like you arent logged in! <br></br>Make sure to sign up or login
        before you start learning!
      </h1>
    </div>
  );
}

export default notLogged;
