import { useContext } from "react";
import { userContext } from "../../context/userState";
import UpArrowButton from "../alerts/upArrowButton";

const Alerts = () => {
  const { userValues, setUserValues } = useContext(userContext);
  console.log({userValues})

  return (
    <div>
      {userValues.alerts.length == 0 && (
        <div className="alerts-popup">
          <UpArrowButton />
        </div>
      )}
    </div>
  );
}

export default Alerts