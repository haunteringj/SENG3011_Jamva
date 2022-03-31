import { useState, useEffect, useRef, useCallback  } from 'react';
// import dynamic from 'next/dynamic';

export default function Earth () {
  
  let Globe = () => null;
  if (typeof window != 'undefined') {
    Globe = require('react-globe.gl').default;
  }

  const redirectToTop5Page = useCallback((polygon, { lat: endLat, lng: endLng }) => {
    // get the contient the clicked on country is on
    console.log(polygon.properties.CONTINENT)

    // Move camera to center in on that country
    console.log(endLat)
    console.log(endLng)

    // Update/Create overlay of top 3 dieseases
    
    }, []);

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


  return <div>
    <Globe
    globeImageUrl="/images/earth-blue-marble.jpg"
    backgroundImageUrl='/images/night-sky.png'
    backgroundColor="rgba(0,0,0,0)"
    polygonsData={countries.features.filter(d => d.properties.ISO_A2 !== 'AQ')}
    // polygonAltitude={() => 1}
    polygonCapColor={() => `#${Math.round(Math.random() * Math.pow(2, 24)).toString(16).padStart(6, '0')}`}
    polygonSideColor={() => 'rgba(0, 100, 0, 0.15)'}
    polygonLabel={({ properties: d }) => `
      <b>${d.ADMIN} (${d.ISO_A2})</b> <br />
      Population: <i>${Math.round(+d.POP_EST / 1e4) / 1e2}M</i>
    `}
    polygonsTransitionDuration={transitionDuration}
    onPolygonClick={redirectToTop5Page}
    
  />;
  </div>
};
