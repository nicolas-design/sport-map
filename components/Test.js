/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import {
  GoogleMap,
  InfoWindow,
  Marker,
  useLoadScript,
} from '@react-google-maps/api';
import { formatRelative } from 'date-fns';
import { useEffect, useState } from 'react';
import mapStyle from '../mapstyles';

const testStyle = {
  width: '100vw',
  height: '100vh',
};
const libraries = ['places'];

const center = {
  lat: 48.210033,
  lng: 16.363449,
};

const options = {
  styles: mapStyle,
  disableDefaultUI: true,
  zoomControl: true,
};

const Test = () => {
  const [markers, setMarkers] = useState([]);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: '',
    libraries,
  });
  if (loadError) return 'error loading map';
  if (!isLoaded) return 'loading...';

  return (
    <div>
      <GoogleMap
        mapContainerStyle={testStyle}
        zoom={8}
        center={center}
        options={options}
        onClick={(e) => {
          setMarkers((current) => [
            ...current,
            { lat: e.latLng.lat(), lng: e.latLng.lng(), time: new Date() },
          ]);
        }}
      >
        {markers.map((marker) => {
          <Marker
            key={marker.time.toISOString()}
            position={{ lat: marker.lat, lng: marker.lng }}
          />;
        })}
      </GoogleMap>
    </div>
  );
};

export default Test;
