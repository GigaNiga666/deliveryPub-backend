const mysql = require('mysql2')

const pool = mysql.createPool({
  user: String(process.env.DB_USER),
  password: String(process.env.DB_PASSWORD),
  host: String(process.env.DB_HOST),
  port: Number(process.env.DB_PORT),
  database: String(process.env.DB_DATABASE),
  ssl : true
})

module.exports = pool