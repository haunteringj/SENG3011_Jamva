import CountryData from './covid_overlay';
import TopDiseases from './earth_overlay';
import { useState, useEffect, useRef, useCallback } from 'react';  
import styles from '../../styles/Home.module.scss'
  
// Earth 
function Earth () {
    const [latestContinent, setLatestContinent]= useState("World");
    // import basic globe
    let Globe = () => null;
    if (typeof window != 'undefined') {
        Globe = require('react-globe.gl').default;
    }
    const globeEl = useRef()

    // Hooks for loading countries onto globe
    const [countries, setCountries] = useState({ features: []});
    // loads data onto polygon layer (Does not reload the whole globe)
    useEffect(() => {
        console.log("loading the earth")
        fetch('/countries.geojson').then(res => res.json())
        .then(countries=> {
            setCountries(countries);
        });
    }, []);

    // Click on Country Event
    const showOverlay = useCallback((polygon, event, { lat, lng, altitude }) => {
        // Move camera to center in on that country
        // globeEl.current.controls().autoRotate = true; 
        // globeEl.current.controls().autoRotateSpeed = 0.1;
        const clickLocation = { lat: lat, lng: lng, altitude: 2};
        globeEl.current.pointOfView(clickLocation, 900);

        // Update overlays based on the clicked continent (ignore Antarctica, small islands)
        if (polygon.properties.CONTINENT != "Antarctica" && polygon.properties.CONTINENT != "Seven seas (open ocean)" ){
            setLatestContinent(polygon.properties.CONTINENT)
        }
    }, []);

    
    // return Earth 
    return (
        <div className={styles.earth}>
            <Globe
            ref={globeEl}
            onPolygonClick={showOverlay}
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
            />
            <div>
                <TopDiseases continent={latestContinent}/>
                <div>
                    <CountryData continent={latestContinent}/>
                </div>
            </div>
        </div>
    )
};

export default Earth;