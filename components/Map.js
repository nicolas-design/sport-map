import GoogleMapReact from 'google-map-react';
import React, { Component, useState } from 'react';

export default function SimpleMap() {
  const defaultProps = {
    center: {
      lat: 59.95,
      lng: 30.33,
    },
    zoom: 11,
  };
  const [markers, setMarkers] = useState([]);

  return (
    // Important! Always set the container height explicitly
    <div style={{ height: '100vh', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.API_KEY }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
        onClick={(e) => {
          setMarkers((current) => [
            ...current,
            { lat: e.latLng.lat(), lng: e.latLng.lng(), time: new Date() },
          ]);
        }}
      >
        <div lat={59.955413} lng={30.337844} text="My Marker" />
      </GoogleMapReact>
    </div>
  );
}
