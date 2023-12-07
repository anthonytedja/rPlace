import WebSocket from 'ws'

import { SocketServer } from './socket-server'

export class Connection {
  constructor(
    public remoteAddress: string,
    public websocket: WebSocket,
    public socketServer: SocketServer
  ) {
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

    let data = JSON.parse(message)
    data["user"] = c.remoteAddress
    await c.socketServer.broadcastChannel.publishContent(data)
  }
}

function onPong(c: Connection) {
  return () => (c.isAlive = true)
}
