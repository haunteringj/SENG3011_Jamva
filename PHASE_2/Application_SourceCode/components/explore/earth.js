import CountryData from "./covid_overlay";
import TopDiseases from "./earth_overlay";
import {
  useState,
  useEffect,
  useRef,
  useCallback,
  createRef,
  forwardRef,
} from "react";
import axios from "axios";
import styles from "../../styles/Explore.module.scss";
import ReportOverlay from "./report_overlay";
import dynamic from "next/dynamic";
import { Alert, Box } from "@chakra-ui/react";
import Alerts from "../users/alerts";

function Earth() {
  //hooks
  const globeRef = useRef();

  //state variables
  const [latestContinent, setLatestContinent] = useState("World");
  const [latestCountry, setLatestCountry] = useState("World");
  const [countries, setCountries] = useState({ features: [] });
  const [reportData, setReportData] = useState([]);
  const [c, setc] = useState({});
  //   const testData = { "united states": { "reports": [{ "id": 8702058, "headline": " Equine herpesvirus - North America (04): USA (CA) horse", "source": "https://thehorse.com/1109503/california-ehv-outbreak-update/", "date": " 2022-03-18 13:20:01 AEDT " }, { "id": 8702050, "headline": " Salmonellosis, st. Saintpaul - USA: unknown source, FDA", "source": "https://www.foodsafetynews.com/2022/03/officials-report-dozens-of-people-are-sick-in-new-salmonella-saintpaul-outbreak/", "date": " 2022-03-18 04:21:42 AEDT " }], "lat": 39.7837304, "long": -100.445882 }, "united kingdom": { "reports": [{ "id": 8702057, "headline": " Cucurbit chlorotic yellows virus: emerging pathogen", "source": "https://gd.eppo.int/reporting/article-7273", "date": " 2022-03-18 13:15:49 AEDT " }, { "id": 8702045, "headline": " Chikungunya (01) - Americas, Asia, Africa, research", "source": "https://promedmail.org/promed-post?place=8702045,35574", "date": " 2022-03-18 04:18:03 AEDT " }, { "id": 8702041, "headline": " Leishmaniasis - Bolivia (03): (TR) dog", "source": "https://elpais.bo/tarija/20220314_confirman-casos-positivos-de-leishmaniasis-en-canes-de-villa-montes.html", "date": " 2022-03-17 14:22:06 AEDT " }], "lat": 54.7023545, "long": -3.2765753 }, "switzerland": { "reports": [{ "id": 8702054, "headline": " Newcastle disease - Switzerland (02): (JU) poultry, OIE", "source": "https://wahis.oie.int/#/report-info?reportId=50545", "date": " 2022-03-18 13:11:31 AEDT " }], "lat": 46.7985624, "long": 8.2319736 }, "china": { "reports": [{ "id": 8702053, "headline": " COVID-19 update (74): postpartum and long-term depression, China, tinnitus, WHO", "source": "https://www.cidrap.umn.edu/news-perspective/2022/03/news-scan-mar-15-2022", "date": " 2022-03-18 13:09:12 AEDT " }, { "id": 8702037, "headline": " COVID-19 update (73): China, global, Pfizer, WHO", "source": "https://asia.nikkei.com/Spotlight/Coronavirus/China-COVID-cases-jump-as-Jilin-outbreak-grows-in-northeast", "date": " 2022-03-17 13:30:55 AEDT " }], "lat": 35.000074, "long": 104.999927 }, "japan": { "reports": [{ "id": 8702040, "headline": " Japanese encephalitis - Australia (09): (NS) horse, susp., RFI", "source": "https://www.areanews.com.au/story/7660438/horse-catches-mosquito-borne-virus-after-visiting-griffith/?cs=9272", "date": " 2022-03-17 14:33:35 AEDT " }, { "id": 8702034, "headline": " Japanese encephalitis & other - India (01): (BR)", "source": "https://www.newindianexpress.com/nation/2022/mar/16/with-rise-in-temperature-bihar-reports-more-cases-of-acute-encephalitis-syndrome-among-kids-2430621.html", "date": " 2022-03-17 13:23:05 AEDT " }, { "id": 8702033, "headline": " Japanese encephalitis - Australia (10): (NS) RFI", "source": "https://thewest.com.au/news/health/seventh-nsw-case-of-japanese-encephalitis-c-6074849", "date": " 2022-03-17 08:03:16 AEDT " }], "lat": 36.5748441, "long": 139.2394179 }, "india": { "reports": [{ "id": 8702039, "headline": " Undiagnosed disease, maize - India: (MH)", "source": "https://pipanews.com/rabi-season-summer-maize-is-in-full-swing-but-comatose-due-to-die-disease-what-is-the-advice-of-agriculturists-pest-outbreak-on-summer-season-maize-crop-what-is-the-solution/", "date": " 2022-03-17 14:16:13 AEDT " }], "lat": 22.3511148, "long": 78.6677428 }, "kenya": { "reports": [{ "id": 8702038, "headline": " Yellow fever - Africa (03): Kenya (IS) WHO", "source": "https://apps.who.int/iris/bitstream/handle/10665/352474/OEW11-0713032022.pdf", "date": " 2022-03-17 14:14:53 AEDT " }], "lat": 1.4419683, "long": 38.4313975 }, "nigeria": { "reports": [{ "id": 8701937, "headline": " Cholera, diarrhea & dysentery update (09): Africa (Nigeria), Asia (India)", "source": "https://www.thecable.ng/children-most-affected-ncdc-records-701-suspected-cholera-cases-in-two-months", "date": " 2022-03-17 04:39:59 AEDT " }], "lat": 9.6000359, "long": 7.9999721 }, "australia": { "reports": [{ "id": 8702027, "headline": " Brucellosis - Australia: (NS) feral pig, alert", "source": "https://www.singletonargus.com.au/story/7659527/brucella-suis-virus-detected-in-feral-pig-near-cassilis/", "date": " 2022-03-17 01:06:07 AEDT " }, { "id": 8702024, "headline": " Japanese encephalitis - Australia (09): (VI) pig", "source": "https://www.canberratimes.com.au/story/7659405/more-japanese-encephalitis-detections-in-northern-victorian-piggeries/?cs=14231", "date": " 2022-03-17 01:03:20 AEDT " }], "lat": -24.7761086, "long": 134.755 } };

  // const test = {"australia" : {"reports" : ["hello"]}}

  // loads data onto polygon layer (Does not reload the whole globe)
  useEffect(() => {
    console.log("reloading the earth");
    console.log("loading all the reports");
    fetch("/countries.geojson")
      .then((res) => res.json())
      .then((countries) => {
        setCountries(countries);
      });

    axios
      .get(`http://${process.env.NEXT_PUBLIC_API_URL}/v1/latestReports`)
      .then((resp) => {
        const countries = resp.data;
        const result = [];
        var cs = {};
        for (const [country, cData] of Object.entries(countries)) {
          // console.log(cData)
          cs[country] = cData["reports"];
          result.push({
            lat: cData["lat"],
            lng: cData["long"],
            numReports: cData["reports"].length,
          });
        }
        setc(cs);
        return result;
      })
      .then((result) => {
        setReportData(result);
      });
  }, []);

  // Click on Country Event
  const showOverlay = useCallback((polygon, event, { lat, lng, altitude }) => {
    // Move camera to center in on that country
    // globeEl.current.controls().autoRotate = true;
    // globeEl.current.controls().autoRotateSpeed = 0.1;
    const clickLocation = { lat: lat, lng: lng, altitude: 2 };
    globeRef.current.pointOfView(clickLocation, 900);

    // Update overlays based on the clicked continent (ignore Antarctica, small islands)
    if (
      polygon.properties.CONTINENT != "Antarctica" &&
      polygon.properties.CONTINENT != "Seven seas (open ocean)"
    ) {
      setLatestContinent(polygon.properties.CONTINENT);
      setLatestCountry(polygon.properties.NAME.toString().toLowerCase());
      if (polygon.properties.NAME == "United States of America") {
        setLatestCountry("united states");
      }
      console.log(polygon.properties.NAME);
    }
  }, []);

  // return Earth
  return reportData === [] ? (
    <> Loading Globe </>
  ) : (
    <div className={styles.earth}>
      <Globe
        ref={globeRef}
        onPolygonClick={showOverlay}
        globeImageUrl="/images/earth-blue-marble.jpg"
        backgroundImageUrl="/images/night-sky.png"
        backgroundColor="rgba(0,0,0,0)"
        polygonsData={countries.features}
        polygonCapColor={() => "rgba(0, 0, 0, 0)"}
        polygonSideColor={() => "rgba(0, 100, 0, 0.4)"}
        polygonLabel={({ properties: d }) => `
                <b>${d.ADMIN} (${d.ISO_A2})</b> <br />
                Population: <i>${Math.round(+d.POP_EST / 1e4) / 1e2}M</i>
            `}
        hexBinPointsData={reportData}
        hexBinPointWeight="numReports"
        hexAltitude={(d) => d.sumWeight * 6e-8 * 1000000}
        hexBinResolution={3}
        hexTopColor={(d) => "#FFA500"}
        hexSideColor={(d) => "#FF0000"}
      />
      ;
      <div className={styles.overlay}>
        <Box display="flex" flexDir="row" w="md" justifyContent="space-between">
          <TopDiseases continent={latestContinent} />
          <CountryData continent={latestContinent} />
        </Box>
      </div>
      {latestCountry !== "World" && latestCountry in c ? (
        <div className={styles.reportOverlay}>
          <ReportOverlay
            reports={c[latestCountry]}
            country={latestCountry.toUpperCase()}
          />
        </div>
      ) : null}
      <Alerts />
    </div>
  );
}

const GlobeTmpl = dynamic(() => import("./globe"), {
  ssr: false,
});

// eslint-disable-next-line react/display-name
const Globe = forwardRef((props, ref) => (
  <GlobeTmpl {...props} forwardRef={ref} />
));

export default Earth;
