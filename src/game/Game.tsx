import Cell from './Cell.tsx';
import Border from './Border.tsx';
import Direction from "./Direction.tsx";

export default class Game {
  public readonly X: number;
  public readonly Y: number;

  public readonly cells: Cell[][];
  public readonly borders = {
    /** vertical border. v[0][0] is the right border of cells[0][0] */
    v: [] as Border[][],
    /** horizontal border. h[0][0] is the bottom border of cells[0][0] */
    h: [] as Border[][]
    };

  private readonly listeners: Set<() => void> = new Set();

  constructor(input: string[]) {
    this.X = input[0].length;
    this.Y = input.length;
    this.listeners = new Set();
    this.cells = [];
    for(let x=0; x<this.X; x++) {
      const a = [], bv = [], bh = [];
      for (let y=0; y<this.Y; y++) {
        a.push(new Cell(this,x,y, input[y][x]) );
        bv.push(Border.MAYBE);
        if (y!=this.Y-1) {
          bh.push(Border.MAYBE);
        }
      }
      this.cells.push(a);
      if (x!=this.X-1) {
        this.borders.v.push(bv);
      }
      this.borders.h.push(bh);
    }
  }

  // A way for React to "subscribe"
  subscribe(callback: ()=>void): ()=>void {
    this.listeners.add(callback);
    // Return a function to "unsubscribe" easily
    return () => this.listeners.delete(callback);
  }

  // Tell everyone to update
  emitChange() {
    this.listeners.forEach(callback => callback());
  }

  solve() {
    this.cells.forEach(r =>
      r.forEach(c => {


        function shouldClose(c1:Cell, c2:Cell) {
          let prohibited = ['きき','かか'];
          return prohibited.includes(c1.value+c2.value) || prohibited.includes(c2.value+c1.value);
        }

        Direction.ALL.forEach(d => {
          const n = c.neighbor(d)
          if (n && shouldClose(c,n)) {
            console.log(`probe`)
            c.setBorder(d, Border.CLOSED);
          }
        })
      }));
    console.log("solving")
    this.emitChange();
  }

  cell(x: number, y: number) {
    function inRange(s: number, v: number, e: number) {
      return s<=v && v<e;
    }
    if (inRange(0,x,this.X) && inRange(0,y,this.Y)) {
      return this.cells[x][y];
    } else {
      return null;
    }
  }
}
