/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
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
  flex-wrap: wrap;
  padding-left: 10px;
  padding-right: 10px;
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
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1000;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  border: none;
  background-color: #222629;
  color: red;
  font-size: 16px;
`;

const header = css`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const headStyle = css`
  font-weight: 200;
  font-size: 36px;
  color: #86c232;
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  text-decoration: none;
`;

export default function Favorites(props) {
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
  const places2 = props.resLoop;
  const [places, setPlaces] = useState(places2);
  const user = props.user;
  console.log(places);
  return (
    <div>
      <Header username={props.username} />
      <div css={backgroundPage}>
        <div css={header}>
          <div css={headStyle}>Favorites</div>
        </div>
        {places?.map((place) => {
          return (
            <div css={item} key={place.id}>
              <h2>{place.city}</h2>
              <h3>{place.addressInt}</h3>
              <h5 css={divStyle}>{sportType(place.sportType)}</h5>
              <div css={divStyle}>{place.spotDescription}</div>
              <button
                css={buttonStyle}
                onClick={async () => {
                  console.log('user', user);
                  let favorites = user;

                  if (favorites?.includes(place.id)) {
                    favorites = favorites.filter((numb) => {
                      return numb !== place.id;
                    });
                  } else {
                    favorites = [...favorites, place.id];
                  }
                  favorites = JSON.stringify(favorites);
                  console.log('fav', favorites);

                  await fetch(`/api/user/${props.username}`, {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      favorites: favorites,
                    }),
                  });

                  const newArr = places.filter((numb) =>
                    favorites.includes(numb.id),
                  );
                  setPlaces(newArr);
                }}
              >
                X
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  if (
    context.req.headers.host &&
    context.req.headers['x-forwarded-proto'] &&
    context.req.headers['x-forwarded-proto'] !== 'https'
  ) {
    return {
      redirect: {
        destination: `https://${context.req.headers.host}/register`,
        permanent: true,
      },
    };
  }
  const response = await fetch(
    `${process.env.API_BASE_URL}/user/${context.query.favorites}`,
  );
  let { user } = await response.json();
  console.log('API decoded JSON from response', user);
  user = JSON.parse(user.favorites);

  const { getInfoById } = await import('../../util/database');
  let resLoop = [];
  for (let i = 0; i < user.length; i++) {
    resLoop.push(await getInfoById(user[i]));
  }
  resLoop = resLoop.filter((obj) => obj !== undefined);
  console.log(resLoop);
  return {
    props: {
      user: user,
      resLoop: resLoop,
    },
  };
}
