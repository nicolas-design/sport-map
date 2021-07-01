/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import dynamic from 'next/dynamic';
import React, { useMemo } from 'react';
import Header from '../components/header';

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

function MapPage() {
  const Map = React.useMemo(
    () =>
      dynamic(
        () => import('../components/Leaflet'), // replace '@components/map' with your component's location
        {
          loading: () => <p>A map is loading</p>,
          ssr: false, // This line is important. It's what prevents server-side render
        },
      ),
    [
      /* list variables which should trigger a re-render here */
    ],
  );
  return (
    <div>
      <Header />
      <Map />
      <button css={buttonStyle}>+</button>
    </div>
  );
}

export default MapPage;
