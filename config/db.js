const Pool = require('pg').Pool;

const pool = new Pool({
  user: 'postgres',
  password: 'Qwerty123',
  database: 'test',
  host: 'localhost',
  port: 5432,
});

module.exports = pool;
// const pool = new Pool({
//   user: 'postgres',
//   password: 'Qwerty123',
//   database: 'test',
//   host: 'localhost',
//   port: 5432,
// });
