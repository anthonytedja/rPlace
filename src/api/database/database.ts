import { Color } from '../../domain/color'

export interface Database {
  set(xPos: number, yPos: number, color: Color, timestamp: Date): Promise<void>
  setUserActionTimestamp(timestamp: Date, userIP: string): Promise<void>
  getUserActionTimestamp(userIP: string): Promise<Date | null>
}
