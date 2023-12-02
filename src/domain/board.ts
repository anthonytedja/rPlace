import { DevDatabase } from '../api/database/impl/dev-database'
import { MAX_COLOR_INDEX } from './color'
import { DimensionConvert } from './dimension-convert'
import { BoardDataGrid } from './board-data-grid'

// TODO: Delete when better ip checking is implemented
export async function IP() {
  return fetch('https://www.cloudflare.com/cdn-cgi/trace').then(async (response) => {
    const data = await response.text()
    const lines = data.split('\n')
    const ipLine = lines.find((line) => line.startsWith('ip='))
    return ipLine ? ipLine.split('=')[1] : 'unknown'
  })
}

const db = new DevDatabase()

export class Board {
  static size: number = 250

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

  /**
   * @returns an index for the 8 bit array
   */
  getArrayIndex(idx: number) {
    return Math.floor(idx / 2)
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

  /**
   * @returns true if the user can update the board (last update was > 5 minutes ago)
   */
  async canUpdate() {
    const userIP = await IP()
    const lastTimestamp = await db.getUserActionTimestamp(userIP)
    if (lastTimestamp === null) return true
    const now = new Date()
    const timeDiff = now.getTime() - lastTimestamp.getTime()
    console.log(`timeDiff: ${timeDiff}`)
    // 5 minutes
    if (timeDiff <= 300000) {
      // throw new Error(`Too soon for user IP ${userIP}: ${timeDiff} should be > 300000`)
      return false
    }
    return true
  }

  async setPixel(x: number, y: number, colorIdx: number) {
    const userIP = await IP()

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
