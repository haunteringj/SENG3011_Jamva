import { createContext } from "react";
import { useState, useEffect } from "react";

export const userContext = createContext(null);

export const INITIAL_USER_STATE = {
  alerts: [],
  username: "",
  email: "",
  country: "",
  age: "",
  state: "",
  userId: "",
};

export function UserWrapper({ children }) {
  const [userValues, setUserValues] = useState(INITIAL_USER_STATE);
  useEffect(() => {
    setUserValues(JSON.parse(localStorage.getItem("userKey")));
  }, []);

  useEffect(() => {
    localStorage.setItem("userKey", JSON.stringify(userValues));
  }, [userValues]);

  return (
    <userContext.Provider value={{ userValues, setUserValues }}>
      {children}
    </userContext.Provider>
  );
}
