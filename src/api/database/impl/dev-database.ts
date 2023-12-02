import { Database } from '../database'

export class DevDatabase implements Database {
  client = this.createClient()

  async createClient() {
    const cassandra = require('cassandra-driver')
    const fs = require('fs')
    const auth = new cassandra.auth.PlainTextAuthProvider(
      'CassandraUser-at-320298637304',
      'HaSMaR+okWD89RmTx+bZqcVnxAzXAD8z0Hox7JCm3Nk='
    )
    const sslOptions1 = {
      ca: [fs.readFileSync('sf-class2-root.crt', 'utf-8')],
      host: 'cassandra.us-east-1.amazonaws.com',
      rejectUnauthorized: true,
    }

    const client = new cassandra.Client({
      contactPoints: ['cassandra.us-east-1.amazonaws.com'],
      localDataCenter: 'us-east-1',
      authProvider: auth,
      sslOptions: sslOptions1,
      protocolOptions: { port: 9142 },
      keyspace: 'r_place',
    })
    await client.connect()
    return client
  }

  async getAndFormatBoard(): Promise<Uint8ClampedArray> {
    const query = 'SELECT * FROM r_place.color_mappings'
    const client = await this.client
    const result = await client.execute(query)

    const data = new ArrayBuffer(Math.floor((250 * 250) / 2))
    const dataArray = new Uint8ClampedArray(data)

    result.rows.forEach((row: any) => {
      const idx = row.x * 250 + row.y
      const arrayIdx = Math.floor(idx / 2)
      const shift = (idx % 2) * 4
      const mask = 15 << shift
      dataArray[arrayIdx] = (dataArray[arrayIdx] & ~mask) | ((row.color & 15) << shift)
    })

    return dataArray
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
    const query = 'SELECT timestamp FROM r_place.timestamps WHERE userIP = ? LIMIT 1'
    const client = await this.client
    const result = await client.execute(query, [userIP], { prepare: true })
    return result.rows.length > 0 ? result.rows[0].timestamp : null
  }
}

/*
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

  private formatBoardData(board: number[][]): Uint8ClampedArray {
    const data = new ArrayBuffer(Math.floor((250 * 250) / 2))
    const dataArray = new Uint8ClampedArray(data)

    for (let i = 0; i < 250; i++) {
      for (let j = 0; j < 250; j++) {
        const idx = i * 250 + j
        const arrayIdx = Math.floor(idx / 2)
        const colorIdx = board[i][j]
        dataArray[arrayIdx] =
          (dataArray[arrayIdx] & (idx % 2 === 0 ? 15 : 240)) | (colorIdx << ((idx % 2) * 4))
      }
    }

    return dataArray
  }
*/
