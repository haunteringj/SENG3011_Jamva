
import { useState, useEffect, useRef, useCallback  } from 'react';
import dynamic from 'next/dynamic';
// import overlayStyle from "../styles/overlay.scss"

// pass in the pointdata as props

export default function Earth () {
  const Globe = dynamic(import('react-globe.gl'), { ssr: false });
  const globeEl = useRef();
  const redirectToTop5Page = useCallback((polygon, { lat: endLat, lng: endLng }) => {
    // get the contient the clicked on country is on
    console.log(polygon.properties.CONTINENT)

    // Move camera to center in on that country
    console.log(endLat)
    console.log(endLng)

    // Update/Create overlay of top 3 dieseases
    console.log(Overlay)
  });

  const Overlay = () => {
    <div className="overlay">
      Top 3 dieseases:
      1. Covid
      2. 420
      3. 69
    </div>
  }
  const [countries, setCountries] = useState({ features: []});
  const [transitionDuration, setTransitionDuration] = useState(1000);

  useEffect(() => {
    // load data
    fetch('/countries.geojson').then(res => res.json())
    .then(countries=> {
      setCountries(countries);

        setTimeout(() => {
          setTransitionDuration(4000);
        }, 3000);
      });
  }, []);

  // useEffect(() => {
  //   const MAP_CENTER = { lat: 0, lng: 0, altitude: 1.5 };
  //   globeEl.current.pointOfView(MAP_CENTER, 0);
  // }, [globeEl]);

  return <Globe
    ref={globeEl}
    globeImageUrl="/images/earth-blue-marble.jpg"
    backgroundImageUrl='/images/night-sky.png'
    polygonsData={countries.features.filter(d => d.properties.ISO_A2 !== 'AQ')}
    // polygonAltitude={() => 1}
    // polygonCapColor={() => `#${Math.round(Math.random() * Math.pow(2, 24)).toString(16).padStart(6, '0')}`}
    polygonCapColor={() => 'rgba(0, 0, 0, 0)'}
    polygonSideColor={() => 'rgba(0, 100, 0, 0.5)'}
    polygonLabel={({ properties: d }) => `
      <b>${d.ADMIN} (${d.ISO_A2})</b> <br />
      Population: <i>${Math.round(+d.POP_EST / 1e4) / 1e2}M</i>
    `}
    polygonsTransitionDuration={transitionDuration}
    onPolygonClick={redirectToTop5Page}
    // globeEl.pointOfView({ lat: 0, lng: 0, altitude: 1.5 },0)
  />;
};
