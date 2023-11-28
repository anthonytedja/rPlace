import { Request, Response } from 'express'
import path from 'path'

import { DevCache } from '../api/cache/impl/dev-cache'
import { Board } from '../domain/board'
import { SocketServer } from '../socket/socket-server'

// create socket with new board
var board = new Board()
new SocketServer(new DevCache(), board)

// Static content
var express = require('express')

var app = express()

// static_files has all of statically returned content
// https://expressjs.com/en/starter/static-files.html
const publicPath = path.resolve(__dirname, '../../')
app.use('/', express.static(publicPath)) // this directory has files to be returned

// send the entire board in a bitmap representation
app.get('/api/board-bitmap', (req: Request, res: Response) => {
  console.log('sending board')
  const buffer = board.getData()
  res.send(Buffer.from(buffer))
})

app.listen(8080, function () {
  console.log('Example app listening on port 8080!')
})
