import { Board } from '../domain/board'
import { DevCache } from '../api/cache/impl/dev-cache'
import path from 'path'
import { SocketServer } from '../socket/socket-server'
import { Request, Response } from 'express'

// create socket with new board
const board = new Board() // we want to replace this with a board from cassandra on startup
const ss = new SocketServer(new DevCache(), board)

ss.setup()
  .then(() => {
    // Static content
    var express = require('express')
    var app = express()

    // static_files has all of statically returned content
    // https://expressjs.com/en/starter/static-files.html
    const publicPath = path.resolve(__dirname, '../../')
    app.use('/', express.static(publicPath)) // this directory has files to be returned

    // send the entire board in a bitmap representation
    app.get('/api/board-bitmap', async (req: Request, res: Response) => {
      console.log('sending board')
      const buffer = (await ss.getBoard()).getData()
      res.send(Buffer.from(buffer))
    })

    app.listen(8080, function () {
      console.log('Example app listening on port 8080!')
    })
  })
  .catch((err) => err.stack)
