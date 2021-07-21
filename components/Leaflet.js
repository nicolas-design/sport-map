import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'; // Re-uses images from ~leaflet package
import 'leaflet-defaulticon-compatibility';
import 'esri-leaflet-geocoder/dist/esri-leaflet-geocoder.css';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { geosearch } from 'esri-leaflet-geocoder';
import HashMap from 'hashmap';
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
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Heart from 'react-heart';
import {
  LeafletMap,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import ReactStars from 'react-rating-stars-component';
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

const heartStyle = css`
  width: 1.2rem;
  align-items: right;
`;

const wrapperLike = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
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
      <Marker position={selectedPosition}>
        <Popup>Click on the plus button to add a spot</Popup>
      </Marker>
    );
  } else {
    return null;
  }
};

const MarkersTotal = (props) => {
  const infos = props.infos;
  const users2 = props.users;

  const username = props.username;
  const [editing, setEditing] = useState(null);
  const [draftSpot, setDraftSpot] = useState(null);
  const [placeAddress, setPlaceAddress] = useState(null);
  const [placeCity, setPlaceCity] = useState(null);
  const [placeSport, setPlaceSport] = useState(null);
  const [placeDescript, setPlaceDescript] = useState(null);
  const [cluster, setCluster] = useState(false);

  const [users, setUsers] = useState(users2);

  const [placeRep, setPlaceRep] = useState(infos);

  return (
    <div>
      {cluster === false ? (
        <MarkerClusterGroup key={Date.now()}>
          {placeRep.map((info) => {
            const ICON = icon({
              iconUrl: `/${info.sportType}.png`,
              iconSize: [40, 40],
            });

            const ratingChanged = async (newRating) => {
              console.log(newRating);
              let userRating = info.userRating;

              let parsedRating = JSON.parse(userRating);
              parsedRating[props.username] = newRating;
              userRating = parsedRating;

              let userRatingRes = JSON.stringify(userRating);

              const response = await fetch(`/api/spot/${info.id}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  addressInt: info.addressInt,
                  city: info.city,
                  sportType: info.sportType,
                  spotDescription: info.spotDescription,
                  userRating: userRatingRes,
                }),
              });
              const { spot: updatedSpot } = await response.json();
              let newObj = updatedSpot;
              updatedSpot.coordinates = info.coordinates;
              updatedSpot.usernameOwner = info.usernameOwner;
              newObj = placeRep.map((obj) => {
                if (updatedSpot.id === obj.id) {
                  return updatedSpot;
                } else {
                  return obj;
                }
              });
              console.log(newObj);
              setPlaceRep(newObj);
            };

            function active() {
              let user = users.filter((user) => {
                return user.username === username;
              });
              user = user[0];

              let favorites = JSON.parse(user.favorites);
              return favorites.includes(info.id);
            }

            function totalStars() {
              // setTest2(info.userRating);
              let userRating = JSON.parse(info.userRating);
              let resArray = Object.values(userRating);
              let start = 0;
              for (let i = 0; i < resArray.length; i++) {
                start += resArray[i];
              }
              return Math.round((start / resArray.length) * 100) / 100;
            }

            function peopleRated() {
              // setTest3(info.userRating);
              let userRating = JSON.parse(info.userRating);
              let resArray = Object.values(userRating);
              return resArray.length;
            }

            /* const ratingUse = useEffect(() => {
      return totalStars();
    }, [ratingChanged()]); */

            if (props.iconUrl === '/' + info.sportType + '.png') {
              return (
                <Marker
                  key={info.id}
                  position={JSON.parse(info.coordinates)}
                  icon={ICON}
                >
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
                                setPlaceAddress(event.currentTarget.value);
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
                                setPlaceCity(event.currentTarget.value);
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
                              setPlaceSport(event.currentTarget.value);
                            }}
                          >
                            <option
                              value="surferIcon-rbg"
                              selected={
                                draftSpot.sportType === 'surferIcon'
                                  ? 'selected'
                                  : ''
                              }
                            >
                              Surfing
                            </option>
                            <option
                              value="kitesurfIcon"
                              selected={
                                draftSpot.sportType === 'kitesurfIcon'
                                  ? 'selected'
                                  : ''
                              }
                            >
                              Kitesurfing
                            </option>
                            <option
                              value="wakeboardIcon"
                              selected={
                                draftSpot.sportType === 'wakeboardIcon'
                                  ? 'selected'
                                  : ''
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
                                setPlaceDescript(event.currentTarget.value);
                              }}
                            />
                          </label>
                        </div>
                        <div>
                          <button
                            css={buttonStyle}
                            onClick={() => {
                              setEditing(null);
                              setPlaceDescript(null);
                              setPlaceSport(null);
                              setPlaceAddress(null);
                              setPlaceCity(null);
                              setCluster(false);
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            css={buttonStyle}
                            onClick={async () => {
                              const response = await fetch(
                                `/api/spot/${info.id}`,
                                {
                                  method: 'PUT',
                                  headers: {
                                    'Content-Type': 'application/json',
                                  },
                                  body: JSON.stringify({
                                    addressInt: draftSpot.addressInt,
                                    city: draftSpot.city,
                                    sportType: draftSpot.sportType,
                                    spotDescription: draftSpot.spotDescription,
                                    userRating: draftSpot.userRating,
                                  }),
                                },
                              );
                              const { spot: updatedSpot } =
                                await response.json();
                              let newObj = updatedSpot;
                              updatedSpot.coordinates = draftSpot.coordinates;
                              updatedSpot.usernameOwner =
                                draftSpot.usernameOwner;
                              newObj = placeRep.map((obj) => {
                                if (updatedSpot.id === obj.id) {
                                  return updatedSpot;
                                } else {
                                  return obj;
                                }
                              });

                              setPlaceRep(newObj);
                              setCluster(false);
                              setEditing(null);
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
                        <div css={wrapperLike}>
                          <div>
                            <ReactStars
                              count={5}
                              onChange={ratingChanged}
                              size={24}
                              activeColor="#ffd700"
                              value={totalStars()}
                            />
                          </div>
                          <div css={heartStyle}>
                            <Heart
                              isActive={active()}
                              onClick={async () => {
                                console.log('beg', users);
                                let user = users.filter((user) => {
                                  return user.username === username;
                                });
                                user = user[0];

                                console.log('beg2', user);

                                let favorites = JSON.parse(user.favorites);

                                if (favorites.includes(info.id)) {
                                  favorites = favorites.filter((numb) => {
                                    return numb !== info.id;
                                  });
                                } else {
                                  favorites = [...favorites, info.id];
                                }
                                favorites = JSON.stringify(favorites);

                                const response = await fetch(
                                  `/api/user/${username}`,
                                  {
                                    method: 'PUT',
                                    headers: {
                                      'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                      favorites: favorites,
                                    }),
                                  },
                                );
                                const { spot: updatedSpot } =
                                  await response.json();

                                user.favorites = favorites;
                                console.log('fav', user.favorites);
                                console.log('use', user);

                                let newObj = user;

                                newObj = users.map((obj) => {
                                  if (user.username === obj.username) {
                                    return user;
                                  } else {
                                    return obj;
                                  }
                                });
                                console.log('obj', newObj);

                                setUsers(newObj);
                              }}
                            />
                          </div>
                        </div>
                        <div>
                          Average rating: {totalStars()} People rated:{' '}
                          {peopleRated()}
                        </div>

                        {username == info.usernameOwner ? (
                          <div>
                            <button
                              css={buttonStyle}
                              onClick={() => {
                                setEditing(info.id);
                                setDraftSpot(info);
                                console.log(info.userRating);
                                setCluster(true);
                              }}
                            >
                              edit
                            </button>
                            <button
                              css={buttonStyle}
                              onClick={async () => {
                                const response = await fetch(
                                  `/api/spot/${info.id}`,
                                  {
                                    method: 'DELETE',
                                    headers: {
                                      'Content-Type': 'application/json',
                                    },
                                  },
                                );
                                const { spot: updatedSpot } =
                                  await response.json();
                                let newArr = placeRep.filter(
                                  (place) => place.id !== updatedSpot.id,
                                );
                                setPlaceRep(newArr);
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
            } else if (props.iconUrl === 'all') {
              return (
                <Marker
                  key={info.id}
                  position={JSON.parse(info.coordinates)}
                  icon={ICON}
                >
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
                                setPlaceAddress(event.currentTarget.value);
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
                                setPlaceCity(event.currentTarget.value);
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
                              setPlaceSport(event.currentTarget.value);
                            }}
                          >
                            <option
                              value="surferIcon-rbg"
                              selected={
                                draftSpot.sportType === 'surferIcon'
                                  ? 'selected'
                                  : ''
                              }
                            >
                              Surfing
                            </option>
                            <option
                              value="kitesurfIcon"
                              selected={
                                draftSpot.sportType === 'kitesurfIcon'
                                  ? 'selected'
                                  : ''
                              }
                            >
                              Kitesurfing
                            </option>
                            <option
                              value="wakeboardIcon"
                              selected={
                                draftSpot.sportType === 'wakeboardIcon'
                                  ? 'selected'
                                  : ''
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
                                setPlaceDescript(event.currentTarget.value);
                              }}
                            />
                          </label>
                        </div>
                        <div>
                          <button
                            css={buttonStyle}
                            onClick={() => {
                              setEditing(null);
                              setPlaceDescript(null);
                              setPlaceSport(null);
                              setPlaceAddress(null);
                              setPlaceCity(null);
                              setCluster(false);
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            css={buttonStyle}
                            onClick={async () => {
                              const response = await fetch(
                                `/api/spot/${info.id}`,
                                {
                                  method: 'PUT',
                                  headers: {
                                    'Content-Type': 'application/json',
                                  },
                                  body: JSON.stringify({
                                    addressInt: draftSpot.addressInt,
                                    city: draftSpot.city,
                                    sportType: draftSpot.sportType,
                                    spotDescription: draftSpot.spotDescription,
                                    userRating: draftSpot.userRating,
                                  }),
                                },
                              );
                              const { spot: updatedSpot } =
                                await response.json();
                              let newObj = updatedSpot;
                              updatedSpot.coordinates = draftSpot.coordinates;
                              updatedSpot.usernameOwner =
                                draftSpot.usernameOwner;
                              newObj = placeRep.map((obj) => {
                                if (updatedSpot.id === obj.id) {
                                  return updatedSpot;
                                } else {
                                  return obj;
                                }
                              });

                              setPlaceRep(newObj);
                              setCluster(false);
                              setEditing(null);
                              // window.location.reload(false);
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
                        <div css={wrapperLike}>
                          <div>
                            <ReactStars
                              count={5}
                              onChange={ratingChanged}
                              size={24}
                              activeColor="#ffd700"
                              value={totalStars()}
                            />
                          </div>
                          <div css={heartStyle}>
                            <Heart
                              isActive={active()}
                              onClick={async () => {
                                console.log('beg', users);
                                let user = users.filter((user) => {
                                  return user.username === username;
                                });
                                user = user[0];

                                console.log('beg2', user);

                                let favorites = JSON.parse(user.favorites);

                                if (favorites.includes(info.id)) {
                                  favorites = favorites.filter((numb) => {
                                    return numb !== info.id;
                                  });
                                } else {
                                  favorites = [...favorites, info.id];
                                }
                                favorites = JSON.stringify(favorites);

                                const response = await fetch(
                                  `/api/user/${username}`,
                                  {
                                    method: 'PUT',
                                    headers: {
                                      'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                      favorites: favorites,
                                    }),
                                  },
                                );
                                const { spot: updatedSpot } =
                                  await response.json();

                                user.favorites = favorites;
                                console.log('fav', user.favorites);
                                console.log('use', user);

                                let newObj = user;

                                newObj = users.map((obj) => {
                                  if (user.username === obj.username) {
                                    return user;
                                  } else {
                                    return obj;
                                  }
                                });
                                console.log('obj', newObj);

                                setUsers(newObj);
                              }}
                            />
                          </div>
                        </div>
                        <div>
                          Average rating: {totalStars()} People rated:{' '}
                          {peopleRated()}
                        </div>

                        {username == info.usernameOwner ? (
                          <div>
                            <button
                              css={buttonStyle}
                              onClick={() => {
                                setEditing(info.id);
                                setDraftSpot(info);
                                setCluster(true);
                              }}
                            >
                              edit
                            </button>
                            <button
                              css={buttonStyle}
                              onClick={async () => {
                                const response = await fetch(
                                  `/api/spot/${info.id}`,
                                  {
                                    method: 'DELETE',
                                    headers: {
                                      'Content-Type': 'application/json',
                                    },
                                  },
                                );
                                const { spot: updatedSpot } =
                                  await response.json();
                                let newArr = placeRep.filter(
                                  (place) => place.id !== updatedSpot.id,
                                );
                                setPlaceRep(newArr);

                                console.log(updatedSpot);

                                // window.location.reload(false);
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
            }
          })}
        </MarkerClusterGroup>
      ) : (
        <div>
          {placeRep.map((info) => {
            const ICON = icon({
              iconUrl: `/${info.sportType}.png`,
              iconSize: [40, 40],
            });

            const ratingChanged = async (newRating) => {
              console.log(newRating);
              let userRating = info.userRating;

              let parsedRating = JSON.parse(userRating);
              parsedRating[props.username] = newRating;
              userRating = parsedRating;

              let userRatingRes = JSON.stringify(userRating);

              const response = await fetch(`/api/spot/${info.id}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  addressInt: info.addressInt,
                  city: info.city,
                  sportType: info.sportType,
                  spotDescription: info.spotDescription,
                  userRating: userRatingRes,
                }),
              });
              const { spot: updatedSpot } = await response.json();
              let newObj = updatedSpot;
              updatedSpot.coordinates = info.coordinates;
              updatedSpot.usernameOwner = info.usernameOwner;
              newObj = placeRep.map((obj) => {
                if (updatedSpot.id === obj.id) {
                  return updatedSpot;
                } else {
                  return obj;
                }
              });
              console.log(newObj);
              setPlaceRep(newObj);
            };

            function active() {
              let user = users.filter((user) => {
                return user.username === username;
              });
              user = user[0];

              let favorites = JSON.parse(user.favorites);
              return favorites.includes(info.id);
            }

            function totalStars() {
              // setTest2(info.userRating);
              let userRating = JSON.parse(info.userRating);
              let resArray = Object.values(userRating);
              let start = 0;
              for (let i = 0; i < resArray.length; i++) {
                start += resArray[i];
              }
              return Math.round((start / resArray.length) * 100) / 100;
            }

            function peopleRated() {
              // setTest3(info.userRating);
              let userRating = JSON.parse(info.userRating);
              let resArray = Object.values(userRating);
              return resArray.length;
            }

            /* const ratingUse = useEffect(() => {
      return totalStars();
    }, [ratingChanged()]); */

            if (props.iconUrl === '/' + info.sportType + '.png') {
              return (
                <Marker
                  key={info.id}
                  position={JSON.parse(info.coordinates)}
                  icon={ICON}
                >
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
                                setPlaceAddress(event.currentTarget.value);
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
                                setPlaceCity(event.currentTarget.value);
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
                              setPlaceSport(event.currentTarget.value);
                            }}
                          >
                            <option
                              value="surferIcon-rbg"
                              selected={
                                draftSpot.sportType === 'surferIcon'
                                  ? 'selected'
                                  : ''
                              }
                            >
                              Surfing
                            </option>
                            <option
                              value="kitesurfIcon"
                              selected={
                                draftSpot.sportType === 'kitesurfIcon'
                                  ? 'selected'
                                  : ''
                              }
                            >
                              Kitesurfing
                            </option>
                            <option
                              value="wakeboardIcon"
                              selected={
                                draftSpot.sportType === 'wakeboardIcon'
                                  ? 'selected'
                                  : ''
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
                                setPlaceDescript(event.currentTarget.value);
                              }}
                            />
                          </label>
                        </div>
                        <div>
                          <button
                            css={buttonStyle}
                            onClick={() => {
                              setEditing(null);
                              setPlaceDescript(null);
                              setPlaceSport(null);
                              setPlaceAddress(null);
                              setPlaceCity(null);
                              setCluster(false);
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            css={buttonStyle}
                            onClick={async () => {
                              const response = await fetch(
                                `/api/spot/${info.id}`,
                                {
                                  method: 'PUT',
                                  headers: {
                                    'Content-Type': 'application/json',
                                  },
                                  body: JSON.stringify({
                                    addressInt: draftSpot.addressInt,
                                    city: draftSpot.city,
                                    sportType: draftSpot.sportType,
                                    spotDescription: draftSpot.spotDescription,
                                    userRating: draftSpot.userRating,
                                  }),
                                },
                              );
                              const { spot: updatedSpot } =
                                await response.json();
                              let newObj = updatedSpot;
                              updatedSpot.coordinates = draftSpot.coordinates;
                              updatedSpot.usernameOwner =
                                draftSpot.usernameOwner;
                              newObj = placeRep.map((obj) => {
                                if (updatedSpot.id === obj.id) {
                                  return updatedSpot;
                                } else {
                                  return obj;
                                }
                              });

                              setPlaceRep(newObj);
                              setCluster(false);
                              setEditing(null);
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
                        <div css={wrapperLike}>
                          <div>
                            <ReactStars
                              count={5}
                              onChange={ratingChanged}
                              size={24}
                              activeColor="#ffd700"
                              value={totalStars()}
                            />
                          </div>
                          <div css={heartStyle}>
                            <Heart
                              isActive={active()}
                              onClick={async () => {
                                console.log('beg', users);
                                let user = users.filter((user) => {
                                  return user.username === username;
                                });
                                user = user[0];

                                console.log('beg2', user);

                                let favorites = JSON.parse(user.favorites);

                                if (favorites.includes(info.id)) {
                                  favorites = favorites.filter((numb) => {
                                    return numb !== info.id;
                                  });
                                } else {
                                  favorites = [...favorites, info.id];
                                }
                                favorites = JSON.stringify(favorites);

                                const response = await fetch(
                                  `/api/user/${username}`,
                                  {
                                    method: 'PUT',
                                    headers: {
                                      'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                      favorites: favorites,
                                    }),
                                  },
                                );
                                const { spot: updatedSpot } =
                                  await response.json();

                                user.favorites = favorites;
                                console.log('fav', user.favorites);
                                console.log('use', user);

                                let newObj = user;

                                newObj = users.map((obj) => {
                                  if (user.username === obj.username) {
                                    return user;
                                  } else {
                                    return obj;
                                  }
                                });
                                console.log('obj', newObj);

                                setUsers(newObj);
                              }}
                            />
                          </div>
                        </div>
                        <div>
                          Average rating: {totalStars()} People rated:{' '}
                          {peopleRated()}
                        </div>

                        {username == info.usernameOwner ? (
                          <div>
                            <button
                              css={buttonStyle}
                              onClick={() => {
                                setEditing(info.id);
                                setDraftSpot(info);
                                console.log(info.userRating);
                                setCluster(true);
                              }}
                            >
                              edit
                            </button>
                            <button
                              css={buttonStyle}
                              onClick={async () => {
                                const response = await fetch(
                                  `/api/spot/${info.id}`,
                                  {
                                    method: 'DELETE',
                                    headers: {
                                      'Content-Type': 'application/json',
                                    },
                                  },
                                );
                                const { spot: updatedSpot } =
                                  await response.json();
                                let newArr = placeRep.filter(
                                  (place) => place.id !== updatedSpot.id,
                                );
                                setPlaceRep(newArr);
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
            } else if (props.iconUrl === 'all') {
              return (
                <Marker
                  key={info.id}
                  position={JSON.parse(info.coordinates)}
                  icon={ICON}
                >
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
                                setPlaceAddress(event.currentTarget.value);
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
                                setPlaceCity(event.currentTarget.value);
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
                              setPlaceSport(event.currentTarget.value);
                            }}
                          >
                            <option
                              value="surferIcon-rbg"
                              selected={
                                draftSpot.sportType === 'surferIcon'
                                  ? 'selected'
                                  : ''
                              }
                            >
                              Surfing
                            </option>
                            <option
                              value="kitesurfIcon"
                              selected={
                                draftSpot.sportType === 'kitesurfIcon'
                                  ? 'selected'
                                  : ''
                              }
                            >
                              Kitesurfing
                            </option>
                            <option
                              value="wakeboardIcon"
                              selected={
                                draftSpot.sportType === 'wakeboardIcon'
                                  ? 'selected'
                                  : ''
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
                                setPlaceDescript(event.currentTarget.value);
                              }}
                            />
                          </label>
                        </div>
                        <div>
                          <button
                            css={buttonStyle}
                            onClick={() => {
                              setEditing(null);
                              setPlaceDescript(null);
                              setPlaceSport(null);
                              setPlaceAddress(null);
                              setPlaceCity(null);
                              setCluster(false);
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            css={buttonStyle}
                            onClick={async () => {
                              const response = await fetch(
                                `/api/spot/${info.id}`,
                                {
                                  method: 'PUT',
                                  headers: {
                                    'Content-Type': 'application/json',
                                  },
                                  body: JSON.stringify({
                                    addressInt: draftSpot.addressInt,
                                    city: draftSpot.city,
                                    sportType: draftSpot.sportType,
                                    spotDescription: draftSpot.spotDescription,
                                    userRating: draftSpot.userRating,
                                  }),
                                },
                              );
                              const { spot: updatedSpot } =
                                await response.json();
                              let newObj = updatedSpot;
                              updatedSpot.coordinates = draftSpot.coordinates;
                              updatedSpot.usernameOwner =
                                draftSpot.usernameOwner;
                              newObj = placeRep.map((obj) => {
                                if (updatedSpot.id === obj.id) {
                                  return updatedSpot;
                                } else {
                                  return obj;
                                }
                              });

                              setPlaceRep(newObj);
                              setCluster(false);
                              setEditing(null);
                              // window.location.reload(false);
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
                        <div css={wrapperLike}>
                          <div>
                            <ReactStars
                              count={5}
                              onChange={ratingChanged}
                              size={24}
                              activeColor="#ffd700"
                              value={totalStars()}
                            />
                          </div>
                          <div css={heartStyle}>
                            <Heart
                              isActive={active()}
                              onClick={async () => {
                                console.log('beg', users);
                                let user = users.filter((user) => {
                                  return user.username === username;
                                });
                                user = user[0];

                                console.log('beg2', user);

                                let favorites = JSON.parse(user.favorites);

                                if (favorites.includes(info.id)) {
                                  favorites = favorites.filter((numb) => {
                                    return numb !== info.id;
                                  });
                                } else {
                                  favorites = [...favorites, info.id];
                                }
                                favorites = JSON.stringify(favorites);

                                const response = await fetch(
                                  `/api/user/${username}`,
                                  {
                                    method: 'PUT',
                                    headers: {
                                      'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                      favorites: favorites,
                                    }),
                                  },
                                );
                                const { spot: updatedSpot } =
                                  await response.json();

                                user.favorites = favorites;
                                console.log('fav', user.favorites);
                                console.log('use', user);

                                let newObj = user;

                                newObj = users.map((obj) => {
                                  if (user.username === obj.username) {
                                    return user;
                                  } else {
                                    return obj;
                                  }
                                });
                                console.log('obj', newObj);

                                setUsers(newObj);
                              }}
                            />
                          </div>
                        </div>
                        <div>
                          Average rating: {totalStars()} People rated:{' '}
                          {peopleRated()}
                        </div>

                        {username == info.usernameOwner ? (
                          <div>
                            <button
                              css={buttonStyle}
                              onClick={() => {
                                setEditing(info.id);
                                setDraftSpot(info);
                                setCluster(true);
                              }}
                            >
                              edit
                            </button>
                            <button
                              css={buttonStyle}
                              onClick={async () => {
                                const response = await fetch(
                                  `/api/spot/${info.id}`,
                                  {
                                    method: 'DELETE',
                                    headers: {
                                      'Content-Type': 'application/json',
                                    },
                                  },
                                );
                                const { spot: updatedSpot } =
                                  await response.json();
                                let newArr = placeRep.filter(
                                  (place) => place.id !== updatedSpot.id,
                                );
                                setPlaceRep(newArr);

                                console.log(updatedSpot);

                                // window.location.reload(false);
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
            }
          })}
        </div>
      )}
    </div>
  );
};

const Map = (props) => {
  console.log(props.infos);
  const [prevIcon, setPrevIcon] = useState('all');
  const [markers, setMarkers] = useState([]);
  const [initialPosition, setInitialPosition] = useState([
    48.210033, 16.363449,
  ]);

  /* const markerGroup = useMemo(() => {
    return (
      <MarkerClusterGroup showCoverageOnHover={false} key={Date.now()}>
        <MarkersTotal
          infos={props.infos}
          username={props.username}
          iconUrl={props.iconUrl}
          users={props.users}
        />
      </MarkerClusterGroup>
    );
  }, [props.iconUrl]); */

  const ICON = icon({
    iconUrl: props.iconUrl === 'all' ? '/surferIcon-rbg.png' : props.iconUrl,
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
    <html lang="eng">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet/dist/leaflet.css"
        />

        <link
          rel="stylesheet"
          href="https://unpkg.com/react-leaflet-markercluster/dist/styles.min.css"
        />
      </head>

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

        <Markers />

        <MarkersTotal
          infos={props.infos}
          username={props.username}
          iconUrl={props.iconUrl}
          users={props.users}
        />
      </MapContainer>
    </html>
  );
};

export default Map;
