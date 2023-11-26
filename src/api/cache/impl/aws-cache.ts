import { Cache } from "../cache";
import { Board } from '../../../domain/board'

export class AwsCache implements Cache {
  set(xPos: number, yPos: number, colorIdx: number): Promise<void> {
    // TODO
	  return new Promise(() => console.log("TODO"))
  }

  getBoard(): Promise<Board> {
	  // TODO
	  return new Promise(() => console.log("TODO"))
  }
}
