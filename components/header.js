/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import Image from 'next/image';
import Link from 'next/link';

const headerDiv = css`
  position: fixed;
  top: 0%;
  left: 0%;
  right: 0%;
  height: 60px;
  background-color: #222629;
  display: flex;
  align-items: center;
  text-align: center;
  z-index: 1000;
`;

const aurumStyle = css`
  position: absolute;
  margin-left: 4%;

  display: flex;
  justify-content: center;
`;

const loginStyle = css`
  font-weight: 200;
  font-size: 24px;
  color: #86c232;
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  text-decoration: none;
`;

const imgStyle = css`
  position: absolute;
  color: #86c232;
  right: 4%;
  display: flex;
`;

const aStyle = css`
  text-decoration: none;
`;

const homeStyle = css`
  position: absolute;
  right: 8%;
`;

const totalStyle = css`
  position: absolute;
  right: 4%;
  top: 9px;
  color: white;
`;

const imgSpace = css`
  margin-right: 24px;
`;

export default function Header(props) {
  return (
    <header css={headerDiv}>
      <h3 css={aurumStyle}>
        {props.username ? (
          <Link href="/logout">
            <a css={aStyle}>
              <div css={loginStyle}>Logout</div>
            </a>
          </Link>
        ) : (
          <Link href="/login">
            <a css={aStyle}>
              <div css={loginStyle}>Login</div>
            </a>
          </Link>
        )}
      </h3>
      <div css={imgStyle}>
        <div css={imgSpace}>
          <Link href={`/created/${props.username}`}>
            <a>
              <Image
                data-cy="plus-link"
                src="/plus.svg"
                alt="menu"
                height={25}
                width={25}
              />
            </a>
          </Link>
        </div>
        <div css={imgSpace}>
          <Link href={`/favorites/${props.username}`}>
            <a>
              <Image src="/heart.svg" alt="menu" height={25} width={25} />
            </a>
          </Link>
        </div>
        <div>
          <Link href="/map">
            <a>
              <Image src="/mapIcon.svg" alt="menu" height={25} width={25} />
            </a>
          </Link>
        </div>
      </div>
      <div css={totalStyle} />
      <div css={homeStyle} />
    </header>
  );
}
