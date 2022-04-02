import react from "react";
import { useContext, useState } from "react";
import { userContext } from "../../context/userState";
import Select, { components } from "react-select";
import { COUNTRY_LIST } from "../../public/CountryNames";
import { postRecord } from "../../services/axios";
import { useRouter } from "next/router";

const arrowStyle = {
  transform: "rotate(180deg) scale(1)",
};


const SignupForm = () => {
  const router = useRouter();
  const { userValues, setUserValues } = useContext(userContext);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [stateClicked, setStateClicked] = useState(false);
  const [error, setError] = useState("");

  const handleChange = e => {
    setUserValues(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const reactSelectStyles = {
    option: (provided, state) => ({
      ...provided,
      borderBottom: "1px solid gray",
      color: "black",
      backgroundColor: state.isSelected ? "rgb(102, 255, 102, 0.5)" : "white",
      "&:hover": {
        background: "rgb(102, 255, 102)",
      },
    }),
    container: (provided, state) => ({
      ...provided,
      width: "100%",
      minHeight: "1px",
    }),
    control: (provided, state) => ({
      ...provided,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      position: "relative",
      border: "none",
      width: "100%",
      boxShadow: "none",
      minHeight: "1px",
      borderRadius: "none",
      cursor: "pointer",
      backgroundColor: "#eee"
    }),
    indicatorSeparator: (provided, state) => ({
      visibility: "none",
    }),
    valueContainer: (provided, state) => ({
      ...provided,
      margin: "0",
      padding: "0",
      minHeight: "1px",
      fontSize: "16px",
    }),
    input: (provided, state) => ({
      ...provided,
      margin: "0",
      padding: "0",
      color: "#190033",
    }),
    singleValue: (provided, state) => ({
      ...provided,
      margin: "0",
      padding: "0",
      color: "#190033",
    }),
    placeholder: (provided, state) => ({
      ...provided,
      color: "rgba(122, 6, 63, 0.25)",
    }),
  };

  const validationCheck = () => {
    const ageRegex = new RegExp(/[0-9]*$/);

    if (
      userValues.email == "" ||
      userValues.age == "" ||
      password == "" ||
      userValues.country == "" ||
      userValues.username == ""
    ) {
      setError("missingFields");
      return false;
    }
    if (!ageRegex.test(userValues.age)) {
      setError("invalidAge");
      return false;
    }
    return true;
  }

  const DropdownIcon = () => {
    return (
      <div className="dropdown-arrow">
        <svg width="14" height="10" style={stateClicked ? arrowStyle : {}}>
          <path d="M9.211364 7.59931l4.48338-4.867229c.407008-.441854.407008-1.158247 0-1.60046l-.73712-.80023c-.407008-.441854-1.066904-.441854-1.474243 0L7 5.198617 2.51662.33139c-.407008-.441853-1.066904-.441853-1.474243 0l-.737121.80023c-.407008.441854-.407008 1.158248 0 1.600461l4.48338 4.867228L7 10l2.211364-2.40069z"></path>
        </svg>
      </div>
    );
  };

  const DropdownIndicator = props => {
    return (
      <components.DropdownIndicator {...props}>
        <DropdownIcon />
      </components.DropdownIndicator>
    );
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (validationCheck()) {
      try {
        const postData = {
          username: userValues.username,
          email: userValues.email,
          country: userValues.country,
          password: password,
          city: "",
          state: "",
          age: Number(userValues.age),
        }
        console.log(postData);
        const uriValue = "users/create"
        const res = await postRecord(uriValue, postData);
        console.log(res);
        const userData = res.data
        if (userData.status == "success") {
          setUserValues(prevState => ({
            ...prevState,
            userId: userData.uid
          }));
          router.push("/");
        }
        if (userData.status == "failed_userExists") {
          setError("userExists")
        }
        else {
          setError("somethingWrong")
        }
      } catch (err) {
        console.log("hell3");
        setError("somethingWrong")
      }
    } else {
      return;
    }
  } 

  const handleCountrySelect = e => {
    setUserValues(prevState => ({
      ...prevState,
      country: e.value,
    }));
  };

  return (
      <form onSubmit={handleSubmit}>
        <div className="inner-form">
          <div className={userValues.email == "" ? "input" : "input input--has-value"}>
            <input 
              className="input__field"
              name="email"
              type="email"
              placeholder="email"
              onChange={e => {
                handleChange(e)
              }}
              value={userValues.email}
            />
            <label className="input__label">Email</label>
          </div>
          <div className={password == "" ? "input" : "input input--has-value"}>
            <input 
              className="input__field"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="password"
              onChange={e => {
                setPassword(e.target.value);
              }}
              value={password}
            />
            <label className="input__label">Password</label>
          </div>
          <div className={userValues.username == "" ? "input" : "input input--has-value"}>
            <input 
              className="input__field"
              name="username"
              type="text"
              placeholder="username"
              onChange={e => {
                handleChange(e)
              }}
              value={userValues.username}
            />
            <label className="input__label">Username</label>
          </div>
          <div className="input-select">
            <Select
              options={COUNTRY_LIST}
              onChange={handleCountrySelect}
              components={{ DropdownIndicator }}
              styles={reactSelectStyles}
              defaultValue={userValues.country}
              onMenuOpen={() => {
                setStateClicked(true);
              }}
              onMenuClose={() => {
                setStateClicked(false);
              }}
              placeholder="Country"
            />
          </div>
          <div className={userValues.age == "" ? "input" : "input input--has-value"}>
            <input 
              className="input__field"
              name="age"
              type="number"
              placeholder="age"
              min="1"
              max="100"
              onChange={e => {
                handleChange(e)
              }}
              value={userValues.age}
            />
            <label className="input__label">Age</label>
          </div>
          {error == "missingFields" && (
            <p className="error">
              You're missing some fields
            </p>
          )}
          {error == "invalidAge" && (
            <p className="error">
              Invalid age input
            </p>
          )}
          {error == "somethingWrong" && (
            <p className="error">
              Something went wrong, please contact us!
            </p>
          )}
          {error == "userExists" && (
            <p className="error">
              Email is already being used, use another!
            </p>
          )}
          <input type="submit" value="Create Account" className="submit-button" />
        </div>
      </form>
  )
}

export default SignupForm