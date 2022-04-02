import Link from "next/link"
import navStyles from "../../styles/Nav.module.scss"

const Nav = () => {
  return (
    <nav className={navStyles.nav}>
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/user">Account</Link>
        </li>
        <li>
          <Link href="/disease_info">Disease_TEMP</Link>
        </li>
      </ul>
    </nav>
  )
}

export default Nav