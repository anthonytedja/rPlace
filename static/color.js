export const MAX_COLOR_INDEX = 15
export const DEFAULT_COLOR_ABGR = 0xffffffff

// definition of colors; we don't actually work with this directly
export const DEFAULT_COLOR_PALETTE = [
  '#FFFFFF', // white
  '#E4E4E4', // light grey
  '#888888', // grey
  '#222222', // black
  '#FFA7D1', // pink
  '#E50000', // red
  '#E59500', // orange
  '#A06A42', // brown
  '#E5D900', // yellow
  '#94E044', // lime
  '#02BE01', // green
  '#00D3DD', // cyan
  '#0083C7', // blue
  '#0000EA', // dark blue
  '#CF6EE4', // magenta
  '#820080', // purple
]
// the internal color palette structure stores colors as ABGR (reversed RGBA)
// to make writing to the color buffer easier
export const PALETTE_ABGR = mapColorPalette(DEFAULT_COLOR_PALETTE)

/**
 * Get a ABGR representation of a color.
 * Colors are defined in an array and are associated with an index.
 */
export function getPaletteColorABGR(colorIndex) {
  colorIndex = Math.min(MAX_COLOR_INDEX, Math.max(0, colorIndex | 0))
  return PALETTE_ABGR[colorIndex % PALETTE_ABGR.length] || DEFAULT_COLOR_ABGR
}

/**
 * Extract the RGB components from a hex color.
 */
function parseHexColor(hexColor) {
  var colorVal = parseInt(hexColor.slice(1), 16)
  return {
    red: (colorVal >> 16) & 0xff,
    green: (colorVal >> 8) & 0xff,
    blue: colorVal & 0xff,
  }
}
/**
 * Map an array of hex colors to an array of ABGR colors.
 */
function mapColorPalette(palette) {
  var dataView = new DataView(new ArrayBuffer(4))
  // the first byte is alpha, which is always going to be 0xFF
  dataView.setUint8(0, 0xff)

  return palette.map(function (colorString) {
    var color = parseHexColor(colorString)
    dataView.setUint8(1, color.blue)
    dataView.setUint8(2, color.green)
    dataView.setUint8(3, color.red)
    return dataView.getUint32(0)
  })
}
