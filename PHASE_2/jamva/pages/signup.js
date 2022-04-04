import { useContext } from "react";
import SignupForm from "../components/signup/signupform";
import { userContext } from "../context/userState";

const signup = () => {


  return (
    <div>
      <SignupForm />
    </div>
  )
}

export default signup