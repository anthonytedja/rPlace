import { Color, Colors, hexToColor } from './color'

export class Board {
  size: number = 250
  private data: Array<Color>

  constructor() {
    this.data = new Array(this.size * this.size)
    this.data.fill(Colors.Red)
  }

  toString(): string {
    return ""
    // todo - idk, encode as image or some shit
  }

  isValidSet(x: number, y: number, hex: string) {
    return hexToColor(hex) != undefined && this.inBounds(x, y)
  }

  inBounds(x: number, y: number) {
    const outOfBounds =
      !Number.isInteger(x) ||
      !Number.isInteger(y) ||
      x < 0 ||
      y < 0 ||
      x >= this.size ||
      y >= this.size

    return !outOfBounds
  }

  set(x: number, y: number, hex: string) {
    const color = hexToColor(hex)
    if (color == undefined) {
      throw new Error(`Invalid color: ${hex}`)
    }

    if (!this.inBounds(x, y)) {
      throw new Error(`Out of bounds: (${x}, ${y})`)
    }

    this.data[y * this.size + x] = color
  }
}
