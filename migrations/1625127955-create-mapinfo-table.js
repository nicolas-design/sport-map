exports.up = async function up(sql) {
  await sql`
    CREATE TABLE mapinfo (
      id integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
			address_int varchar(100) NOT NULL,
      city varchar(40) NOT NULL,
			sport_type varchar(40) NOT NULL,
			spot_description varchar(600) NOT NULL,
			coordinates varchar(60) NOT NULL
    )
  `;
};

exports.down = async function down(sql) {
  await sql`
    DROP TABLE mapinfo
  `;
};
