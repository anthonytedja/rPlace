import { Client, types } from 'cassandra-driver'

import { Database } from '../database'

export class DevDatabase implements Database {
  client = this.createClient()

  async createClient() {
    const client = new Client({
      contactPoints: ['cassandra'],
      localDataCenter: 'datacenter1',
      keyspace: 'r_place',
    })
    await client.connect()
    return client
  }

  async set(xPos: number, yPos: number, colorIdx: number, timestamp: Date) {
    const query = 'INSERT INTO r_place.color_mappings (x, y, color, timestamp) VALUES (?, ?, ?, ?)'
    const client = await this.client
    await client.execute(query, [xPos, yPos, colorIdx, types.TimeUuid.fromDate(timestamp)], {
      prepare: true,
    })
  }

  async setUserActionTimestamp(userIP: string, timestamp: Date) {
    const IPadd = await IP('https://www.cloudflare.com/cdn-cgi/trace').then((data) => {
      let ipRegex = /[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}/
      let ip = (data?.match(ipRegex) ?? [''])[0]
      return ip
    })
    const query = 'INSERT INTO r_place.timestamps (userIP, timestamp) VALUES (?, ?)'
    const client = await this.client
    await client.execute(query, [IPadd, types.TimeUuid.fromDate(timestamp)], {
      prepare: true,
    })
  }

  async getUserActionTimestamp(userIP: string): Promise<Date | null> {
    const query =
      'SELECT timestamp FROM r_place.timestamps WHERE userIP = ? ORDER BY timestamp DESC LIMIT 1'
    const client = await this.client
    const result = await client.execute(query, [userIP], { prepare: true })
    return result.rows[0] ? result.rows[0].timestamp : null
  }
}

export async function IP(url: string) {
  return await fetch(url).then((res) => res.text())
}
