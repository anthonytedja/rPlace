import WebSocket from 'ws'

import { Database } from '../api/database/database'
import { Cache } from '../api/cache/cache'
import { Board } from '../domain/board'

import { Connection } from './connection'
import { UserHandler } from '../domain/user-handler'

export class SocketServer {
  wss: WebSocket.Server
  database: Database
  cache: Cache
  board: Board = new Board()
  userHandler: UserHandler

  async setup(): Promise<void> {
    const data = await this.database.getAndFormatBoard()
    this.board = new Board(data)
    return this.cache.setBoard(this.board)
  }

  constructor(database: Database, cache: Cache) {
    this.wss = new WebSocket.Server({ port: 8081 })
    this.database = database
    this.cache = cache
    this.userHandler = new UserHandler(this.database)
    this.setBindings()
    //this.setupPubSub()
  }

  // setupPubSub() {
  //   this.cache.subscribe('websocket-broadcast', (channel, message) => {
  //     if (channel === 'websocket-broadcast') {
  //       console.log('broadcasting', message)
  //       this.broadcast(message)
  //     }
  //   })
  // }

  async getBoard(): Promise<Board> {
    return this.cache.getBoard()
  }

  private setBindings() {
    this.wss.on('close', onClose(this))
    this.wss.on('connection', onConnection(this))
  }

  broadcast(data: string) {
    this.wss.clients.forEach((client) => {
      if (client.readyState == WebSocket.OPEN) {
        client.send(data)
      }
    })
    //this.cache.publish('websocket-broadcast', data)
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function onClose(wss: SocketServer) {
  return () => console.log('disconnected')
}

function onConnection(wss: SocketServer) {
  return (webSocket: WebSocket, request: any) => {
    const remoteAddress = request.socket.remoteAddress || 'unknown'
    console.log(`connection from ${remoteAddress}`)
    new Connection(remoteAddress, webSocket, wss)
  }
}
