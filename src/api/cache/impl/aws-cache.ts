import { createClient as redisCreateClient } from 'redis'

import { Board } from '../../../domain/board'
import { Cache } from '../cache'

export class AWSCache implements Cache {
  client = this.createClient()

  async createClient() {
    const client = redisCreateClient({
      url: 'redis://someclustername.fxt3pv.ng.0001.use1.cache.amazonaws.com:6379',
    })
    client.on('error', (err: string) => console.log('REDIS CLIENT ERROR', err))
    await client.connect()
    return client
  }

  // should only be ran once at the start, and with data from cassandra
  async setBoard(board: Board): Promise<any> {
    const boardEncoding = new TextDecoder().decode(board.getData())
    return this.client.then((cli) => cli.set('place_board', boardEncoding))
  }

  async set(xPos: number, yPos: number, colorIdx: number): Promise<void> {
    return this.client.then((cli) =>
      cli.sendCommand([
        'BITFIELD',
        'place_board',
        'SET',
        'u4',
        `#${yPos * Board.size + xPos}`,
        `${colorIdx}`,
      ])
    )
  }

  async getBoard(): Promise<Board> {
    const data: string = (await this.client.then((cli) => cli.get('place_board'))) || ''
    return Promise.resolve(new Board(new Uint8ClampedArray(new TextEncoder().encode(data))))
  }

  async subscribe(
    channel: string,
    callback: (channel: string, message: string) => void
  ): Promise<void> {
    this.client.then((cli) => cli.subscribe(channel, callback))
  }

  async publish(channel: string, message: string): Promise<number> {
    return this.client.then((cli) => cli.publish(channel, message))
  }
}
