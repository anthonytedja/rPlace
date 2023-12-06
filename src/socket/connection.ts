import { io, Socket } from 'socket.io-client'
import { SocketServer } from './socket-server'

export class Connection {
  socket: Socket
  server: SocketServer
  remoteAddress: string

  constructor(server: SocketServer, remoteAddress: string) {
    console.log('new connection')
    this.server = server
    this.remoteAddress = remoteAddress
    this.socket = io()
    this.socket.on('connect', () => {
      this.socket.emit('subscribe', 'board')

      this.socket.on('message', async (message) => {
        console.log('Received message: ', message)

        var data = JSON.parse(message)
        const { x, y, color: colorIdx } = data
        if (x === undefined || y === undefined || colorIdx === undefined) {
          console.log(`garbage data from connection: ${message}`)
        }
        console.log('message: ', x, y, colorIdx)

        if (this.server.board.isValidSet(x, y, colorIdx)) {
          console.log('valid set')

          const canUpdate = await this.server.userHandler.canUpdate(this.remoteAddress)
          if (!canUpdate) {
            console.log('too soon')
            return
          }

          await server.cache.set(x, y, colorIdx)
          await server.board.setPixel(x, y, colorIdx, this.remoteAddress)
          this.socket.emit('send', 'board', message)
        } else {
          console.log('invalid set')
        }
      })
    })
  }
}
