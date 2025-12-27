import Game from './Game.tsx';
import Phrase from "./Phrase.tsx";
import Direction from "./Direction.tsx";
import Border from "./Border.tsx";

export default class Cell {
  public readonly game: Game;
  public readonly x: number;
  public readonly y: number;
  public letter: string;
  public phrase: Phrase|null = null;
  /** true if this is the head letter of a phrase. */
  public head: boolean = false;

  constructor (game: Game, x: number, y: number, value: string) {
    this.game = game;
    this.x = x;
    this.y = y;
    if (value=='＝') {
      value = 'か';
      this.phrase = Phrase.かたたたき;
      this.head = true;
    }
    this.letter = value;
  }

  neighbor(d: Direction) {
    return this.game.cell(this.x+d.dx, this.y+d.dy);
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
    return Direction.ALL.find(d => this.neighbor(d)?.head)!=undefined;
  }


  render() {
    let v = this.letter;
    if (this.head)
      v = "("+v+")";
    return <b>{v}</b>;
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
      return borders.h[this.x][this.y-1];
    case Direction.D:
      if (this.y==this.game.Y-1)  return Border.CLOSED;
      return borders.h[this.x][this.y];
    case Direction.L:
      if (this.x==0)  return Border.CLOSED;
      return borders.v[this.x-1][this.y];
    case Direction.R:
      if (this.x==this.game.X-1)  return Border.CLOSED;
      return borders.v[this.x][this.y];
    }
  }

  setBorder(d: Direction, b: Border) {
    function safeSet(arr :Border[][], x: number, y: number) {
      const a = arr[x];
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
    if (this.letter==p.head) {
      this.head = true;
      console.assert(!this.cannotBeHead());
    }
  }

  toString() {
    return `(${this.x},${this.y})${this.letter}`;
  }
}
