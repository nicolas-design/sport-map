/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import cookies from 'js-cookie';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useMemo, useState } from 'react';
import Header from '../components/header';
import { getLocationValue } from '../util/cookies';

const buttonStyle = css`
  position: absolute;
  bottom: 1.2em;
  right: 1.5em;
  z-index: 1000;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  border: none;
  background-color: #222629;
  color: #86c232;
  font-size: 40px;
`;

const dropdownStyle = css`
  position: absolute;
  top: 70px;
  right: 1.5em;
  z-index: 1000;
  height: 32px;
`;

const marginStyle = css`
  height: 100px;
  padding-top: 50px;
`;

function MapPage(props) {
  const infos = props.data;
  const users = props.favorites;
  const router = useRouter();

  const [iconUrl, setIconUrl] = useState('all');
  const Map = React.useMemo(
    () =>
      dynamic(
        () => import('../components/Leaflet'), // replace '@components/map' with your component's location
        {
          loading: () => <p>A map is loading</p>,
          ssr: false, // This line is important. It's what prevents server-side render
        },
      ),
    [props],
  );
  return (
    <div>
      <Header username={props.username} />
      <div data-cy="map">
        <select
          css={dropdownStyle}
          onChange={(e) => {
            setIconUrl(e.target.value);
          }}
        >
          <option select="selected" value="all">
            All
          </option>
          <option value="/surferIcon-rbg.png">Surfing</option>
          <option value="/kitesurfIcon.png">Kitesurfing</option>
          <option value="/wakeboardIcon.png">Wakeboarding</option>
          <option value="/skateIcon-removebg.png">Skateboarding</option>
        </select>
        <Map
          iconUrl={iconUrl}
          infos={infos}
          username={props.username}
          users={users}
        />

        {props.username ? (
          <button
            data-cy="add-button"
            css={buttonStyle}
            onClick={() => {
              let test = getLocationValue();
              if (test.length === 2) {
                router.push(
                  `/management/addspot/${
                    iconUrl === 'all'
                      ? 'surferIcon-rbg'
                      : iconUrl.replace('/', '').replace('.png', '')
                  }`,
                );
              }
            }}
          >
            <div data-cy="add-link"> +</div>
          </button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}

export default MapPage;

export async function getServerSideProps() {
  const { getInfo } = await import('../util/database');
  const { getFavoritesAndUsername } = await import('../util/database');
  let data = await getInfo();
  const favorites = await getFavoritesAndUsername();
  data = data.filter((obj) => obj !== undefined);

  return {
    props: {
      data: data,
      favorites: favorites,
    },
  };
}
