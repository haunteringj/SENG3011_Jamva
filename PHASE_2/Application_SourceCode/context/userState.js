import { createContext } from "react";
import { useState } from "react";

export const userContext = createContext(null);

export const INITIAL_USER_STATE = {
  alerts: [],
  username: "",
  email: "",
  country: "",
  age: "",
  state: "",
  userId: "",
}

export function UserWrapper({ children }) {
  const [userValues, setUserValues] = useState(INITIAL_USER_STATE);

  return (
    <userContext.Provider value={{ userValues, setUserValues }}>
      {children}
    </userContext.Provider>
  );
}