import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

// pass in the pointdata as props

export default function Earth () {
    const Globe = dynamic(import('react-globe.gl'), { ssr: false });

    const globeEl = useRef();

    const [landingSites, setLandingSites] = useState([]);

    useEffect(() => {
      
    }, []);

    return <Globe
      globeImageUrl="/images/earth-night.jpg"
      backgroundImageUrl='/images/night-sky.png'
    
    />;
  };

