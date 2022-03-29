import dynamic from 'next/dynamic';
import styles from '../styles/Home.module.scss'
import Alerts from '../components/users/alerts';
import { useState, useEffect, useRef, useCallback } from 'react';
import Earth from '../components/earth';
import CountryData from '../components/country_data';


export default function Home({ cData }) {
 
  return (
    <div className={styles.main}>
      
      <div className={styles.earth}>
      <Earth />

      </div>
      <div className={styles.sidebar}> <CountryData countryData={"COuntry"}/> </div>
      
      
      {/* <Alerts /> */}
    </div>
  )
}

export async function getServerSideProps(context) {
  // get all the required covid data
  // and other data

  return {
    props: {
      cData: { 'test': true },
      // countries: countries
    }
  };
}
