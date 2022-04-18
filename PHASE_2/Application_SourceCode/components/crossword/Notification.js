import React from "react";

const Notification = ({ showNotification }) => {
  return (
    <div
      className={`notification-container-crossword ${
        showNotification ? "show" : ""
      }`}
    >
      <p>This crossword is incorrect!</p>
    </div>
  );
};
Notification.getInitialProps = async function () {
  const res = await fetch("https://jamva.vercel.app/hangman");
  const data = await res.json();
  console.log("NOTIF", data);
  return { data: data };
};
export default Notification;
