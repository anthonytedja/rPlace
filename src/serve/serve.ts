import { Board } from '../domain/board'
import { SocketServer, onClose } from '../socket/socket'

// create socket
new SocketServer(new Board())

// Static content
var express = require('express')
var app = express()

// static_files has all of statically returned content
// https://expressjs.com/en/starter/static-files.html
app.use('/', express.static('static_files')) // this directory has files to be returned

app.listen(8080, function () {
  console.log('Example app listening on port 8080!')
})
