import Game from './Game.tsx';
import Phrase from "./Phrase.tsx";

export default class Cell {
  public readonly game: Game;
  public readonly x: number;
  public readonly y: number;
  public value: string;
  public phrase: Phrase = null;

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

  render() {
    return <b>{this.value}</b>;
  }

  click() {
    this.value = this.value +1;
    this.game.emitChange();
  }
}