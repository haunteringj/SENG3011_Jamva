import dynamic from 'next/dynamic';
import CountryData from './covid_overlay';
import TopDiseases from './earth_overlay';
import { useState, useEffect, useRef, useCallback, createRef, forwardRef } from 'react';
import styles from '../../styles/Home.module.scss'

// Earth 
function Earth() {

  //hooks
  const globeRef = createRef();


  const [latestContinent, setLatestContinent] = useState("World");
  const [latestCountry, setLatestCountry] = useState("World");
  // import basic globe



  // Hooks for loading countries onto globe
  const [countries, setCountries] = useState({ features: [] });
  // loads data onto polygon layer (Does not reload the whole globe)
  useEffect(() => {
    console.log("reloading the earth")
    fetch('/countries.geojson').then(res => res.json())
      .then(countries => {
        setCountries(countries);
      });
  }, []);

  // Click on Country Event
  const showOverlay = useCallback((polygon, { lat: endLat, lng: endLng }) => {
    // Move camera to center in on that country

    // Update overlays based on the clicked continent (ignore Antarctica, small islands)
    if (polygon.properties.CONTINENT != "Antarctica" && polygon.properties.CONTINENT != "Seven seas (open ocean)") {
      setLatestContinent(polygon.properties.CONTINENT)
      setLatestCountry(polygon.properties.NAME)
    }
  }, []);


  // return Earth 
  return (
    <div className={styles.earth}>
      <Globe
        ref={globeRef}
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
      />;
      <div className={styles.overlay}>
        <TopDiseases continent={latestContinent} />
      </div>
      <div className={styles.sidebar}>
        <CountryData continent={latestContinent} />
      </div>
    </div>
  )
};

const GlobeTmpl = dynamic(() => import("./globe"), {
  ssr: false,
});

// eslint-disable-next-line react/display-name
const Globe = forwardRef((props, ref) => (
  <GlobeTmpl {...props} forwardRef={ref} />
));

export default Earth;