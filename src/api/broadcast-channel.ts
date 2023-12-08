import { createClient } from 'redis'
import { IBroadcastChannel } from '../types'

export class BroadcastChannel implements IBroadcastChannel {
  subscriber: any
  publisher: any

  async init(): Promise<void> {
    this.subscriber = createClient({
      url:
        process.env.NODE_ENV === 'development'
          ? 'redis://redis:6379'
          : 'redis://somecache-002.fxt3pv.0001.use1.cache.amazonaws.com:6379',
    })
    this.subscriber.on('error', (err: string) => console.log('Redis Client Error:', err))

    this.publisher = createClient({
      url:
        process.env.NODE_ENV === 'development'
          ? 'redis://redis:6379'
          : 'redis://somecache-002.fxt3pv.0001.use1.cache.amazonaws.com:6379',
    })
    this.publisher.on('error', (err: string) => console.log('Redis Client Error:', err))

    return this.subscriber.connect().then(() => this.publisher.connect())
  }

  async subscribeToChannel(listener: any): Promise<void> {
    return this.subscriber.subscribe('pixel-update', listener)
  }

  async publishContent(data: any): Promise<void> {
    return this.publisher.publish('pixel-update', JSON.stringify(data))
  }
}
