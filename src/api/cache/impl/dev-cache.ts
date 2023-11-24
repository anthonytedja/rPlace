import { createClient as redisCreateClient } from 'redis'
import { Color } from '../../../domain/color'
import { Cache } from '../cache'

export class DevCache implements Cache {
  constructor() {
    await createClient()
  }

  async createClient() {
    await redisCreateClient()
      .on('error', (err) => console.log('REDIS CLIENT ERROR', err))
      .connect()
      .then()
  }

  set(xPos: number, yPos: number, color: Color): void {
    // do some redis shit with docker compose
  }
}
