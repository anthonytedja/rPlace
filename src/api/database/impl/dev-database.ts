import { Database } from '../database'

export class DevDatabase implements Database {
  client = this.createClient()

  async createClient() {
    const cassandra = require('cassandra-driver')
    const client = new cassandra.Client({
      contactPoints: ['cassandra'],
      localDataCenter: 'datacenter1',
      keyspace: 'r_place',
    })
    await client.connect()
    return client
  }

  async getBoard(): Promise<number[][]> {
    const query = 'SELECT * FROM r_place.color_mappings'
    const client = await this.client
    const result = await client.execute(query)
    console.log(result.rows)
    const board = Array(250)
      .fill(0)
      .map(() => Array(250).fill(0))
    result.rows.forEach((row: any) => {
      board[row.x][row.y] = row.color
    })
    return board
  }

  async set(xPos: number, yPos: number, colorIdx: number) {
    const query =
      'INSERT INTO r_place.color_mappings (x, y, color, timestamp) VALUES (?, ?, ?, toTimestamp(now()))'
    const client = await this.client
    await client.execute(query, [xPos, yPos, colorIdx], {
      prepare: true,
    })
  }

  async setUserActionTimestamp(userIP: string) {
    const query =
      'INSERT INTO r_place.timestamps (userIP, timestamp) VALUES (?, toTimestamp(now()))'
    const client = await this.client
    await client.execute(query, [userIP], {
      prepare: true,
    })
  }

  async getUserActionTimestamp(userIP: string): Promise<Date | null> {
    const query = 'SELECT timestamp FROM r_place.timestamps WHERE userIP = ?'
    const client = await this.client
    const result = await client.execute(query, [userIP], { prepare: true })
    return result.rows[0] ? result.rows[0].timestamp : null
  }
}
