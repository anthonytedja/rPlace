import { Board } from '../domain/board'

export interface IBroadcastChannel {
  init(): Promise<void>
  subscribeToChannel(listener: any): Promise<void>
  publishContent(data: any): Promise<void>
}

export interface ICache {
  set(xPos: number, yPos: number, colorIdx: number): Promise<void>
  setBoard(board: Board): Promise<void>
  getBoard(): Promise<Board>
  subscribe(channel: string, callback: (channel: string, message: string) => void): Promise<void>
  publish(channel: string, message: string): Promise<number>
}

export interface IDatabase {
  getAndFormatBoard(): Promise<Uint8ClampedArray>
  set(xPos: number, yPos: number, colorIdx: number): Promise<void>
  setUserActionTimestamp(userIP: string): Promise<void>
  getUserActionTimestamp(userIP: string): Promise<Date | null>
}
