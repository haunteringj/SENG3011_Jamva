import Link from "next/link"
import navStyles from "../../styles/Nav.module.scss"
import { useContext } from "react";
import { userContext } from "../../context/userState";

const Nav = () => {
  const { userValues, setUserValues } = useContext(userContext);

  return (
    <nav className={navStyles.nav}>
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>

        {(userValues.userId != "") ? (
        <li>
            <Link href="/user">Account</Link>
        </li>
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
  )
}

export default Nav