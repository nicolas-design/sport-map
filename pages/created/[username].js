/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import Header from '../../components/header';

const backgroundPage = css`
  min-height: 100vh;
  width: 100%;
  z-index: -1;
  margin: 0px;
  background-color: #222629;
  display: flex;
  justify-content: space-evenly;
  padding-top: 60px;

  padding-left: 10px;
  padding-right: 10px;
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
  width: 250px;
  height: 74px;
`;

const inputStyle = css`
  margin: 10px;
  border: 1px solid black;
  width: 176px;
  height: 24px;
`;

const item = css`
  background-color: #6b6e70;
  color: white;
  border-radius: 15px;
  width: 300px;
  height: 300px;
  padding: 15px;
  margin: 20px;
  position: relative;
`;

const divStyle = css`
  margin-top: 10px;
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

const buttonWrapper = css`
  position: absolute;
  bottom: 10px;
`;

export default function Favorites(props) {
  let places = props.spot;
  places = places.sort(function (a, b) {
    return a.id - b.id;
  });
  const [editing, setEditing] = useState(null);
  const [draftSpot, setDraftSpot] = useState(null);
  const [placeAddress, setPlaceAddress] = useState(null);
  const [placeCity, setPlaceCity] = useState(null);
  const [placeSport, setPlaceSport] = useState(null);
  const [placeDescript, setPlaceDescript] = useState(null);

  const [placeRep, setPlaceRep] = useState(places);

  function sportType(type) {
    if (type === 'surferIcon-rbg') {
      return 'Surfing';
    } else if (type === 'kitesurfIcon') {
      return 'Kitesurfing';
    } else if (type === 'wakeboardIcon') {
      return 'Wakeboarding';
    } else {
      return 'Skateboarding';
    }
  }

  return (
    <div>
      <Header username={props.username} />
      <div css={backgroundPage}>
        {placeRep.map((place) => {
          return (
            <div css={item} key={place.id}>
              {editing !== place.id ? (
                <div>
                  <h2>{place.city}</h2>
                  <h3>{place.addressInt}</h3>
                  <h5 css={divStyle}>{sportType(place.sportType)}</h5>
                  <div css={divStyle}>{place.spotDescription}</div>
                  <div css={buttonWrapper}>
                    <button
                      css={buttonStyle}
                      onClick={() => {
                        setEditing(place.id);
                        setDraftSpot(place);
                      }}
                    >
                      edit
                    </button>
                    <button
                      css={buttonStyle}
                      onClick={async () => {
                        const response = await fetch(`/api/spot/${place.id}`, {
                          method: 'DELETE',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                        });
                        const { spot: updatedSpot } = await response.json();
                        let newArr = placeRep.filter(
                          (place) => place.id !== updatedSpot.id,
                        );
                        setPlaceRep(newArr);

                        console.log(updatedSpot);
                      }}
                    >
                      delete
                    </button>
                  </div>
                </div>
              ) : (
                <div css={wrapperMarker}>
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
                          draftSpot.sportType === 'surferIcon' ? 'selected' : ''
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
                  <div css={buttonWrapper}>
                    <button
                      css={buttonStyle}
                      onClick={() => {
                        setEditing(null);
                        setPlaceDescript(null);
                        setPlaceSport(null);
                        setPlaceAddress(null);
                        setPlaceCity(null);
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      css={buttonStyle}
                      onClick={async () => {
                        console.log(draftSpot.addressInt, draftSpot.userRating);
                        const response = await fetch(`/api/spot/${place.id}`, {
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
                        });
                        const { spot: updatedSpot } = await response.json();
                        console.log('update', updatedSpot);
                        let newObj = placeRep.map((obj) => {
                          if (updatedSpot.id === obj.id) {
                            return updatedSpot;
                          } else {
                            return obj;
                          }
                        });

                        setPlaceRep(newObj);
                        setEditing(null);
                        // window.location.reload(false);
                      }}
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { getInfoByUsername } = await import('../../util/database');
  const spot = await getInfoByUsername(context.query.username);
  console.log(spot);

  return {
    props: {
      spot: spot,
    },
  };
}
