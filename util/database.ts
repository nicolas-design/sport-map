import camelcaseKeys from 'camelcase-keys';
import dotenvSafe from 'dotenv-safe';
import postgres from 'postgres';
import setPostgresDefaultsOnHeroku from '../setPostgresDefaultsOnHeroku';
import {
  ApplicationError,
  Info,
  Session,
  User,
  UserWithPasswordHash,
} from './types';

setPostgresDefaultsOnHeroku();

// Read the PostgreSQL secret connection information
// (host, database, username, password) from the .env file
dotenvSafe.config();

declare module globalThis {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  let __postgresSqlClient: ReturnType<typeof postgres> | undefined;
}

// Connect only once to the database
// https://github.com/vercel/next.js/issues/7811#issuecomment-715259370
function connectOneTimeToDatabase() {
  let sql;

  if (process.env.NODE_ENV === 'production') {
    // Heroku needs SSL connections but
    // has an "unauthorized" certificate
    // https://devcenter.heroku.com/changelog-items/852
    sql = postgres({ ssl: { rejectUnauthorized: false } });
  } else {
    if (!globalThis.__postgresSqlClient) {
      globalThis.__postgresSqlClient = postgres();
    }
    sql = globalThis.__postgresSqlClient;
  }

  return sql;
}

// Connect to PostgreSQL
const sql = connectOneTimeToDatabase();

// Perform a first query
export async function getUsers() {
  const users = await sql<User[]>`
    SELECT
      id,
      first_name,
      last_name,
      username
    FROM
      users
  `;
  return users.map((user) => camelcaseKeys(user));
}

// Secure version of getUsers which
// allows ANY authenticated user
// to view ALL users
export async function getUsersIfValidSessionToken(token?: string) {
  // Security: Return "Access denied" error if falsy token passed
  if (!token) {
    const errors: ApplicationError[] = [{ message: 'Access denied' }];
    return errors;
  }

  const session = await getValidSessionByToken(token);

  // Security: Return "Access denied" token does not
  // match valid session
  if (!session) {
    const errors: ApplicationError[] = [{ message: 'Access denied' }];
    return errors;
  }

  // Security: Now this query has been protected
  // and it will only run in case the user has a
  // token corresponding to a valid session
  const users = await sql<User[]>`
    SELECT
      id,
      first_name,
      last_name,
      username
    FROM
      users
  `;

  return users.map((user) => camelcaseKeys(user));
}

export async function getUserById(id?: number) {
  // Return undefined if userId is not parseable
  // to an integer
  if (!id) return undefined;

  const users = await sql<[User]>`
    SELECT
      id,
      first_name,
      last_name,
      username
    FROM
      users
    WHERE
      id = ${id}
  `;
  return users.map((user) => camelcaseKeys(user))[0];
}

export async function getUserByUsernameAndToken(
  username?: string,
  token?: string,
) {
  // Security: If the user is not logged in, we do not allow
  // access and return an error from the database function
  if (!token) {
    const errors: ApplicationError[] = [{ message: 'Access denied' }];
    return errors;
  }

  // Return undefined if username is falsy
  // (for example, an undefined or '' value for the username)
  if (!username) return undefined;

  // Security: Retrieve user via the session token
  const userFromSession = await getUserByValidSessionToken(token);

  // If there is either:
  // - no valid session matching the token
  // - no user matching the valid session
  // ...return undefined
  if (!userFromSession) return undefined;

  // Retrieve all matching users from database
  const users = await sql<[User | undefined]>`
    SELECT
      id,
      first_name,
      last_name,
      username
    FROM
      users
    WHERE
      username = ${username}
  `;

  // If we have no user, then return undefined
  const user = users[0];
  if (!user) return undefined;

  // Security: Match ids of session user with user
  // corresponding to requested username
  if (user.id !== userFromSession.id) {
    const errors: ApplicationError[] = [{ message: 'Access denied' }];
    return errors;
  }

  return camelcaseKeys(user);
}

export async function updateUserByUsername(
  username: string | undefined,
  favorites: string,
) {
  if (!username) return undefined;

  const users = await sql<[User]>`
  UPDATE
    users
  SET
    favorites = ${favorites}
  WHERE
    username = ${username}
  `;
  return users.map((user) => camelcaseKeys(user))[0];
}

export async function getUserWithPasswordHashByUsername(username?: string) {
  // Return undefined if username is falsy
  if (!username) return undefined;

  const users = await sql<[UserWithPasswordHash]>`
    SELECT
      *
    FROM
      users
    WHERE
      username = ${username}
  `;
  return users.map((user) => camelcaseKeys(user))[0];
}

