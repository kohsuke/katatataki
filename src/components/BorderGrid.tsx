import Border from "../game/Border.tsx";

export default class BorderGrid {
  public values: Border[][];

  constructor(values: Border[][]) {
    this.values = values;
  }

  public get(x: number, y: number) {
    return this.values[x][y];
  }
}
