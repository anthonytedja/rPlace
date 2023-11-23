import { Color } from "../../../domain/color";
import { Cache } from "../cache";

export class DevCache implements Cache {
  set(xPos: number, yPos: number, color: Color): void {
    // do some redis shit with docker compose
  }
}
