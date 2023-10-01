require('dotenv').config()
require('events').EventEmitter.prototype._maxListeners = 100;
const express = require('express')
const upload = require('express-fileupload')
const cors = require("cors");
const https = require('https');
const fs = require('fs');
const router = require("./router");
require('./telegram/index').launchBot()

const app = express()

const PORT = process.env.PORT || 5000

const options = {
  cert: fs.readFileSync(__dirname + `/${process.env.PATH_TO_CERT}`),
  key: fs.readFileSync(__dirname + `/${process.env.PATH_TO_KEY}`)
};

app.use(express.json())
app.use(upload({
  createParentPath: true
}))
app.use(cors({
  origin: process.env.CLIENT_URL
}))
app.use('/api', router)
app.use('/client/public', express.static('./client/public'))

const server = https.createServer(options, app);

server.listen(PORT, function(){
  console.log('Server start on PORT: ' + PORT)
});






