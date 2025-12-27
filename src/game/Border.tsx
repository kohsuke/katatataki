export default class Border {
  public static readonly CONNECTED = new Border("connected");
  public static readonly MAYBE = new Border("maybe");
  public static readonly CLOSED = new Border("closed");

  public readonly name: string;

  private constructor(name: string) {
    this.name = name;
  }
}