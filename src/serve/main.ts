import path from 'path'
import { Database } from '../api/database'
import { Cache } from '../api/cache'
import { BroadcastChannel } from '../api/broadcast-channel'
import { SocketServer } from '../socket/socket-server'
import { Request, Response } from 'express'

console.log(process.env)

const ss = new SocketServer(new Database(), new Cache(), new BroadcastChannel())

ss.setup()
  .then(() => ss.establishBroadcastChannel())
  .then(() => {
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

    // return the server IP
    app.get('/api/get-server', async (req: Request, res: Response) => {
      // TODO: get actual IP of EC2 instance
      res.send('18.232.68.248')
    })

    app.listen(8080, function () {
      console.log('Listening on port 8080!')
    })
  })
  .catch((err) => err.stack)
