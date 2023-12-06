import { Database } from '../api/database/database'
import { Cache } from '../api/cache/cache'
import { Board } from '../domain/board'
import { Connection } from './connection'
import { UserHandler } from '../domain/user-handler'

import { createClient, RedisClientType } from 'redis'

import { createServer, Server as HttpServer } from 'http'
import { Server as IoServer } from 'socket.io'
import { createShardedAdapter } from '@socket.io/redis-adapter'

export class SocketServer {
  database: Database
  cache: Cache
  board: Board = new Board()
  userHandler: UserHandler
  private publisher: RedisClientType
  private subscriber: RedisClientType

  private httpServer: HttpServer
  private io: IoServer

  async setup(): Promise<void> {
    console.log('setting up socket server')
    const data = await this.database.getAndFormatBoard()
    this.board = new Board(data)
    await this.cache.setBoard(this.board)
    await Promise.all([this.publisher.connect(), this.subscriber.connect()]).then(() => {
      console.log('redis connected')
      this.io.adapter(createShardedAdapter(this.publisher, this.subscriber))
      this.io.on('connection', (socket) => {
        const remoteAddress = socket.handshake.address || 'unknown'
        console.log(`connection from ${remoteAddress}`)
        new Connection(this, remoteAddress)

        socket.on('unsubscribe', (channel) => {
          console.log('unsubscribing from channel', channel)
          socket.leave(channel)
        })

        socket.on('send', (channel, message) => {
          console.log('sending message', message, 'to channel', channel)
          this.io.to(channel).emit('message', message)
        })
      })
      this.io.listen(8081)
    })

    console.log('socket server setup complete')
  }

  constructor(database: Database, cache: Cache) {
    this.httpServer = createServer()
    this.io = new IoServer(this.httpServer)

    this.database = database
    this.cache = cache
    this.userHandler = new UserHandler(this.database)

    this.publisher = createClient({ url: 'redis://redis:6379' })
    this.subscriber = this.publisher.duplicate()
    console.log('created socket object')
  }

  async getBoard(): Promise<Board> {
    console.log('getting board')
    return this.cache.getBoard()
  }
}
