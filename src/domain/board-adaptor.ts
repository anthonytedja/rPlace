import { Board } from '../domain/board'

export class BoardAdaptor {
  static fromBinary(raw: string): Board {
    // stream of 4-bit values, each representing a color
    // cells are arranged in sequence left-to-right top-to-bottom
    return undefined as any
  }

  static fromBoard(board: Board): string {
    // opposite of above function
    return undefined as any
  }
}

/*
  getIndex(x: number, y:number): number {
    return x * Board.WIDTH + y;
  }
  
  bufferPixelDraw(i: number, color: number): void {
    this.writeBuffer[i] = color;
  }

  displayBufferedChanges() {
    var imageData = new ImageData(this.readBuffer, Board.WIDTH, Board.HEIGHT);
		// this.canvasCtx.putImageData(imageData, 0, 0);
  }
  //
*/
