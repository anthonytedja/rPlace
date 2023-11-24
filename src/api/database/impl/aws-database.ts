import { Client, types } from 'cassandra-driver'
import { Color } from '../../../domain/color'
import { Database } from '../database'

const client = new Client({
  contactPoints: ['h1', 'h2'],
  localDataCenter: 'datacenter1',
  keyspace: 'ks1',
})

export class AwsDatabase implements Database {
  async set(xPos: number, yPos: number, color: Color, timestamp: Date): Promise<void> {
    const query =
      'INSERT INTO color_mappings_keyspace.color_mappings (xPos, yPos, color, timestamp) VALUES (?, ?, ?, ?)'
    await client.execute(query, [xPos, yPos, color, types.TimeUuid.fromDate(timestamp)], {
      prepare: true,
    })
  }

  async setUserActionTimestamp(timestamp: Date, userIP: string): Promise<void> {
    const query = 'INSERT INTO timestamps_keyspace.timestamps (userIP, timestamp) VALUES (?, ?)'
    await client.execute(query, [userIP, types.TimeUuid.fromDate(timestamp)], { prepare: true })
  }

  async getUserActionTimestamp(userIP: string): Promise<Date | null> {
    const query =
      'SELECT timestamp FROM timestamps_keyspace.timestamps WHERE userIP = ? ORDER BY timestamp DESC LIMIT 1'
    const result = await client.execute(query, [userIP], { prepare: true })
    return result.rows[0] ? result.rows[0].timestamp : null
  }
}
