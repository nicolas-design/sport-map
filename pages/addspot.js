/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { useState } from 'react';
import Header from '../components/header';

const backgroundPage = css`
  min-height: 100vh;
  width: 100%;
  z-index: -1;
  margin: 0px;
  background-color: #222629;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
  column-gap: 10px;
  row-gap: 10px;
  padding-top: 60px;
  padding-bottom: 60px;
  padding-left: 40px;
  padding-right: 40px;
`;

const wrap2 = css``;

const inputA = css`
  grid-column-start: 1;
  grid-row-start: 3;
`;

const inputB = css`
  grid-column-start: 1;
  grid-row-start: 4;
`;

const inputC = css`
  grid-row-start: 5;
  grid-column-start: 1;
`;

const inputStyle = css`
  width: 100%;
  height: 50px;
`;

export default function AddSpot() {
  return (
    <div css={backgroundPage}>
      <Header />
      <div css={inputA}>
        <label>
          <input css={inputStyle} />
        </label>
      </div>
      <div css={inputB}>
        <label>
          <input css={inputStyle} />
        </label>
      </div>
      <div css={inputC}>
        <label>
          <input css={inputStyle} />
        </label>
      </div>
    </div>
  );
}
