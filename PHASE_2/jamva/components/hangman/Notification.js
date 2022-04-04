import React from "react";

const Notification = ({ showNotification }) => {
  console.log(showNotification);
  return (
    <div className={`notification-container ${showNotification ? "show" : ""}`}>
      <p>You have already entered this letter</p>
    </div>
  );
};
Notification.getInitialProps = async function () {
  const res = await fetch("http://localhost:3000/hangman");
  const data = await res.json();
  console.log("NOTIF", data);
  return { data: data };
};
export default Notification;