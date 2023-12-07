import { BroadcastChannel } from '../broadcast-channel'
import { createClient as redisCreateClient } from 'redis'

export class DevBroadcastChannel implements BroadcastChannel {
  subscriber: any
  publisher: any

  async init(): Promise<void> {
    this.subscriber = redisCreateClient({
      url: 'redis://somecache-002.fxt3pv.0001.use1.cache.amazonaws.com:6379',
    })
    this.subscriber.on('error', (err: string) => console.log('REDIS CLIENT ERROR', err))

    this.publisher = redisCreateClient({
      url: 'redis://somecache-002.fxt3pv.0001.use1.cache.amazonaws.com:6379',
    })
    this.publisher.on('error', (err: string) => console.log('REDIS CLIENT ERROR', err))

    return this.subscriber.connect().then(() => this.publisher.connect())
  }

  async subscribeToChannel(listener: any): Promise<void> {
    return this.subscriber.subscribe('pixel-update', listener)
  }

  async publishContent(data: any): Promise<void> {
    return this.publisher.publish('pixel-update', JSON.stringify(data))
  }
}