export async function insertUser(
  firstName: string,
  lastName: string,
  username: string,
  email: string,
  passwordHash: string,
  favorites: string,
) {
  const users = await sql<[User]>`
    INSERT INTO users
      (first_name, last_name, username, email, password_hash, favorites)
    VALUES
      (${firstName}, ${lastName}, ${username}, ${email}, ${passwordHash}, ${favorites})
    RETURNING
      id,
      first_name,
      last_name,
      username
  `;
  return users.map((user) => camelcaseKeys(user))[0];
}

export async function updateUserById(
  userId: number | undefined,
  firstName: string,
  lastName: string,
  favorites: string,
) {
  if (!userId) return undefined;

  const users = await sql<[User]>`
    UPDATE
      users
    SET
      first_name = ${firstName},
      last_name = ${lastName},
      favorites = ${favorites}
    WHERE
      id = ${userId}
    RETURNING
      id,
      first_name,
      last_name,
      username,
      favorites
  `;
  return users.map((user) => camelcaseKeys(user))[0];
}

export async function deleteUserByUsername(username?: string) {
  if (!username) return undefined;

  const users = await sql`
    DELETE FROM
      users
    WHERE
      username = ${username}
    RETURNING
      id,
      first_name,
      last_name,
      username
  `;
  return users.map((user) => camelcaseKeys(user))[0];
}

export async function deleteUserById(id?: number) {
  if (!id) return undefined;

  const users = await sql`
    DELETE FROM
      users
    WHERE
      id = ${id}
    RETURNING
      id,
      first_name,
      last_name,
      username
  `;
  return users.map((user) => camelcaseKeys(user))[0];
}

export async function getValidSessionByToken(token: string) {
  if (!token) return undefined;

  const sessions = await sql<Session[]>`
    SELECT
      *
    FROM
      sessions
    WHERE
      token = ${token} AND
      expiry > NOW()
  `;
  return sessions.map((session) => camelcaseKeys(session))[0];
}

export async function getUserByValidSessionToken(token: string) {
  if (!token) return undefined;

  const session = await getValidSessionByToken(token);

  if (!session) return undefined;

  return await getUserById(session.userId);
}

export async function insertSession(token: string, userId: number) {
  const sessions = await sql<Session[]>`
    INSERT INTO sessions
      (token, user_id)
    VALUES
      (${token}, ${userId})
    RETURNING *
  `;
  return sessions.map((session) => camelcaseKeys(session))[0];
}

export async function insertFiveMinuteSessionWithoutUserId(token: string) {
  const sessions = await sql<Session[]>`
    INSERT INTO sessions
      (token, expiry)
    VALUES
      (${token}, NOW() + INTERVAL '5 minutes')
    RETURNING *
  `;
  return sessions.map((session) => camelcaseKeys(session))[0];
}

export async function deleteExpiredSessions() {
  const sessions = await sql<Session[]>`
    DELETE FROM
      sessions
    WHERE
      expiry < NOW()
    RETURNING *
  `;
  return sessions.map((session) => camelcaseKeys(session));
}

export async function deleteSessionByToken(token: string) {
  const sessions = await sql<Session[]>`
    DELETE FROM
      sessions
    WHERE
      token = ${token}
    RETURNING *
  `;
  return sessions.map((session) => camelcaseKeys(session))[0];
}

export async function insertPlace(
  addressInt: string,
  city: string,
  sportType: string,
  spotDescription: string,
  coordinates: string,
  usernameOwner: string,
  userRating: string,
) {
  const mapinfo = await sql<[Info]>`
    INSERT INTO mapinfo
      (address_int, city, sport_type, spot_description, coordinates, username_owner, user_rating)
    VALUES
      (${addressInt}, ${city}, ${sportType}, ${spotDescription}, ${coordinates}, ${usernameOwner}, ${userRating})
    RETURNING
      id,
      address_int,
      city,
      sport_type
  `;
  return mapinfo.map((info) => camelcaseKeys(info))[0];
}

export async function getInfo() {
  const res = await sql`SELECT * FROM mapinfo`;
  return res.map((prod) => {
    return camelcaseKeys(prod);
  });
}

export async function updateInfoById(
  infoId: number | undefined,
  addressInt: string,
  city: string,
  sportType: string,
  spotDescription: string,
  userRating: string,
) {
  if (!infoId) return undefined;

  const mapinfo = await sql<[Info]>`
    UPDATE
      mapinfo
    SET
      address_int = ${addressInt},
      city = ${city},
      sport_type = ${sportType},
      spot_description = ${spotDescription},
      user_rating = ${userRating}
    WHERE
      id = ${infoId}
    RETURNING
      id,
      address_int,
      city,
      sport_type,
      spot_description,
      user_rating
  `;
  return mapinfo.map((info) => camelcaseKeys(info))[0];
}

