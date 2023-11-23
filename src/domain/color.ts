export interface Color {
  // value to use in string encoding and for database
  encode: string

  // value to use in frontend
  hex: string
}

export const Colors = {
  Red: { encode: 'R', hex: 'FFFFFF' },
  Yellow: { encode: 'Y', hex: 'FFFFFF' },
  Green: { encode: 'G', hex: 'FFFFFF' },
}

export function hexToColor(hex: string): Color | undefined {
  for (const color of Object.values(Colors)) {
    if (color.hex == hex) {
      return color
    }
  }
  return undefined
}

