import Head from 'next/head'
import dynamic from 'next/dynamic';
import Image from 'next/image'
import styles from '../styles/Home.module.scss'
import Alerts from '../components/users/alerts';

export default function Home() {
  const Globe = dynamic(import('react-globe.gl'), { ssr: false });

  return (
    <div>
      <Globe />
      <Alerts />
    </div>
  )
}
