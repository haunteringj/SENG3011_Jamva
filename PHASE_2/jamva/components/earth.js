
import { useState, useEffect, useRef, useCallback  } from 'react';
import dynamic from 'next/dynamic';

// pass in the pointdata as props

export default function Earth () {
  const Globe = dynamic(import('react-globe.gl'), { ssr: false });

  // const [arcsData, setArcsData] = useState([]);
  // const [ringsData, setRingsData] = useState([]);

  // const prevCoords = useRef({ lat: 0, lng: 0 });
  // const emitArc = useCallback(({ lat: endLat, lng: endLng }) => {
  //   const { lat: startLat, lng: startLng } = prevCoords.current;
  //   prevCoords.current = { lat: endLat, lng: endLng };

  //   // add and remove arc after 1 cycle
  //   const arc = { startLat, startLng, endLat, endLng };
  //   setArcsData(curArcsData => [...curArcsData, arc]);
  //   setTimeout(() => setArcsData(curArcsData => curArcsData.filter(d => d !== arc)), FLIGHT_TIME * 2);

  //   // add and remove start rings
  //   const srcRing = { lat: startLat, lng: startLng };
  //   setRingsData(curRingsData => [...curRingsData, srcRing]);
  //   setTimeout(() => setRingsData(curRingsData => curRingsData.filter(r => r !== srcRing)), FLIGHT_TIME * ARC_REL_LEN);

  //   // add and remove target rings
  //   setTimeout(() => {
  //     const targetRing = { lat: endLat, lng: endLng };
  //     setRingsData(curRingsData => [...curRingsData, targetRing]);
  //     setTimeout(() => setRingsData(curRingsData => curRingsData.filter(r => r !== targetRing)), FLIGHT_TIME * ARC_REL_LEN);
  //   }, FLIGHT_TIME);
  // }, []);

  const redirectToTop5Page = useCallback((polygon) => {
    console.log(polygon.properties.CONTINENT)
    }, []);

  const globeEl = useRef();
  const [countries, setCountries] = useState({ features: []});
  const [continents, setContinents] = useState({ features: []});
  const [altitude, setAltitude] = useState(0.1);
  const [transitionDuration, setTransitionDuration] = useState(1000);

  useEffect(() => {
    // load data
    fetch('/countries.geojson').then(res => res.json())
    .then(countries=> {
      setCountries(countries);
    // load data
    // fetch('/continents.geojson').then(res => res.json())
    //   .then(continents=> {
    //     setContinents(continents);

        setTimeout(() => {
          setTransitionDuration(4000);
          // setAltitude(() => feat => Math.max(0.1, Math.sqrt(+feat.properties.POP_EST) * 7e-5));
          // setAltitude(() => 10);
        }, 3000);
      });
  }, []);


  return <Globe
    globeImageUrl="/images/earth-blue-marble.jpg"
    backgroundImageUrl='/images/night-sky.png'
    // polygonsData={continents.features}
    polygonsData={countries.features.filter(d => d.properties.ISO_A2 !== 'AQ')}
    polygonAltitude={() => 1}
    polygonCapColor={() => `#${Math.round(Math.random() * Math.pow(2, 24)).toString(16).padStart(6, '0')}`}
    polygonSideColor={() => 'rgba(0, 100, 0, 0.15)'}
    polygonLabel={({ properties: d }) => `
      <b>${d.ADMIN} (${d.ISO_A2})</b> <br />
      Population: <i>${Math.round(+d.POP_EST / 1e4) / 1e2}M</i>
    `}
    polygonsTransitionDuration={transitionDuration}
    onPolygonClick={redirectToTop5Page}
    
  />;
};
