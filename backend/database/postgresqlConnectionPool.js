const Pool = require('pg').Pool

//connection pool for postgreSQL server
const pool = new Pool({
    user: 'pratham',
    host: 'licenselead-cluster.cluster-cx0yf6slsfge.us-west-2.rds.amazonaws.com',
    database: 'postgres',
    password: 'pratham',
    port: 5432,
  })

  module.exports = pool;