export async function deleteInfoByUsername(username?: string) {
  if (!username) return undefined;

  const mapinfo = await sql`
    DELETE FROM
      mapinfo
    WHERE
      username_owner = ${username}
    RETURNING
      id,
      address_int,
      spot_description,
      sport_type
  `;
  return mapinfo.map((info) => camelcaseKeys(info))[0];
}

export async function deleteInfoById(id?: number) {
  if (!id) return undefined;

  const mapinfo = await sql`
    DELETE FROM
      mapinfo
    WHERE
      id = ${id}
    RETURNING
      id,
      address_int,
      spot_description,
      sport_type
  `;
  return mapinfo.map((info) => camelcaseKeys(info))[0];
}

export async function getInfoById(id?: number) {
  // Return undefined if userId is not parseable
  // to an integer
  if (!id) return undefined;

  const mapinfo = await sql<[Info]>`
    SELECT
      id,
      address_int,
      city,
      sport_type,
      spot_description,
      coordinates
    FROM
      mapinfo
    WHERE
      id = ${id}
  `;
  return mapinfo.map((info) => camelcaseKeys(info))[0];
}

export async function getInfoByUsername(username: string) {
  if (!username) {
    return undefined;
  }

  const mapinfo = await sql<[Info]>`
  SELECT
    id,
    address_int,
    city,
    sport_type,
    spot_description,
    coordinates,
    user_rating
  FROM
    mapinfo
  WHERE
    username_owner = ${username}
`;
  return mapinfo.map((info) => camelcaseKeys(info));
}

export async function getInfoBySportType(sportType?: string) {
  // Return undefined if userId is not parseable
  // to an integer
  if (!sportType) {
    const res = await sql`SELECT * FROM mapinfo`;
    return res.map((prod) => {
      return camelcaseKeys(prod);
    });
  }

  const mapinfo = await sql<[Info]>`
    SELECT
      id,
      address_int,
      city,
      sport_type,
      spot_description
    FROM
      mapinfo
    WHERE
      sport_type = ${sportType}
  `;
  return mapinfo.map((info) => camelcaseKeys(info))[0];
}

export async function getFavoritesByUsername(username: string | undefined) {
  if (!username) {
    return undefined;
  }

  const users = await sql<[User]>`
    SELECT
      favorites
    FROM
      users
    WHERE
      username = ${username}
  `;
  return users.map((user) => camelcaseKeys(user))[0];
}

export async function getFavoritesAndUsername() {
  const users = await sql<[User]>`
    SELECT
      favorites,
      username
    FROM
      users
  `;
  return users.map((user) => camelcaseKeys(user));
}

/* export async function insertFavorite(id: number, username: string, spots: string) {
  const spotfavorite = await sql<[Favorite]>`
    INSERT INTO spotfavorite
      (id, username, spots)
    VALUES
      (${id}, ${username}, ${spots})
    RETURNING
      id,
      username,
      spots
  `;
  return spotfavorite.map((favorite) => camelcaseKeys(favorite))[0];
}

export async function getFavorite() {
  const res = await sql`SELECT * FROM spotfavorite`;
  return res.map((favorite) => {
    return camelcaseKeys(favorite);
  });
}

export async function updateRatingById(
  ratingId: string | undefined,
  userRating: string,
) {
  if (!ratingId) return undefined;

  const spotrating = await sql<[Rating]>`
    UPDATE
      spotrating
    SET
      user_rating = ${userRating}
    WHERE
      id = ${ratingId}
    RETURNING
      id,
      user_rating
  `;
  return spotrating.map((rating) => camelcaseKeys(rating))[0];
}

export async function deleteRatingById(id?: string) {
  if (!id) return undefined;

  const spotrating = await sql`
    DELETE FROM
      spotrating
    WHERE
      id = ${id}
    RETURNING
      id,
      user_rating
  `;
  return spotrating.map((rating) => camelcaseKeys(rating))[0];
}

export async function getRatingById(id?: string) {
  // Return undefined if userId is not parseable
  // to an integer
  if (!id) return undefined;

  const spotrating = await sql<[Info]>`
    SELECT
      id,
      user_rating
    FROM
      spotrating
    WHERE
      id = ${id}
  `;
  return spotrating.map((rating) => camelcaseKeys(rating))[0];
}
*/
