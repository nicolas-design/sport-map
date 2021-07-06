import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'; // Re-uses images from ~leaflet package
import 'leaflet-defaulticon-compatibility';
import 'esri-leaflet-geocoder/dist/esri-leaflet-geocoder.css';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { geosearch } from 'esri-leaflet-geocoder';
import cookies from 'js-cookie';
import L, { icon } from 'leaflet';
// import
import {
  GeoSearchControl,
  MapBoxProvider,
  OpenStreetMapProvider,
  SearchControl,
} from 'leaflet-geosearch';
import { useEffect, useRef, useState } from 'react';
import {
  LeafletMap,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import { getLocationValue } from '../util/cookies';

// search
const searchStyle = css`
  width: 500px;
`;

const provider = new OpenStreetMapProvider();

const SearchField = ({ apiKey }) => {
  const provider = new MapBoxProvider({
    params: {
      access_token: apiKey,
    },
  });

  // @ts-ignore
  const searchControl = new GeoSearchControl({
    provider: new OpenStreetMapProvider(),
    showMarker: false,
  });

  const map = useMap();
  useEffect(() => {
    map.addControl(searchControl);
    return () => map.removeControl(searchControl);
  }, []);

  return null;
};

const Markers = (props) => {
  const [selectedPosition, setSelectedPosition] = useState(getLocationValue());
  cookies.set('location', selectedPosition);
  console.log(selectedPosition);
  const mapFunc = useMapEvents({
    click(e) {
      setSelectedPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  if (selectedPosition?.length > 0) {
    return (
      <Marker position={selectedPosition} icon={props.examp}>
        <Popup>ya</Popup>
      </Marker>
    );
  } else {
    return null;
  }
};

const MarkersTotal = (props) => {
  const infos = props.infos;
  // const [selectedPosition, setSelectedPosition] = useState([]);

  /* const mapFunc = useMapEvents({
    click(e) {
      setSelectedPosition((current) => [
        ...current,
        { lat: e.latlng.lat, lng: e.latlng.lng, time: new Date() },
      ]);
    },
  });*/

  return infos.map((info) => {
    const ICON = icon({
      iconUrl: `/${info.sportType}.png`,
      iconSize: [40, 40],
    });
    return (
      <Marker key={info.id} position={JSON.parse(info.coordinates)} icon={ICON}>
        <Popup>
          <h2>{info.city}</h2>
          <h3>{info.addressInt}</h3>
          {info.spotDescription}
        </Popup>
      </Marker>
    );
  });
};

const Map = (props) => {
  console.log(props.infos);
  const [markers, setMarkers] = useState([]);
  const [initialPosition, setInitialPosition] = useState([
    48.210033, 16.363449,
  ]);

  const ICON = icon({
    iconUrl: props.iconUrl,
    iconSize: [40, 40],
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setInitialPosition([latitude, longitude]);
    });
  }, []);

  const mapRef = useRef();

  useEffect(() => {
    const { current = {} } = mapRef;
    const { leafletElement: map } = current;

    if (!map) return;

    const control = geosearch();

    control.addTo(map);
  }, []);

  return (
    <MapContainer
      center={initialPosition}
      zoom={13}
      scrollWheelZoom={true}
      zoomControl={false}
      style={{ marginTop: '60px', height: '100vh', width: '100%' }}
      onClick={(e) => {
        const { lat, lng } = e.latlng;
        console.log(lat, lng);
        setMarkers((current) => [
          ...current,
          { lat: e.latLng.lat(), lng: e.latLng.lng(), time: new Date() },
        ]);
      }}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <SearchField />

      <Markers examp={ICON} />
      <MarkersTotal infos={props.infos} />
    </MapContainer>
  );
};

export default Map;

/* export async function getServerSideProps() {
  const { getInfo } = await import('../util/database');
  const data = await getInfo();
  console.log(data);
  return {
    props: {
      data: data,
    },
  };
}
*/
