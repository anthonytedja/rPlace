import WebSocket from 'ws'
import { SocketServer } from './socket-server'

export class Connection {
  constructor(public websocket: WebSocket, public socketServer: SocketServer) {
    this.setBindings()
    this.sendInitialBoard()
  }

  isAlive: boolean = true

  setBindings() {
    setInterval(checkPing(this), 30000)
    this.websocket.on('message', onMessage(this))
    this.websocket.on('pong', onPong(this))
  }

  sendInitialBoard() {
    this.websocket.send(this.socketServer.board?.toString())
  }
}

function checkPing(c: Connection) {
  return () => {
    if (c.websocket.readyState == WebSocket.OPEN) {
      if (!c.isAlive) {
        c.websocket.terminate()
        return
      }

      c.isAlive = false
      c.websocket.ping()
    }
  }
}

function onMessage(c: Connection) {
  return (message: string) => {
    console.log('raw message:', message)
    
    var data = JSON.parse(message)
    const [x, y, hex] = [data.x, data.y, data.hex]
    if (x == undefined || y == undefined || hex == undefined) {
      console.log(`garbage data from connection: ${message}`)
    }
    console.log('message: ', x, y, hex)

    if (c.socketServer.board.isValidSet(x, y, hex)) {
      console.log('valid set')
      c.socketServer.broadcast(message)
      c.socketServer.board.set(x, y, hex)
      c.socketServer.cache.set(x, y, hex)
      c.socketServer.cache.getBoard()
    }

    console.log('invalid set')
  }
}

function onPong(c: Connection) {
  return () => (c.isAlive = true)
}
