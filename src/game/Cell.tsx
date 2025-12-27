import Game from './Game.tsx';
import Phrase from "./Phrase.tsx";
import Direction from "./Direction.tsx";
import type Border from "./Border.tsx";

export default class Cell {
  public readonly game: Game;
  public readonly x: number;
  public readonly y: number;
  public value: string;
  public phrase: Phrase|null = null;

  constructor (game: Game, x: number, y: number, value: string) {
    this.game = game;
    this.x = x;
    this.y = y;
    if (value=='＝') {
      value = 'か';
      this.phrase = Phrase.かたたたき;
    }
    this.value = value;
  }

  neighbor(d: Direction) {
    return this.game.cell(this.x+d.dx, this.y+d.dy);
  }

  render() {
    return <b>{this.value}</b>;
  }

  click() {
    this.value = this.value +1;
    this.game.emitChange();
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
}
