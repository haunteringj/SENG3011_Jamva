import styles from "../../styles/Layout.module.scss"
import Nav from "./nav"

const Layout = ({children}) => {
  return (
    <>
      <Nav />
      <div className={styles.container}>
        <main className={styles.main}>
          {children}
        </main>
      </div>
    </>
  )
}

export default Layout