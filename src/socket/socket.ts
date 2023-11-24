import WebSocket from 'ws'
import { Board } from '../domain/board'

class Connection {
  constructor(
    private websocket: WebSocket,
    private board: Board,
    private socketServer: SocketServer
  ) {
    this.setBindings()
    this.sendInitialBoard()
  }

  isAlive: boolean = true

  setBindings() {
    this.websocket.on('pong', this.onPong)
    setInterval(this.checkPing, 30000)
  }

  sendInitialBoard() {
    this.websocket.send(this.board.toString())
  }

  onPong() {
    this.isAlive = true
  }

  onMessage(message: string) {
    var data = JSON.parse(message)
    const [x, y, hex] = [data.x, data.y, data.hex]
    if (x == undefined || y == undefined || hex == undefined) {
      console.log(`garbage data from connection: ${message}`)
    }

    if (this.board.isValidSet(x, y, hex)) {
      this.socketServer.broadcast(message)
      this.board.set(x, y, hex)
    }
  }

  checkPing() {
    if (!this.isAlive) {
      this.websocket.terminate()
    }

    this.isAlive = false
    this.websocket.ping()
  }
}

export class SocketServer {
  wss: WebSocket.Server

  constructor(private board: Board) {
    this.wss = new WebSocket.Server({ port: 8081 })
    this.setBindings()
  }

  private setBindings() {
    this.wss.on('close', this.onClose)
  }

  onClose() {
    console.log('disconnected')
  }

  broadcast(data: string) {
    this.wss.clients.forEach((client) => {
      if (client.readyState == WebSocket.OPEN) {
        client.send(data)
      }
    })
  }

  onConnection(webSocket: WebSocket) {
    new Connection(webSocket, this.board, this)
  }
}
