import Game from './Game.tsx';
import Phrase from "./Phrase.tsx";
import Direction from "./Direction.tsx";
import Border from "./Border.tsx";
import YesNoMaybe from "./YesNoMaybe.tsx";
import type BorderGrid from "../components/BorderGrid.tsx";

export default class Cell {
  public readonly game: Game;
  public readonly x: number;
  public readonly y: number;
  public letter: string;
  public phrase: Phrase|null = null;
  /** true if this is the head letter of a phrase. */
  public head: YesNoMaybe = YesNoMaybe.MAYBE;

  constructor (game: Game, x: number, y: number, value: string) {
    this.game = game;
    this.x = x;
    this.y = y;
    if (value=='＝') {
      value = 'か';
      this.phrase = Phrase.かたたたき;
      this.head = YesNoMaybe.YES;
    }
    this.letter = value;
  }

  neighbor(d: Direction) {
    return this.game.cell(this.x+d.dx, this.y+d.dy);
  }

  neighbors() {
    const neighbors: Cell[] = []
    Direction.ALL.forEach(d => {
      const n = this.neighbor(d);
      if (n) {
        neighbors.push(n);
      }
    })
    return neighbors;
  }

  forEachNeighbor(f: (n: Cell) => void) {
    Direction.ALL.forEach(d => {
      const n = this.neighbor(d);
      if (n) {
        f(n);
      }
    })
  }

  /**
   * Returns the neighbor cell if & only if that is the only connected neighbor
   */
  soleConnectedDirection() {
    const x = Direction.ALL.filter(d => this.getBorder(d) == Border.CONNECTED);
    return x.length == 1 ? x[0] : null;
  }

  soleNonClosedDirection() {
    const x = Direction.ALL.filter(d => this.getBorder(d) != Border.CLOSED);
    return x.length == 1 ? x[0] : null;
  }

  /** If this cell has any neighbor that's already a head, then this cell CANNOT be a head. */
  cannotBeHead() {
    return this.head==YesNoMaybe.NO;
  }


  render() {
    return <span className={this.head.name}>{this.letter}</span>;
  }

  // click() {
  //   this.letter = this.letter +1;
  //   this.game.emitChange();
  // }

  /** If this cell is confirmed to be a letter in a two letter phrase, return the other letter. */
  theOtherInPair() {
    var d = this.soleNonClosedDirection();
    if (d) {
      let n = this.neighbor(d)!;
      if (n.soleNonClosedDirection()) {
        return n;
      }
    }
    return null;
  }

  getBorder(d: Direction) {
    const borders = this.game.borders;
    switch (d) {
    case Direction.U:
      if (this.y==0)  return Border.CLOSED;
      return borders.h.get(this.x,this.y-1);
    case Direction.D:
      if (this.y==this.game.Y-1)  return Border.CLOSED;
      return borders.h.get(this.x,this.y);
    case Direction.L:
      if (this.x==0)  return Border.CLOSED;
      return borders.v.get(this.x-1, this.y);
    case Direction.R:
      if (this.x==this.game.X-1)  return Border.CLOSED;
      return borders.v.get(this.x, this.y);
    }
  }

  setBorder(d: Direction, b: Border) {
    function safeSet(arr :BorderGrid, x: number, y: number) {
      const a = arr.values[x];
      if (a!==undefined) {
        if (a[y]!==undefined) {
          a[y] = b;
          return;
        }
      }
      console.assert(b==Border.CLOSED, "Out ouf bounds border set to non-closed");
    }
    const borders = this.game.borders;
    switch (d) {
    case Direction.U: safeSet(borders.h, this.x, this.y-1); break;
    case Direction.D: safeSet(borders.h, this.x, this.y); break;
    case Direction.L: safeSet(borders.v, this.x - 1, this.y); break;
    case Direction.R: safeSet(borders.v, this.x, this.y); break;
    }
  }

  setPhrase(p: Phrase) {
    if (this.phrase==p)   return; // noop
    console.assert(this.phrase==null);
    this.phrase = p;
  }

  updateHead() {
    if (this.head==YesNoMaybe.MAYBE) {
      if (this.phrase) {
        this.head = (this.letter==this.phrase.head) ? YesNoMaybe.YES : YesNoMaybe.NO;
      }
      if (this.neighbors().find(n => n.head==YesNoMaybe.YES)) {
        this.head = YesNoMaybe.NO;
      }
    }
  }

  toString() {
    return `(${this.x},${this.y})${this.letter}`;
  }
}
