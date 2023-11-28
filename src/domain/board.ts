import { MAX_COLOR_INDEX } from './color'

export class Board {
  static width: number = 250
  static height: number = 250

  private data: ArrayBuffer // should be an even size
  private dataArray: Uint8ClampedArray // work with the actual data through this
  private upperMask: number = 240
  private lowerMask: number = 15

  constructor() {
    this.data = new ArrayBuffer(Math.floor((Board.width * Board.height) / 2))
    // each index in the 8 bit array contains info for 2 tiles
    this.dataArray = new Uint8ClampedArray(this.data)
  }

  getData(): Uint8ClampedArray {
    return this.dataArray
  }

  // does not return an index for the 8 bit array
  getIndexFromCoords(x: number, y: number) {
    return y * Board.width + x
  }

  // returns an index for the 8 bit array
  getArrayIndex(idx: number) {
    return Math.floor(idx / 2)
  }

  isValidSet(x: number, y: number, colorIdx: number) {
    return colorIdx <= MAX_COLOR_INDEX && this.inBounds(x, y)
  }

  inBounds(x: number, y: number) {
    const inBounds =
      Number.isInteger(x) &&
      Number.isInteger(y) &&
      0 <= x &&
      x < Board.width &&
      0 <= y &&
      y < Board.height
    return inBounds
  }

  setPixel(x: number, y: number, colorIdx: number) {
    if (colorIdx > MAX_COLOR_INDEX) {
      throw new Error(`Invalid color: ${colorIdx}`)
    }

    if (!this.inBounds(x, y)) {
      throw new Error(`Out of bounds: (${x}, ${y})`)
    }

    let idx = this.getIndexFromCoords(x, y)
    let idxBitArray = this.getArrayIndex(idx)

    if (idx % 2 == 0) {
      // modify upper bits
      this.dataArray[idxBitArray] &= this.lowerMask
      this.dataArray[idxBitArray] |= colorIdx << 4
    } else {
      // modify lower bits
      this.dataArray[idxBitArray] &= this.upperMask
      this.dataArray[idxBitArray] |= colorIdx
    }

    console.log(`SET: ${x} ${y} ${colorIdx}`)
  }
}
