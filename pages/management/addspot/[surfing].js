/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Header from '../../../components/header';
import Layout from '../../../components/Layout';
import { getLocationValue } from '../../../util/cookies';

const backgroundPage = css`
  min-height: 100vh;
  width: 100%;
  z-index: -1;
  margin: 0px;
  background-color: #222629;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr;
  column-gap: 40px;
  row-gap: 10px;
  padding-top: 60px;
  padding-bottom: 60px;
  padding-left: 40px;
  padding-right: 40px;
`;

const inputA = css`
  grid-column-start: 1;
  grid-row-start: 3;
`;

const inputB = css`
  grid-column-start: 1;
  grid-row-start: 4;
  align-self: center;
`;

const inputC = css`
  grid-row-start: 5;
  grid-column-start: 1;
  align-self: end;
`;

const inputD = css`
  grid-column-start: 2;
  grid-column-end: 4;
  grid-row-start: 3;
  grid-row-end: 6;
`;

const dropdownStyle = css`
  width: 100%;
  height: 50px;
  font-size: 16px;
`;

const inputStyle = css`
  width: 100%;
  height: 50px;
  font-size: 16px;
`;

const inputStyleD = css`
  width: 100%;
  height: 100%;
  font-size: 16px;
  padding: 10px;
`;

const buttonStyle = css`
  border-radius: 8px;
  margin: 16px;
  width: 100px;
  height: 32px;
  background-color: #86c232;
  color: white;
  border: none;
  font-weight: 200;
  font-size: 16px;
  grid-column-start: 3;
  grid-row-start: 6;
  align-self: center;
  justify-self: end;
`;

const guestBg = css`
  min-height: 100vh;
  width: 100%;
  z-index: -1;
  margin: 0px;
  background-color: #222629;
  display: flex;
  justify-content: center;
  align-items: center;

  padding-top: 60px;
  padding-bottom: 60px;
  padding-left: 40px;
  padding-right: 40px;
`;

const guestStyle = css`
  color: white;
`;

const guestLogin = css`
  color: #86c232;
  text-decoration: underline;
`;

export default function AddSpot(props) {
  const router = useRouter();
  const sportType = router.query.surfing;
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [sportTypeFin, setSportTypeFin] = useState(sportType);
  const [spotDescription, setSpotDescription] = useState('');

  return (
    <Layout>
      <Head>
        <title>AddSpot</title>
      </Head>
      {props.username ? (
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            await fetch(`/api/spot`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                addressInt: address,
                city: city,
                sportType: sportTypeFin,
                spotDescription: spotDescription,
                coordinates: JSON.stringify(getLocationValue()),
                usernameOwner: props.username,
                userRating: '{}',
              }),
            });

            // Navigate to the map page when
            // they have been successfully created
            router.push(`/map`);
          }}
        >
          <div css={backgroundPage}>
            <Header username={props.username} />
            <div css={inputA}>
              <label>
                <input
                  data-cy="add1"
                  value={city}
                  placeholder="City"
                  css={inputStyle}
                  onChange={(e) => {
                    setCity(e.currentTarget.value);
                  }}
                />
              </label>
            </div>
            <div css={inputB}>
              <label>
                <input
                  data-cy="add2"
                  value={address}
                  placeholder="Address"
                  css={inputStyle}
                  onChange={(e) => {
                    setAddress(e.currentTarget.value);
                  }}
                />
              </label>
            </div>
            <div css={inputC}>
              <select
                css={dropdownStyle}
                onChange={(e) => {
                  setSportTypeFin(e.currentTarget.value);
                }}
              >
                <option
                  value="surferIcon-rbg"
                  selected={sportType === 'surferIcon' ? 'selected' : ''}
                >
                  Surfing
                </option>
                <option
                  value="kitesurfIcon"
                  selected={sportType === 'kitesurfIcon' ? 'selected' : ''}
                >
                  Kitesurfing
                </option>
                <option
                  value="wakeboardIcon"
                  selected={sportType === 'wakeboardIcon' ? 'selected' : ''}
                >
                  Wakeboarding
                </option>
                <option
                  value="skateIcon-removebg"
                  selected={
                    sportType === 'skateIcon-removebg' ? 'selected' : ''
                  }
                >
                  Skateboarding
                </option>
              </select>
            </div>
            <div css={inputD}>
              <label>
                <textarea
                  data-cy="add4"
                  value={spotDescription}
                  placeholder="Add description"
                  css={inputStyleD}
                  onChange={(e) => {
                    setSpotDescription(e.currentTarget.value);
                  }}
                />
              </label>
            </div>
            <button data-cy="add-spot" css={buttonStyle}>
              Add
            </button>
          </div>
        </form>
      ) : (
        <div css={guestBg}>
          <div css={guestStyle}>
            <Link href="/login">
              <a css={guestLogin}>Login</a>
            </Link>{' '}
            or{' '}
            <Link href="/register">
              <a css={guestLogin}>Register</a>
            </Link>{' '}
            to add a spot
          </div>
        </div>
      )}
    </Layout>
  );
}
