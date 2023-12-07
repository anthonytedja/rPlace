import path from 'path'
import { DevCache } from '../api/cache/impl/dev-cache'
import { DevDatabase } from '../api/database/impl/dev-database'
import { DevBroadcastChannel } from '../api/broadcast-channel/impl/dev-channel'
import { AWSCache } from '../api/cache/impl/aws-cache'
import { AWSDatabase } from '../api/database/impl/aws-database'
import { AWSBroadcastChannel } from '../api/broadcast-channel/impl/aws-channel'
import { SocketServer } from '../socket/socket-server'
import { Request, Response } from 'express'

//const database = new DevDatabase()
//const cache = new DevCache()
// const broadcastChannel = new DevBroadcastChannel()
const database = new AWSDatabase()
const cache = new AWSCache()
const broadcastChannel = new AWSBroadcastChannel()
const ss = new SocketServer(database, cache, broadcastChannel)

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

    app.listen(8080, function () {
      console.log('Listening on port 8080!')
    })
  })
  .catch((err) => err.stack)
