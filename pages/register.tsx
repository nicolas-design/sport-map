/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Header from '../components/header';
import Layout from '../components/Layout';
import { generateCsrfSecretByToken } from '../util/auth';
import { getValidSessionByToken } from '../util/database';
import { RegisterResponse } from './api/register';

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
`;

type Props = {
  refreshUsername: () => void;
  username: string;
  csrfToken: string;
};

export default function Register(props: Props) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  return (
    <Layout username={props.username}>
      <Head>
        <title>Register</title>
      </Head>

      <form
        onSubmit={async (event) => {
          event.preventDefault();
          const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              firstName: firstName,
              lastName: lastName,
              username: username,
              password: password,
              email: email,
              csrfToken: props.csrfToken,
              favorites: '[]',
            }),
          });
          const json = (await response.json()) as RegisterResponse;

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
        <div>
          <Header />
          <div css={backgroundPage}>
            <div css={wrap2}>
              <h2 css={signStyle}>
                <u>Sign up</u>
              </h2>
              <div css={item}>
                <label>
                  <input
                    data-cy="register1"
                    css={inputStyle}
                    placeholder="Username"
                    onChange={(event) => {
                      setUsername(event.currentTarget.value);
                    }}
                    value={username}
                  />
                </label>
              </div>
              <div css={item}>
                <label>
                  <input
                    data-cy="register2"
                    css={inputStyle}
                    placeholder="Name"
                    onChange={(event) => {
                      setFirstName(event.currentTarget.value);
                    }}
                    value={firstName}
                  />
                </label>
              </div>
              <div css={item}>
                <label>
                  <input
                    data-cy="register3"
                    css={inputStyle}
                    placeholder="Last Name"
                    onChange={(event) => {
                      setLastName(event.currentTarget.value);
                    }}
                    value={lastName}
                  />
                </label>
              </div>
              <div css={item}>
                <label>
                  <input
                    data-cy="register4"
                    css={inputStyle}
                    placeholder="Password"
                    type="password"
                    onChange={(event) => {
                      setPassword(event.currentTarget.value);
                    }}
                    value={password}
                  />
                </label>
              </div>
              <div css={item}>
                <label>
                  <input
                    data-cy="register5"
                    css={inputStyle}
                    placeholder="Email"
                    onChange={(event) => {
                      setEmail(event.currentTarget.value);
                    }}
                    value={email}
                  />
                </label>
              </div>
              <div>
                <button data-cy="signup-link" css={buttonStyle}>
                  Sign up
                </button>
              </div>
            </div>
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
        destination: `https://${context.req.headers.host}/register`,
        permanent: true,
      },
    };
  }

  // eslint-disable-next-line unicorn/prefer-node-protocol
  const crypto = await import('crypto');
  const { createSerializedRegisterSessionTokenCookie } = await import(
    '../util/cookies'
  );
  const { insertFiveMinuteSessionWithoutUserId, deleteExpiredSessions } =
    await import('../util/database');

  // Import and initialize the `csrf` library
  const Tokens = await (await import('csrf')).default;
  const tokens = new Tokens();

  // Get session information if user is already logged in
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

  await deleteExpiredSessions();

  // Generate 5-minute short-lived session, only for the registration
  const shortLivedSession = await insertFiveMinuteSessionWithoutUserId(
    crypto.randomBytes(64).toString('base64'),
  );

  // Set new cookie for the short-lived session
  const cookie = createSerializedRegisterSessionTokenCookie(
    shortLivedSession.token,
  );
  context.res.setHeader('Set-Cookie', cookie);

  // Use token from short-lived session to generate
  // secret for the CSRF token
  const csrfSecret = generateCsrfSecretByToken(shortLivedSession.token);

  // Create CSRF token
  const csrfToken = tokens.create(csrfSecret);

  return {
    props: {
      // Pass CSRF Token via props
      csrfToken,
    },
  };
}
