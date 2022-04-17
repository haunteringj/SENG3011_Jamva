import Link from "next/link";
import navStyles from "../../styles/Nav.module.scss";
import { useContext } from "react";
import { userContext, INITIAL_USER_STATE } from "../../context/userState";
import { useRouter } from "next/router";
import app, { auth } from "../../services/firebase";

const Nav = () => {
  const { userValues, setUserValues } = useContext(userContext);
  const router = useRouter();

  const signOutUser = async () => {
    await auth.signOut();
    setUserValues(INITIAL_USER_STATE);
    router.push("/");
  };

  return (
    <nav className={navStyles.nav}>
      {/* This is the left div */}
      <div className={navStyles.routebar}>
        <div className={navStyles.title}>
          <Link href="/">
            <img
              style={{ width: "7vw", cursor: "pointer" }}
              src="/images/jamva.png"
            />
          </Link>
        </div>
        <div className={navStyles.divider}></div>

        <Link href="/explore">
          <div style={{ fontSize: "1.3vw", cursor: "pointer" }}>EXPLORE</div>
        </Link>
      </div>

      {/* This is the right div */}

      <ul>
        {userValues.userId != "" ? (
          <>
            <li>
              <div
                className="signout-button"
                onClick={() => {
                  signOutUser();
                }}
              >
                Signout
              </div>
            </li>
            <li>
              <Link href="/user">Account</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link href="/login">
                <div style={{ fontSize: "1.3vw", cursor: "pointer" }}>
                  Login
                </div>
              </Link>
            </li>
            <li>
              <Link href="/signup">
                <div
                  style={{
                    fontSize: "1.3vw",
                    marginLeft: "1vw",
                    marginRight: "1vw",
                    cursor: "pointer",
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
