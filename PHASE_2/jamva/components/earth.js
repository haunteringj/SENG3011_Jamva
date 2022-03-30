
import { useState, useEffect, useRef, useCallback  } from 'react';
import dynamic from 'next/dynamic';

export default function Earth () {
    const Globe = dynamic(import('react-globe.gl'), { ssr: false });
    const globeEl = useRef();
    const showOverlay = useCallback((polygon, { lat: endLat, lng: endLng }) => {
      // get the contient the clicked on country is on
      console.log(polygon.properties.CONTINENT)
  
      // Move camera to center in on that country
      console.log(endLat)
      console.log(endLng)
  
      // Update/Create overlay of top 3 dieseases
      latestContinent = polygon.properties.CONTINENT
      setDiseases(diseases.filter((disease) => disease.id !== 1))
    });
  
    const [countries, setCountries] = useState({ features: []});
  
    useEffect(() => {
      // load data
      fetch('/countries.geojson').then(res => res.json())
      .then(countries=> {
        setCountries(countries);
        });
    }, []);
  
  
    return <div>
      <Globe
        globeImageUrl="/images/earth-blue-marble.jpg"
        backgroundImageUrl='/images/night-sky.png'
        backgroundColor="rgba(0,0,0,0)"
        polygonsData={countries.features.filter(d => d.properties.ISO_A2 !== 'AQ')}
        polygonCapColor={() => 'rgba(0, 0, 0, 0)'}
        polygonSideColor={() => 'rgba(0, 100, 0, 0.4)'}
        polygonLabel={({ properties: d }) => `
          <b>${d.ADMIN} (${d.ISO_A2})</b> <br />
          Population: <i>${Math.round(+d.POP_EST / 1e4) / 1e2}M</i>
        `}
        onPolygonClick={showOverlay}
      />;
    </div>
  };
