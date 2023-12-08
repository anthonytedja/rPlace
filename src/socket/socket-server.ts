import WebSocket from 'ws'

import { IDatabase } from '../types'
import { ICache } from '../types'
import { IBroadcastChannel } from '../types'
import { Board } from '../domain/board'

import { Connection } from './connection'
import { UserHandler } from '../domain/user-handler'

export class SocketServer {
  wss: WebSocket.Server
  database: IDatabase
  cache: ICache
  board: Board = new Board()
  userHandler: UserHandler
  broadcastChannel: IBroadcastChannel

  async setup(): Promise<void> {
    const data = await this.database.getAndFormatBoard()
    this.board = new Board(data)
    return this.cache.setBoard(this.board)
  }

  async establishBroadcastChannel(): Promise<any> {
    return new Promise<void>(async (resolve, {}) => {
      await this.broadcastChannel.init()
      await this.broadcastChannel.subscribeToChannel(this.handleUpdateFromClient.bind(this))
      resolve()
    })
  }

  constructor(database: IDatabase, cache: ICache, broadcastChannel: IBroadcastChannel) {
    this.wss = new WebSocket.Server({ port: 8081 })
    this.database = database
    this.cache = cache
    this.userHandler = new UserHandler(this.database)
    this.broadcastChannel = broadcastChannel
    this.setBindings()
  }

  async handleUpdateFromClient(message: any, channel: any) {
    console.log(message, channel)

    var data = JSON.parse(message)
    const [x, y, colorIdx, user] = [data.x, data.y, data.color, data.user]
    if (x == undefined || y == undefined || colorIdx == undefined || user == undefined) {
      console.log(`garbage data from connection: ${message}`)
    }
    console.log('message: ', x, y, colorIdx, user)

    if (this.board.isValidSet(x, y, colorIdx)) {
      console.log('valid set')

      const canUpdate = await this.userHandler.canUpdate(user)
      if (!canUpdate) {
        console.log('too soon')
        return
      }

      this.broadcast(message)
      await this.cache.set(x, y, colorIdx)
      await this.board.setPixel(x, y, colorIdx)
      await this.database.set(x, y, colorIdx)
      await this.database.setUserActionTimestamp(user)
    } else {
      console.log('invalid set')
    }
  }

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
