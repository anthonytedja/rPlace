import { RedisClientType, createClient as redisCreateClient } from 'redis'
import { Color } from '../../../domain/color'
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

  async set(xPos: number, yPos: number, color: Color): Promise<void> {
    return this.client.then((cli) =>
      cli.sendCommand([
        'BITFIELD',
        'place_board',
        'SET',
        'u4',
        `#${yPos * Board.size + xPos}`,
        color.encode,
      ])
    )
  }

  async getBoard(): Promise<Board> {
    const data: string = (await this.client.then((cli) => cli.get('place_board'))) || ''
    console.log(data)
    return new Board()
  }
}
