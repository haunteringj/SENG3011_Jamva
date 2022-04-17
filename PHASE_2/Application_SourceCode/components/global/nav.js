import Link from "next/link";
import navStyles from "../../styles/Nav.module.scss";
import { useContext } from "react";
import { userContext, INITIAL_USER_STATE } from "../../context/userState";
import { useRouter } from "next/router";
import app, { auth } from "../../services/firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SearchIcon } from "@chakra-ui/icons";
import { Center, ChakraProvider } from "@chakra-ui/react";
const Nav = () => {
  const { userValues, setUserValues } = useContext(userContext);
  const router = useRouter();

  const signOutUser = async () => {
    await auth.signOut();
    setUserValues(INITIAL_USER_STATE);
    router.reload();
  };

  return (
    <nav className={navStyles.nav}>
      {/* This is the left div */}
      <div className={navStyles.routebar}>
        <div
          className="up homeDiv"
          style={{
            fontSize: "1.3vw",
            cursor: "pointer",
            height: "7vh",
            width: "9vw",
            textAlign: "center",
            paddingTop: "2vh",
          }}
        >
          <Link href="/">
            <Center>
              <img
                style={{ width: "7vw", cursor: "pointer" }}
                src="/images/jamva.png"
                className="imgChange"
              />
            </Center>
          </Link>
        </div>
        <div className={navStyles.divider}></div>

        <Link href="/explore">
          <div
            className="up"
            style={{
              fontSize: "1.3vw",
              cursor: "pointer",
              height: "7vh",
              width: "9vw",
              textAlign: "center",
              paddingTop: "1.5vh",
            }}
          >
            EXPLORE <SearchIcon />
          </div>
        </Link>
        <div className={navStyles.divider}></div>
      </div>

      {/* This is the right div */}

      <ul>
        {userValues.userId != "" ? (
          <>
            <div className={navStyles.divider}></div>
            <li>
              <div
                className="signout-button up"
                style={{
                  fontSize: "1.3vw",
                  cursor: "pointer",
                  height: "7vh",
                  width: "7vw",
                  paddingTop: "1.5vh",
                }}
                onClick={() => {
                  signOutUser();
                }}
              >
                <Center>Signout</Center>
              </div>
            </li>
          </>
        ) : (
          <>
            <div className={navStyles.divider}></div>
            <li>
              <Link href="/login">
                <div
                  className="up"
                  style={{
                    fontSize: "1.3vw",
                    cursor: "pointer",
                    height: "7vh",
                    width: "6vw",
                    textAlign: "center",
                    paddingTop: "1.5vh",
                  }}
                >
                  Login
                </div>
              </Link>
            </li>
            <div className={navStyles.divider}></div>

            <li>
              <Link href="/signup">
                <div
                  className="up"
                  style={{
                    fontSize: "1.3vw",
                    cursor: "pointer",
                    height: "7vh",
                    width: "7vw",
                    textAlign: "center",
                    paddingTop: "1.5vh",
                  }}
                >
                  Signup
                </div>
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Nav;
