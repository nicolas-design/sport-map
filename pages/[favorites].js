/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../components/header';

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

const item = css`
  background-color: #6b6e70;
  color: white;
  border-radius: 15px;
  width: 300px;
  height: 300px;
  padding: 15px;
  margin: 20px;
`;

const divStyle = css`
  margin-top: 10px;
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
  const places = props.resLoop;
  console.log(places);
  return (
    <div>
      <Header username={props.username} />
      <div css={backgroundPage}>
        {places.map((place) => {
          return (
            <div css={item} key={place.id}>
              <h2>{place.city}</h2>
              <h3>{place.addressInt}</h3>
              <h5 css={divStyle}>{sportType(place.sportType)}</h5>
              <div css={divStyle}>{place.spotDescription}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const response = await fetch(
    `${process.env.API_BASE_URL}/user/${context.query.favorites}`,
  );
  let { user } = await response.json();
  console.log('API decoded JSON from response', user);
  user = JSON.parse(user.favorites);

  const { getInfoById } = await import('../util/database');
  let resLoop = [];
  for (let i = 0; i < user.length; i++) {
    resLoop.push(await getInfoById(user[i]));
  }
  console.log(resLoop);
  return {
    props: {
      user: user,
      resLoop: resLoop,
    },
  };
}
