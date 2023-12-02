import WebSocket from 'ws'

import { SocketServer } from './socket-server'

export class Connection {
  constructor(public websocket: WebSocket, public socketServer: SocketServer) {
    console.log('connection init')
    this.setBindings()
  }

  isAlive: boolean = true

  async setBindings() {
    //setInterval(checkPing(this), 30000)
    this.websocket.on('message', await onMessage(this))
    this.websocket.on('pong', onPong(this))
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

async function onMessage(c: Connection) {
  return async (message: string) => {
    console.log('raw message:', message)

    var data = JSON.parse(message)
    const [x, y, colorIdx] = [data.x, data.y, data.color]
    if (x == undefined || y == undefined || colorIdx == undefined) {
      console.log(`garbage data from connection: ${message}`)
    }
    console.log('message: ', x, y, colorIdx)

    if (c.socketServer.board.isValidSet(x, y, colorIdx)) {
      console.log('valid set')

      const canUpdate = await c.socketServer.userHandler.canUpdate()
      if (!canUpdate) {
        console.log('too soon')
        return
      }

      c.socketServer.broadcast(message)
      await c.socketServer.cache.set(x, y, colorIdx)
      await c.socketServer.board.setPixel(x, y, colorIdx)
    } else {
      console.log('invalid set')
    }
  }
}

function onPong(c: Connection) {
  return () => (c.isAlive = true)
}
