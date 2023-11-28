export interface Database {
  set(xPos: number, yPos: number, colorIdx: number, timestamp: Date): Promise<void>
  setUserActionTimestamp(userIP: string, timestamp: Date): Promise<void>
  getUserActionTimestamp(userIP: string): Promise<Date | null>
}
