export interface Database {
  getBoard(): Promise<number[][]>
  set(xPos: number, yPos: number, colorIdx: number): Promise<void>
  setUserActionTimestamp(userIP: string): Promise<void>
  getUserActionTimestamp(userIP: string): Promise<Date | null>
}
