import { Database } from '../api/database/database'

export class UserHandler {
  static rateLimit: number = 30000

  private database: Database

  constructor(database: Database) {
    this.database = database
  }

  // TODO: Delete when better ip checking is implemented
  static async getIP() {
    return fetch('https://www.cloudflare.com/cdn-cgi/trace').then(async (response) => {
      const data = await response.text()
      const lines = data.split('\n')
      const ipLine = lines.find((line) => line.startsWith('ip='))
      return ipLine ? ipLine.split('=')[1] : 'unknown'
    })
  }

	/**
   * @returns true if the user can update the board (last update was > 5 minutes ago)
   */
	async canUpdate() {
		const userIP = await UserHandler.getIP()
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