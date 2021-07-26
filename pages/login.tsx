/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Header from '../components/header';
import Layout from '../components/Layout';
import { getValidSessionByToken } from '../util/database';
import { LoginResponse } from './api/login';

const backgroundPage = css`
  min-height: 100vh;
  width: 100%;
  z-index: -1;
  margin: 0px;
  background-color: #222629;
  display: flex;
  justify-content: center;
  padding-top: 60px;
  padding-bottom: 60px;
`;

const wrap2 = css`
  background-color: #6b6e70;
  color: #86c232;
  display: flex;
  max-width: 50%;
  flex-wrap: wrap;
  min-width: 400px;
  border-radius: 24px;
  flex-direction: column;

  align-items: center;
`;

const signStyle = css`
  font-weight: 300;
  font-size: 32px;
`;

const item = css`
  margin: 16px;
`;

const inputStyle = css`
  height: 32px;
  width: 200px;
  border-radius: 16px;
  border: none;
  padding-left: 12px;
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
  &:hover {
    background-color: #679626;
  }
`;

type Props = {
  refreshUsername: () => void;
  username?: string;
};

export default function Login(props: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  return (
    <Layout username={props.username}>
      <Head>
        <title>Login</title>
      </Head>

      <form
        onSubmit={async (event) => {
          event.preventDefault();

          // Send the username and password to the API
          // for verification
          const response = await fetch(`/api/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: username,
              password: password,
            }),
          });

          const json = (await response.json()) as LoginResponse;

          if ('errors' in json) {
            setError(json.errors[0].message);
            return;
          }

          props.refreshUsername();

          // Navigate to the user's page when
          // they have been successfully created
          router.push(`/map`);
        }}
      >
        <div css={backgroundPage}>
          <Header />
          <div css={wrap2}>
            <h2 css={signStyle}>
              <u>Login</u>
            </h2>
            <div css={item}>
              <label>
                <input
                  css={inputStyle}
                  data-cy="users-management-create-username"
                  value={username}
                  placeholder="Username"
                  onChange={(event) => {
                    setUsername(event.currentTarget.value);
                  }}
                />
              </label>
            </div>

            <div css={item}>
              <label>
                <input
                  css={inputStyle}
                  data-cy="users-management-create-password"
                  value={password}
                  placeholder="Password"
                  type="password"
                  onChange={(event) => {
                    setPassword(event.currentTarget.value);
                  }}
                />
              </label>
            </div>

            <button css={buttonStyle}>Login</button>

            <div style={{ color: 'red' }}>{error}</div>
          </div>
        </div>
      </form>
    </Layout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // Redirect from HTTP to HTTPS on Heroku
  if (
    context.req.headers.host &&
    context.req.headers['x-forwarded-proto'] &&
    context.req.headers['x-forwarded-proto'] !== 'https'
  ) {
    return {
      redirect: {
        destination: `https://${context.req.headers.host}/login`,
        permanent: true,
      },
    };
  }

  const sessionToken = context.req.cookies.sessionToken;

  const session = await getValidSessionByToken(sessionToken);

  if (session) {
    // Redirect the user when they have a session
    // token by returning an object with the `redirect` prop
    // https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
    return {
      redirect: {
        destination: `/map`,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
