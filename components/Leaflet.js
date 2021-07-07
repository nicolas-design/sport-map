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
import Link from 'next/link';
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

const wrapperMarker = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const dropdownStyle = css`
  width: 176px;
  height: 24px;
  margin: 10px;
  border: 2px solid black;
`;

const textareaStyle = css`
  margin: 10px;
  border: 1px solid black;
  width: 176px;
  height: 100px;
`;

const inputStyle = css`
  margin: 10px;
  border: 1px solid black;
  width: 176px;
  height: 24px;
`;

const buttonStyle = css`
  border-radius: 8px;
  margin: 10px;
  width: 70px;
  height: 24px;
  background-color: #86c232;
  color: white;
  border: none;
  font-weight: 200;
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
  const username = props.username;
  const [editing, setEditing] = useState(null);
  const [draftSpot, setDraftSpot] = useState(null);
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
          {editing === info.id ? (
            <div css={wrapperMarker}>
              <div>
                <label>
                  <input
                    css={inputStyle}
                    value={draftSpot.addressInt}
                    onChange={(event) => {
                      const editedSpot = {
                        ...draftSpot,
                        addressInt: event.currentTarget.value,
                      };
                      setDraftSpot(editedSpot);
                    }}
                  />
                </label>
              </div>
              <div>
                <label>
                  <input
                    css={inputStyle}
                    value={draftSpot.city}
                    onChange={(event) => {
                      const editedSpot = {
                        ...draftSpot,
                        city: event.currentTarget.value,
                      };
                      setDraftSpot(editedSpot);
                    }}
                  />
                </label>
              </div>
              <div>
                <select
                  css={dropdownStyle}
                  onChange={(event) => {
                    const editedSpot = {
                      ...draftSpot,
                      sportType: event.currentTarget.value,
                    };
                    setDraftSpot(editedSpot);
                  }}
                >
                  <option
                    value="surferIcon-rbg"
                    selected={
                      draftSpot.sportType === 'surferIcon' ? 'selected' : ''
                    }
                  >
                    Surfing
                  </option>
                  <option
                    value="kitesurfIcon"
                    selected={
                      draftSpot.sportType === 'kitesurfIcon' ? 'selected' : ''
                    }
                  >
                    Kitesurfing
                  </option>
                  <option
                    value="wakeboardIcon"
                    selected={
                      draftSpot.sportType === 'wakeboardIcon' ? 'selected' : ''
                    }
                  >
                    Wakeboarding
                  </option>
                  <option
                    value="skateIcon-removebg"
                    selected={
                      draftSpot.sportType === 'skateIcon-removebg'
                        ? 'selected'
                        : ''
                    }
                  >
                    Skateboarding
                  </option>
                </select>
              </div>
              <div>
                <label>
                  <textarea
                    css={textareaStyle}
                    value={draftSpot.spotDescription}
                    onChange={(event) => {
                      const editedSpot = {
                        ...draftSpot,
                        spotDescription: event.currentTarget.value,
                      };
                      setDraftSpot(editedSpot);
                    }}
                  />
                </label>
              </div>
              <div>
                <button css={buttonStyle} onClick={() => setEditing(null)}>
                  Cancel
                </button>
                <button
                  css={buttonStyle}
                  onClick={async () => {
                    const response = await fetch(`/api/spot/${info.id}`, {
                      method: 'PUT',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        addressInt: draftSpot.addressInt,
                        city: draftSpot.city,
                        sportType: draftSpot.sportType,
                        spotDescription: draftSpot.spotDescription,
                      }),
                    });
                    const { spot: updatedSpot } = await response.json();
                    setEditing(null);
                    window.location.reload(false);
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h2>{info.city}</h2>
              <h3>{info.addressInt}</h3>
              {info.spotDescription}

              {username == info.usernameOwner ? (
                <div>
                  <button
                    css={buttonStyle}
                    onClick={() => {
                      setEditing(info.id);
                      setDraftSpot(info);
                    }}
                  >
                    edit
                  </button>
                  <button
                    css={buttonStyle}
                    onClick={async () => {
                      const response = await fetch(`/api/spot/${info.id}`, {
                        method: 'DELETE',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                      });
                      const { spot: updatedSpot } = await response.json();

                      window.location.reload(false);
                    }}
                  >
                    delete
                  </button>
                </div>
              ) : (
                <div />
              )}
            </div>
          )}
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
      <MarkersTotal infos={props.infos} username={props.username} />
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
