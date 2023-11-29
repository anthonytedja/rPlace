import { Board } from '../../domain/board'

export interface Cache {
  set(xPos: number, yPos: number, colorIdx: number): Promise<void>
  setBoard(board: Board): Promise<void>
  getBoard(): Promise<Board>
}
