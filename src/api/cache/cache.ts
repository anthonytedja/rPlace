import { Board } from '../../domain/board'
import { Color } from '../../domain/color'

export interface Cache {
  set(xPos: number, yPos: number, color: Color): Promise<void>
  getBoard(): Promise<Board>
}
