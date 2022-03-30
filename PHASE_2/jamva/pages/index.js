import styles from '../styles/Home.module.scss'
import Earth from '../components/home/earth';

export default function Home() {
  return (
    <div className={styles.main}>
      <div className={styles.earth}>
        <Earth />
      </div>
    </div>
  )
}

