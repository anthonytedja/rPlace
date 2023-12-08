import { IDatabase } from '../types'

export class UserHandler {
  static rateLimit: number = process.env.NODE_ENV === 'development' ? 0 : 300000

  constructor(private database: IDatabase) {}

  /**
   * @returns true if the user can update the board (last update was > 5 minutes ago)
   */
  async canUpdate(userIP: string) {
    console.log('Checking rate limit for', userIP)
    const lastTimestamp = await this.database.getUserActionTimestamp(userIP)
    if (lastTimestamp === null) return true
    const now = new Date()
    const timeDiff = now.getTime() - lastTimestamp.getTime()

    const minutes = Math.floor(timeDiff / 60000)
    const seconds = ((timeDiff % 60000) / 1000).toFixed(0)

    console.log(`Time diff for ${userIP}: ${minutes} minutes & ${seconds} seconds`)
    return timeDiff > UserHandler.rateLimit
  }
}
