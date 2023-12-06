import { Board } from '../../domain/board'

export interface Cache {
  set(xPos: number, yPos: number, colorIdx: number): Promise<void>
  setBoard(board: Board): Promise<void>
  getBoard(): Promise<Board>
  subscribe(channel: string, callback: (channel: string, message: string) => void): Promise<void>
  publish(channel: string, message: string): Promise<number>
}
