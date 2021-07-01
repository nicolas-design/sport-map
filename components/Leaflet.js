import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'; // Re-uses images from ~leaflet package
import 'leaflet-defaulticon-compatibility';
import 'esri-leaflet-geocoder/dist/esri-leaflet-geocoder.css';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { geosearch } from 'esri-leaflet-geocoder';
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

const ICON = icon({
  iconUrl: '/surferIcon-rbg.png',
  iconSize: [40, 40],
});
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
    marker: {
      icon: ICON,

      draggable: true,
    },
  });

  const map = useMap();
  useEffect(() => {
    map.addControl(searchControl);
    return () => map.removeControl(searchControl);
  }, []);

  return null;
};

const Markers = () => {
  const [selectedPosition, setSelectedPosition] = useState([]);

  const mapFunc = useMapEvents({
    click(e) {
      setSelectedPosition((current) => [
        ...current,
        { lat: e.latlng.lat, lng: e.latlng.lng, time: new Date() },
      ]);
    },
  });

  return selectedPosition.map((marker) => {
    return (
      <Marker
        key={marker.time.toISOString()}
        position={[marker.lat, marker.lng]}
        icon={ICON}
      >
        <Popup>ya</Popup>
      </Marker>
    );
  });
};

const Map = () => {
  const [markers, setMarkers] = useState([]);
  const [initialPosition, setInitialPosition] = useState([
    48.210033, 16.363449,
  ]);

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

      <Marker position={[48.210033, 16.363449]} icon={ICON}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
      <Markers />
    </MapContainer>
  );
};

export default Map;
