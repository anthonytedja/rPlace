import WebSocket from 'ws'
import { Board } from '../domain/board'
import { Cache } from '../api/cache/cache'
import { Connection } from './connection'

export class SocketServer {
  wss: WebSocket.Server

  constructor(public cache: Cache, public board: Board) {
    this.wss = new WebSocket.Server({ port: 8081 })
    this.setBindings()
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

function onClose(ss: SocketServer) {
  return () => console.log('disconnected')
}

function onConnection(ss: SocketServer) {
  return (webSocket: WebSocket) => {
    new Connection(webSocket, ss)
  }
}
