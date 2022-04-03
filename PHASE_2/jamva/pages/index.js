import Head from 'next/head'
import dynamic from 'next/dynamic';
import Image from 'next/image'
import styles from '../styles/Home.module.scss'
import Alerts from '../components/users/alerts';
import Earth from '../components/home/earth';

export default function Home() {

  return (
    <div>
      <Earth />
    </div>
  )
}
