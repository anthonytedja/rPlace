import { RedisClientType, createClient as redisCreateClient } from 'redis'
import { Cache } from '../cache'
import { Board } from '../../../domain/board'

export class DevCache implements Cache {
  client = this.createClient()

  async createClient() {
    const client = redisCreateClient({ url: 'redis://redis:6379' })
    client.on('error', (err: string) => console.log('REDIS CLIENT ERROR', err))
    await client.connect()
    return client
  }

  async set(xPos: number, yPos: number, colorIdx: number): Promise<void> {
    return this.client.then((cli) =>
      cli.sendCommand([
        'BITFIELD',
        'place_board',
        'SET',
        'u4',
        `#${yPos * Board.width + xPos}`,
        `${colorIdx}`,
      ])
    )
  }

  async getBoard(): Promise<Board> {
    const data: string = (await this.client.then((cli) => cli.get('place_board'))) || ''
    console.log(data)
    return new Board()
  }
}
