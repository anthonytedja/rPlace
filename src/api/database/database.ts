export interface Database {
  getAndFormatBoard(): Promise<Uint8ClampedArray>
  set(xPos: number, yPos: number, colorIdx: number): Promise<void>
  setUserActionTimestamp(userIP: string): Promise<void>
  getUserActionTimestamp(userIP: string): Promise<Date | null>
}
