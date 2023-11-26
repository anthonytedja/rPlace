export interface Database {
  set(xPos: number, yPos: number, colorIdx: number, timestamp: Date): Promise<void>
  setUserActionTimestamp(timestamp: Date, userIP: string): Promise<void>
  getUserActionTimestamp(userIP: string): Promise<Date | null>
}
