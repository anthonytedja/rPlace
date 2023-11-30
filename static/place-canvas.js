import { getPaletteColorABGR } from './color.js'

export default class PlaceCanvas {
  constructor(width, height) {
    this.width = width
    this.height = height
    this.canvas = document.getElementById('canvas')
    this.canvasCtx = canvas.getContext('2d')

    this.buffer = new ArrayBuffer(this.width * this.height * 4) // actual storage for color data
    this.writeBuffer = new Uint32Array(this.buffer) // interacting with buffer; for storing changes made to canvas
    this.readBuffer = new Uint8ClampedArray(this.buffer) // interacting with buffer; for drawing onto the canvas / displaying GUI

    // currently neither are being used
    this.isBufferDirty = false
    this.isDisplyDirty = false

    this.canvas.addEventListener('mouseout', () => {
      const tooltip = document.getElementById('tooltip')
      if (tooltip) {
        tooltip.style.opacity = '0'
      }
    })

    this.canvas.addEventListener('mousemove', (event) => {
      const rect = this.canvas.getBoundingClientRect()
      const x = Math.min(Math.round(event.clientX - rect.left), 249)
      const y = Math.min(Math.round(event.clientY - rect.top), 249)

      // Create tooltip element if it doesn't exist
      let tooltip = document.getElementById('tooltip')
      if (!tooltip) {
        tooltip = document.createElement('div')
        tooltip.id = 'tooltip'
        document.body.appendChild(tooltip)
      }

      // Update tooltip content and position
      tooltip.textContent = `x: ${x}, y: ${y}`
      tooltip.style.left = `${event.pageX}px`
      tooltip.style.top = `${event.pageY}px`
      tooltip.style.opacity = '1'
    })
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
  parseBinary(bitBoard) {
    var idx, colorIdx1, colorIdx2
    for (var i = 0; i < bitBoard.length; i++) {
      // 16 colors total => 4 bits => each 8 bit integer stores data for 2 tiles
      colorIdx1 = (bitBoard[i] & 240) >> 4
      colorIdx2 = bitBoard[i] & 15

      idx = i * 2
      this.bufferPixelDraw(idx, colorIdx1)
      this.bufferPixelDraw(idx + 1, colorIdx2)
    }
  }

  // update buffer; call when changes are made
  bufferPixelDraw(i, colorIdx) {
    this.writeBuffer[i] = getPaletteColorABGR(colorIdx)
    this.isBufferDirty = true
  }

  // "flush" buffer for display; call to propagate changes to canvas
  displayBufferedDraws() {
    var imageData = new ImageData(this.readBuffer, this.width, this.height)
    this.canvasCtx.putImageData(imageData, 0, 0)
    this.isBufferDirty = false
  }

  getIndexFromCoords(x, y) {
    return y * this.width + x
  }

  setColor(x, y, colorIdx) {
    let idx = this.getIndexFromCoords(x, y)
    this.bufferPixelDraw(idx, colorIdx)
  }

  // immediately update a pixel on the canvas
  // color = "rgb(r, b, g)"
  drawPixelToDisplay(x, y, color) {
    this.canvasCtx.fillStyle = color
    this.canvasCtx.fillRect(x, y, 1, 1)
    this.isDisplayDirty = true
  }

  // immediately delete a pixel on the canvas
  // not sure if this will ever be called
  clearPixelFromDisplay(x, y) {
    this.canvasCtx.clearRect(x, y, 1, 1)
    this.isDisplayDirty = true
  }
}
