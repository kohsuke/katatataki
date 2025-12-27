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

  render() {
    let v = this.letter;
    if (this.head)
      v = "("+v+")";
    return <b>{v}</b>;
  }

  click() {
    this.letter = this.letter +1;
    this.game.emitChange();
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
    const borders = this.game.borders;
    switch (d) {
    case Direction.U: borders.h[this.x][this.y-1] = b; break;
    case Direction.D: borders.h[this.x][this.y] = b; break;
    case Direction.L: borders.v[this.x-1][this.y] = b; break;
    case Direction.R: borders.v[this.x][this.y] = b; break;
    }
  }

  toString() {
    return `(${this.x},${this.y})${this.letter}`;
  }
}
