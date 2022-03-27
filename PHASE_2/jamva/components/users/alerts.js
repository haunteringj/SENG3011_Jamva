import { useContext } from "react";
import { userContext } from "../../context/userState";

const Alerts = () => {
  const { userValues, setUserValues } = useContext(userContext);
  console.log(userValues)

  if (userContext.alerts == []) {
    return;
  }

  return (
    <div className="alerts-popup">
      hello
    </div>
  );
}

export default Alerts