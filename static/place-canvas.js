import { getPaletteColorABGR } from './color.js'

export default class PlaceCanvas {
  constructor(width, height) {
    this.width = width
    this.height = height
    this.canvas = document.getElementById('canvas')
    this.canvasCtx = canvas.getContext('2d')

    this.buffer = new ArrayBuffer(this.width * this.height * 4) // actual storage for color data
    this.writeBuffer = new Uint32Array(this.buffer) // for storing changes made to canvas
    this.readBuffer = new Uint8ClampedArray(this.buffer) // for drawing onto the canvas / displaying GUI; periodically refresh canvas

    // currently neither are being used
    this.isBufferDirty = false
    this.isDisplyDirty = false
  }

  /**
   * Parse an RGBA representation of a canvas from a bitwise representation of
   * the canvas. The RGBA representation will be used to work with the canvas
   * on the client side.
   *
   * Prereq: canvas must have an even number of tiles
   *
   * bitBoard: array of 8 bit integers; each holds two 4 bit integers
   */
  parseInitialState(bitBoard) {
    var idx, color1, color2
    for (var i = 0; i < bitBoard.length; i++) {
      // 16 colors total => 4 bits => each 8 bit integer stores data for 2 tiles
      color1 = (bitBoard[i] & 240) >> 4
      color2 = bitBoard[i] & 15

      idx = i * 2
      this.setBufferState(idx, getPaletteColorABGR(color1))
      this.setBufferState(idx + 1, getPaletteColorABGR(color2))
    }
  }

  // update buffer; call when changes are made
  setBufferState(i, color) {
    this.writeBuffer[i] = color
    this.isBufferDirty = true
  }

  // "flush" buffer for display; call to propagate changes to canvas
  drawBufferToDisplay() {
    var imageData = new ImageData(this.readBuffer, this.width, this.height)
    this.canvasCtx.putImageData(imageData, 0, 0)
    this.isBufferDirty = false
  }

  getIndexFromCoords(x, y) {
    return x * WIDTH + y
  }

  setColor(x, y, color) {
    this.setBufferState(x * HEIGHT + y, color)
  }

  drawPixelToDisplay(x, y, color) {
    this.canvasCtx.fillStyle = color
    this.canvasCtx.fillRect(x, y, 1, 1)
    this.isDisplayDirty = true
  }

  // not sure if this will ever be called
  clearPixelFromDisplay(x, y) {
    this.canvasCtx.clearRect(x, y, 1, 1)
    this.isDisplayDirty = true
  }
}
