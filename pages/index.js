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
  justify-content: flex-start;

  padding-right: 0;
`;

const fade = css`
  height: 100%;
  width: 100%;
  position: absolute;
  background: -webkit-linear-gradient(
    left,
    rgba(34, 38, 41, 0.85) 0%,
    rgba(0, 0, 0, 0) 20%,
    rgba(0, 0, 0, 0) 80%,
    rgba(0, 0, 0, 0.65) 100%
  );
`;

const marginStyle = css`
  padding: 70px 50px;
`;

const h1Style = css`
  color: white;
  font-weight: 400;
`;

const pStyle = css`
  color: white;
  font-size: 24px;
  margin-top: 48px;
  font-weight: 300;
  letter-spacing: 0.2em;
  line-height: 1.6em;
`;

const wrapper = css`
  width: 35%;
`;

const buttonStyle = css`
  border-radius: 8px;
  margin-top: 1.5em;
  width: 200px;
  height: 50px;
  background-color: #86c232;
  color: white;
  border: none;
  font-weight: 300;
  font-size: 16px;
`;

const imageContainer = css`
  position: absolute;
  right: 0;
  height: 100vh;
  width: 60%;
  top: 0;
`;

export default function Home(props) {
  return (
    <div>
      <Header username={props.username} />
      <div css={backgroundPage}>
        <div css={marginStyle}>
          <div css={wrapper}>
            <h1 css={h1Style}>Share the stoke!</h1>
            <p css={pStyle}>
              It does’nt matter if you just want to find the perfect spot, shred
              with friends or look for the next competition. You are at the
              right spot.
            </p>
            <Link href="/register">
              <a>
                <button css={buttonStyle}>Sign up</button>
              </a>
            </Link>
          </div>
        </div>
        <div css={imageContainer}>
          <Image
            src="/surferT2.jpg"
            alt="surfer"
            layout="fill"
            objectFit="cover"
          ></Image>
          <div css={fade}></div>
        </div>
      </div>
    </div>
  );
}
