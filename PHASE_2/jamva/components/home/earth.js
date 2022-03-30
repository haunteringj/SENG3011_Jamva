import dynamic from 'next/dynamic';
import CountryData from './country_data';
import TopDiseases from './earth_overlay';
import { useState, useEffect, useRef, useCallback } from 'react';  
import styles from '../../styles/Home.module.scss'
  
// Earth 
function Earth () {
    const [latestContinent, setLatestContinent]= useState("World");
    const [latestCountry, setLatestCountry]= useState("World");
    // import basic globe
    const Globe = dynamic(import('react-globe.gl'), { ssr: false });

    // Hooks for loading countries onto globe
    const [countries, setCountries] = useState({ features: []});
    // loads data onto polygon layer (Does not reload the whole globe)
    useEffect(() => {
        console.log("reloading the earth")
        fetch('/countries.geojson').then(res => res.json())
        .then(countries=> {
            setCountries(countries);
        });
    }, []);

    // Click on Country Event
    const showOverlay = useCallback((polygon, { lat: endLat, lng: endLng }) => {
        // get the contient the clicked on country is on
        // console.log(polygon.properties.CONTINENT)
    
        // Move camera to center in on that country
        
        // Update/Create overlay of top 3 dieseases
        // ignore Antarctica
        if (polygon.properties.CONTINENT != "Antarctica"){
            setLatestContinent(polygon.properties.CONTINENT)
            setLatestCountry(polygon.properties.NAME)
        }
        console.log("clicked on ")
        console.log(polygon.properties)
      }, []);


    // return Earth 
    return (
        <div>
            <Globe
            globeImageUrl="/images/earth-blue-marble.jpg"
            backgroundImageUrl='/images/night-sky.png'
            backgroundColor="rgba(0,0,0,0)"
            polygonsData={countries.features}
            polygonCapColor={() => 'rgba(0, 0, 0, 0)'}
            polygonSideColor={() => 'rgba(0, 100, 0, 0.4)'}
            polygonLabel={({ properties: d }) => `
                <b>${d.ADMIN} (${d.ISO_A2})</b> <br />
                Population: <i>${Math.round(+d.POP_EST / 1e4) / 1e2}M</i>
            `}
            onPolygonClick={showOverlay}
            />;
            <div className={styles.overlay}>
                <TopDiseases continent={latestContinent}/>
            </div>
            <div className={styles.sidebar}>
                <CountryData countryData={latestCountry}/>
            </div>
        </div>
    )
};

export default Earth;