export default class Direction {
  public static readonly U = new Direction(0, 0,-1);
  public static readonly D = new Direction(1, 0,+1);
  public static readonly L = new Direction(2, -1,0);
  public static readonly R = new Direction(3, +1,0);

  public static readonly ALL = [Direction.U, Direction.D, Direction.L, Direction.R];

  static allBut(d: Direction|null) {
    return Direction.ALL.filter(x => x!=d);
  }

  public readonly ordinal: number;
  public readonly dx: number;
  public readonly dy: number;

  private constructor(ordinal: number, dx: number, dy: number) {
    this.ordinal = ordinal;
    this.dx = dx;
    this.dy = dy;
  }

  opposite() {
    return [Direction.D, Direction.U, Direction.R, Direction.L][this.ordinal];
  }

  toString() {
    return ["U","D","L","R"][this.ordinal];
  }
}
