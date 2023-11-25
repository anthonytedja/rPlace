import path from 'path';
import { SocketServer } from '../socket/socket-server'
import { Board } from '../domain/board'
import { DevCache } from '../api/cache/impl/dev-cache';

// create socket with new board
new SocketServer(new DevCache(), new Board())

// Static content
var express = require('express')
var app = express()

// static_files has all of statically returned content
// https://expressjs.com/en/starter/static-files.html
const publicPath = path.resolve(__dirname, '../../');
app.use('/', express.static(publicPath)) // this directory has files to be returned

app.listen(8080, function () {
  console.log('Example app listening on port 8080!')
})
