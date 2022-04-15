import react from "react";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { userContext } from "../../context/userState";
import { getRecord } from "../../services/axios";
import app, { auth } from "../../services/firebase";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

const arrowStyle = {
  transform: "rotate(180deg) scale(1)",
};

const LoginForm = () => {
  const router = useRouter();
  const { userValues, setUserValues } = useContext(userContext);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [stateClicked, setStateClicked] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setUserValues((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const validationCheck = () => {
    if (password == "" || userValues.email == "") {
      setError("missingFields");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validationCheck()) {
      try {
        await auth.signInWithEmailAndPassword(userValues.email, password);
        const user = auth.currentUser;
        const userId = user.uid;
        const uriPath = `users/details/${userId}`;
        const userDetails = await getRecord(uriPath);
        console.log(userDetails);
        const data = userDetails.data;
        setUserValues({
          alerts: data.alerts,
          username: data.username,
          badges: data.badges,
          score: data.score,
          email: data.email,
          country: data.country,
          age: data.age,
          state: data.state,
          city: data.city,
          completed: data.completed,
          userId: userId,
        });
        router.push("/");
      } catch (err) {
        setError("invalidCreds");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="inner-form">
        <div
          className={
            userValues.email == "" ? "input" : "input input--has-value"
          }
        >
          <input
            className="input__field"
            name="email"
            type="email"
            placeholder="email"
            onChange={(e) => {
              handleChange(e);
            }}
            value={userValues.email}
          />
          <label className="input__label">Email</label>
        </div>
        <div
          className={
            password == ""
              ? "input password-input"
              : "input input--has-value password-input"
          }
        >
          <input
            className="input__field"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            value={password}
          />
          <label className="input__label">Password</label>
          {showPassword ? (
            <ViewIcon
              onClick={() => {
                setShowPassword(false);
              }}
            />
          ) : (
            <ViewOffIcon
              onClick={() => {
                setShowPassword(true);
              }}
            />
          )}
        </div>
        {error == "missingFields" && <p className="error">Missing fields</p>}
        {error == "invalidCreds" && (
          <p className="error">Incorrect Email or Password</p>
        )}
        <input type="submit" value="Login" className="submit-button" />
      </div>
    </form>
  );
};

export default LoginForm;
