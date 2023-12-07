import { DevDatabase } from '../api/database/impl/dev-database'
import { AWSDatabase } from '../api/database/impl/aws-database'
import { MAX_COLOR_INDEX } from './color'
import { DimensionConvert } from './dimension-convert'
import { BoardDataGrid } from './board-data-grid'

//const db = new DevDatabase()
const db = new AWSDatabase()

export class Board {
  static size: number = 1000

  private data: BoardDataGrid

  constructor(dataArrayOverride?: Uint8ClampedArray) {
    this.data = new BoardDataGrid(Board.size, Board.size)

    if (typeof dataArrayOverride !== 'undefined') {
      this.setData(dataArrayOverride)
    }
  }

  getData(): Uint8ClampedArray {
    return this.data.getData()
  }

  setData(data: Uint8ClampedArray) {
    this.data.setData(data)
  }

  isValidSet(x: number, y: number, colorIdx: number) {
    return colorIdx <= MAX_COLOR_INDEX && this.inBounds(x, y)
  }

  inBounds(x: number, y: number) {
    return (
      Number.isInteger(x) &&
      Number.isInteger(y) &&
      0 <= x &&
      x < Board.size &&
      0 <= y &&
      y < Board.size
    )
  }

  async setPixel(x: number, y: number, colorIdx: number, userIP: string) {
    if (colorIdx > MAX_COLOR_INDEX) {
      throw new Error(`Invalid color: ${colorIdx}`)
    }

    if (!this.inBounds(x, y)) {
      throw new Error(`Out of bounds: (${x}, ${y})`)
    }

    let idx = DimensionConvert.PosToCell(x, y)
    this.data.setPixel(idx, colorIdx)

    await db.set(x, y, colorIdx)
    await db.setUserActionTimestamp(userIP)
    console.log(`SET: ${x} ${y} ${colorIdx}`)
  }
}
