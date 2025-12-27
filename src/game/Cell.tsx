import Game from './Game.tsx';

export default class Cell {
  public readonly game: Game;
  public readonly x: number;
  public readonly y: number;
  public value: string;

  constructor (game: Game, x: number, y: number, value: string) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.value = value;
  }

  render() {
    return <b>{this.value}</b>;
  }

  click() {
    this.value = this.value +1;
    this.game.emitChange();
  }
}