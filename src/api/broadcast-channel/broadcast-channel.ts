export interface BroadcastChannel {
  init(): Promise<void>
  subscribeToChannel(listener: any): Promise<void>
  publishContent(data: any): Promise<void>
}
