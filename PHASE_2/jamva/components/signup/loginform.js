import react from "react";
import { useContext, useState } from "react";
import { userContext } from "../../context/userState";
import Select, { components } from "react-select";
import { COUNTRY_LIST } from "../../public/CountryNames";
import { getRecord } from "../../services/axios";

const arrowStyle = {
  transform: "rotate(180deg) scale(1)",
};


const LoginForm = () => {
  const { userValues, setUserValues } = useContext(userContext);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [stateClicked, setStateClicked] = useState(false);

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
      color: "#eee",
    }),
  };

  const validationCheck = () => {
    
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
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
          <input type="submit" value="Login" className="submit-button" />
        </div>
      </form>
  )
}

export default LoginForm