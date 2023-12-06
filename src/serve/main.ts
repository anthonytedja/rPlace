import path from 'path'
import { DevCache } from '../api/cache/impl/dev-cache'
import { DevDatabase } from '../api/database/impl/dev-database'
import { AWSCache } from '../api/cache/impl/aws-cache'
import { AWSDatabase } from '../api/database/impl/aws-database'
import { SocketServer } from '../socket/socket-server'
import { Request, Response } from 'express'

const database = new DevDatabase()
const cache = new DevCache()
const ss = new SocketServer(database, cache)

ss.setup()
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
