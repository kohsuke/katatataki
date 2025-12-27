export default class Cell {

  constructor (
    public readonly board: Board,
    public readonly x: number,
    public readonly y: number,
    public value: string) {
  }

  render() {
    return <b>{this.value}</b>;
  }

  click() {
    this.value = this.value +1;
    this.board.emitChange();
  }
}