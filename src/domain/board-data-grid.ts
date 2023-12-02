export class BoardDataGrid {
  private data: ArrayBuffer // where actual data is stored
  private dataArray: Uint8ClampedArray // work with the actual data through this

  private upperMask: number = 240
  private lowerMask: number = 15

  private width: number
  private height: number

  constructor(width: number, height: number) {
    this.width = width
    this.height = height
    
    this.data = new ArrayBuffer(Math.floor((this.width * this.height) / 2)) // should be an even size
    this.dataArray = new Uint8ClampedArray(this.data) // each index in the 8 bit array contains info for 2 tiles
  }

  getData(): Uint8ClampedArray {
    return this.dataArray
  }

  setData(data: Uint8ClampedArray) {
    this.data = data
    this.dataArray = new Uint8ClampedArray(this.data)
  }

  /**
   * @param idx position of cell in the board
   * @returns ArrayBuffer index containing the cell
   */
  getArrayIndex(idx: number) {
    return Math.floor(idx / 2)
  }

  /**
   * @param idx position of cell in the board
   * @param colorIdx color to set in the cell
   */
  setPixel(posIdx: number, colorIdx: number) {
    let idx = this.getArrayIndex(posIdx)

    if (posIdx % 2 == 0) {
      // modify upper bits
      this.dataArray[idx] &= this.lowerMask
      this.dataArray[idx] |= colorIdx << 4
    } else {
      // modify lower bits
      this.dataArray[idx] &= this.upperMask
      this.dataArray[idx] |= colorIdx
    }
  }
}