import { Database } from '../api/database/database'

export class UserHandler {
  static rateLimit: number = 30000

  constructor(private database: Database) {}

  /**
   * @returns true if the user can update the board (last update was > 5 minutes ago)
   */
  async canUpdate(userIP: string) {
    console.log("checking if", userIP, "can update")
    const lastTimestamp = await this.database.getUserActionTimestamp(userIP)
    if (lastTimestamp === null) return true
    const now = new Date()
    const timeDiff = now.getTime() - lastTimestamp.getTime()
    console.log(`timeDiff: ${timeDiff}`)
    // 5 minutes
    if (timeDiff <= UserHandler.rateLimit) {
      // throw new Error(`Too soon for user IP ${userIP}: ${timeDiff} should be > 300000`)
      return false
    }
    return true
  }
}
