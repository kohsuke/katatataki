import Cell from './Cell.tsx';

export default class Game {
  cells: Cell[];
  X: number;
  Y: number;

  constructor(input: string[]) {
    this.X = input[0].length;
    this.Y = input.length;
    this.listeners = new Set();
    this.cells = [];
    for(let x=0; x<this.X; x++) {
      const a = [];
      for (let y=0; y<this.Y; y++) {
        a.push(new Cell(this,x,y, input[y][x]) );
      }
      this.cells.push(a);
    }
  }

  // A way for React to "subscribe"
  subscribe(callback) {
    this.listeners.add(callback);
    // Return a function to "unsubscribe" easily
    return () => this.listeners.delete(callback);
  }

  // Tell everyone to update
  emitChange() {
    this.listeners.forEach(callback => callback());
  }
}