import { Board } from '../domain/board'
import { BoardDataGrid } from '../domain/board-data-grid'
import { DimensionConvert } from '../domain/dimension-convert'
import { IDatabase } from '../types'

export class Database implements IDatabase {
  client = this.createClient()

  async createClient() {
    const cassandra = require('cassandra-driver')
    const fs = require('fs')

    let clientOptions

    if (process.env.NODE_ENV === 'development') {
      clientOptions = {
        contactPoints: ['cassandra'],
        localDataCenter: 'datacenter1',
        keyspace: 'r_place',
      }
    } else {
      const auth = new cassandra.auth.PlainTextAuthProvider(
        'CassandraUser-at-320298637304',
        'HaSMaR+okWD89RmTx+bZqcVnxAzXAD8z0Hox7JCm3Nk='
      )
      const sslOptions1 = {
        ca: [fs.readFileSync('sf-class2-root.crt', 'utf-8')],
        host: 'cassandra.us-east-1.amazonaws.com',
        rejectUnauthorized: true,
      }

      clientOptions = {
        contactPoints: ['cassandra.us-east-1.amazonaws.com'],
        localDataCenter: 'us-east-1',
        authProvider: auth,
        sslOptions: sslOptions1,
        protocolOptions: { port: 9142 },
        keyspace: 'r_place',
      }
    }

    const client = new cassandra.Client(clientOptions)
    await client.connect()
    return client
  }

  async getAndFormatBoard(): Promise<Uint8ClampedArray> {
    const query = 'SELECT * FROM r_place.color_mappings'
    const client = await this.client
    const result = await client.execute(query)

    const data = new BoardDataGrid(Board.size, Board.size)

    result.rows.forEach((row: any) => {
      const idx = DimensionConvert.PosToCell(row.coordinatex, row.coordinatey)
      data.setPixel(idx, row.color)
    })

    return data.getData()
  }

  async set(xPos: number, yPos: number, colorIdx: number) {
    const query =
      'INSERT INTO r_place.color_mappings (coordinatex, coordinatey, color, timestamp) VALUES (?, ?, ?, toTimestamp(now()))'
    const client = await this.client
    await client.execute(query, [xPos, yPos, colorIdx], {
      // Local Quorum
      consistency: 6,
      prepare: true,
    })
  }

  async setUserActionTimestamp(userIP: string) {
    const query =
      'INSERT INTO r_place.timestamps (userip, timestamp) VALUES (?, toTimestamp(now()))'
    const client = await this.client
    await client.execute(query, [userIP], {
      // Local Quorum
      consistency: 6,
      prepare: true,
    })
  }

  async getUserActionTimestamp(userIP: string): Promise<Date | null> {
    const query = 'SELECT timestamp FROM r_place.timestamps WHERE userip = ? LIMIT 1'
    const client = await this.client
    const result = await client.execute(query, [userIP], { prepare: true })
    return result.rows.length > 0 ? result.rows[0].timestamp : null
  }
}
