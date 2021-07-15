/* import {Marker, Popup} from "react-leaflet"

export default function markerComp(props) {
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
                }}
              >
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
                  // window.location.reload(false);
                }}
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h2>{placeCity === null ? info.city : placeCity}</h2>
            <h3>{placeAddress === null ? info.addressInt : placeAddress}</h3>
            {info.spotDescription}
            <div>
              <ReactStars
                count={5}
                onChange={ratingChanged}
                size={24}
                activeColor="#ffd700"
              />
            </div>
            ,
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
} */
