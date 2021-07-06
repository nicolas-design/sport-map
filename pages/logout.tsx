/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import cookie from 'cookie';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useEffect } from 'react';
import Layout from '../components/Layout';
import { deleteSessionByToken } from '../util/database';

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

      <div>You have been logged out!</div>
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
