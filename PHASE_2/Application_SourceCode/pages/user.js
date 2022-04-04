import { useContext } from "react";
import UserPage from "../components/users/userPage";
import { userContext } from "../context/userState";

const user = () => {
  return (
    <div>
      <h1>
        <UserPage />
      </h1>
    </div>
  )
}

export default user