require('dotenv').config()
const express = require('express')
const cors = require("cors");
const router = require("./router");
require('./telegram/index').launchBot()

const app = express()

const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(cors({
  origin: process.env.CLIENT_URL
}))
app.use('/api', router)

app.listen(PORT, () => console.log('Server start on PORT: ' + PORT))

