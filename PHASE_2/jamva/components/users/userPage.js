import react from "react";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { userContext } from "../../context/userState";
import { getRecord } from "../../services/axios";
import app, { auth } from "../../services/firebase";

const UserPage = () => {
  const router = useRouter();
  const { userValues, setUserValues } = useContext(userContext);

  return (
    <div>
      Welcome {userValues.username}
    </div>
  )
}

export default UserPage