import { Color } from "../../domain/color";

export interface Cache {
  set(xPos: number, yPos: number, color: Color): void
}