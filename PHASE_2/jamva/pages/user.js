import { useContext } from "react";
import { useUserContext } from "../context/userState";

const user = () => {
  const { userValues, setUserValues } = useUserContext;

  return (
    <div>
      <h1>
        Welcome User
      </h1>
    </div>
  )
}

export default user