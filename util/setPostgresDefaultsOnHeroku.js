module.exports = function setPostgresDefaultsOnHeroku() {
  if (process.env.DATABASE_URL) {
    const { parse } = require('pg-connection-string');

    // Extract the connection information from the Heroku environment variable
    const { baseurl, host, database, user, password, salt } = parse(
      process.env.DATABASE_URL,
    );

    // Set standard environment variables
    process.env.API_BASE_URL = baseurl;
    process.env.PGHOST = host;
    process.env.PGDATABASE = database;
    process.env.PGUSERNAME = user;
    process.env.PGPASSWORD = password;
    process.env.CSRF_SECRET_SALT = salt;
  }
};
