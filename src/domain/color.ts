export interface Color {
  // value to use in string encoding and for database
  encode: string

  // value to use in frontend
  hex: string
}

export const Colors = {
  Red: { encode: 'R', hex: 'FF0000' },
  Yellow: { encode: 'Y', hex: 'FFD300' },
  Green: { encode: 'G', hex: '32612D' },
}

export function hexToColor(hex: string): Color | undefined {
  for (const color of Object.values(Colors)) {
    if (color.hex == hex) {
      return color
    }
  }
  return undefined
}

