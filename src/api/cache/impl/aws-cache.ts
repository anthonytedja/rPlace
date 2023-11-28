import { Board } from '../../../domain/board'
import { Cache } from '../cache'

export class AwsCache implements Cache {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  set(xPos: number, yPos: number, colorIdx: number): Promise<void> {
    // TODO
    return new Promise(() => console.log('TODO'))
  }

  getBoard(): Promise<Board> {
    // TODO
    return new Promise(() => console.log('TODO'))
  }
}
