import { Board } from './board'

export class DimensionConvert {
  static CellToPos(cell: number): [number, number] {
    return [Math.floor(cell / Board.size), cell % Board.size]
  }

  static PosToCell(xPos: number, yPos: number): number {
    return yPos * Board.size + xPos
  }
}
