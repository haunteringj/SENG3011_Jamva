import { createContext, useContext } from "react";

const userContext = createContext(null);

const INITIAL_USER_STATE = {
  alerts: [],
  username: "",
  email: "",
  country: "",
  age: "",
  state: "",
  country: "",
}

export function UserWrapper({ children }) {
  let userState = INITIAL_USER_STATE;

  return (
    <userContext.Provider value={userState}>
      {children}
    </userContext.Provider>
  );
}

export function useUserContext() {
  return useContext(userContext);
}