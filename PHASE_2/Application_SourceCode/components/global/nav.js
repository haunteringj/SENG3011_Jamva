import Link from "next/link"
import navStyles from "../../styles/Nav.module.scss"
import { useContext } from "react";
import { userContext, INITIAL_USER_STATE } from "../../context/userState";
import { useRouter } from "next/router";
import app, { auth } from "../../services/firebase";

const Nav = () => {
  const { userValues, setUserValues } = useContext(userContext);
  const router = useRouter();

  const signOutUser = async () => {
    await auth.signOut();
    setUserValues(INITIAL_USER_STATE)
    router.push("/");
  }

  return (
    <nav className={navStyles.nav}>
      {/* This is the left div */}
      <div className={navStyles.routebar}>
        <div className={navStyles.title}>
          <Link className={navStyles.hometext} href="/">JAMVA</Link>
        </div>
        <div className={navStyles.divider}></div>
      


        <Link className={navStyles.hometext} href="/explore">EXPLORE</Link>
        

      </div>

      {/* This is the right div */}

      <ul>
        

        {(userValues.userId != "") ? (
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
            <Link href="/login">Login</Link>
          </li>
          <li>
            <Link href="/signup">Signup</Link>
          </li>
        </>
        )}
      </ul>
    </nav>
  );
};

export default Nav;

