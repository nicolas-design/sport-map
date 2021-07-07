/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import cookie from 'cookie';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect } from 'react';
import Layout from '../components/Layout';
import { deleteSessionByToken } from '../util/database';

const backgroundPage = css`
  display: flex;

  flex-wrap: wrap;

  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  z-index: -1;
  margin: 0px;
  background-color: #222629;
  display: flex;

  padding-top: 60px;
  padding-bottom: 60px;
`;

const logoutStyle = css`
  color: #86c232;
`;
const linkStyle = css`
  color: #86c232;
  text-decoration: underline;
`;

type Props = {
  refreshUsername: () => void;
  username?: string;
};

export default function Logout(props: Props) {
  useEffect(() => props.refreshUsername(), [props]);

  return (
    <Layout username={props.username}>
      <Head>
        <title>Logout</title>
      </Head>
      <div css={backgroundPage}>
        <div>
          <h1 css={logoutStyle}>You have been logged out!</h1>
        </div>
        <div>
          <h3 css={logoutStyle}>Thank you for supporting my app!!</h3>
        </div>
        <div>
          <h3 css={logoutStyle}>
            Shakra bro{' '}
            <span role="img" aria-label="shakra emoji">
              &#129305;
            </span>
          </h3>
        </div>
        <div>
          <Link href="/">
            <a css={linkStyle}>Home</a>
          </Link>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const sessionToken = context.req.cookies.sessionToken;

  if (sessionToken) {
    await deleteSessionByToken(sessionToken);
  }
  // Note: if you want to redirect the user when they have no session
  // token, you could return an object with the `redirect` prop
  // https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering

  // Instruct the browser to delete the cookie
  context.res.setHeader(
    'Set-Cookie',
    cookie.serialize('sessionToken', '', {
      maxAge: -1,
      path: '/',
    }),
  );

  return {
    props: {},
  };
}
