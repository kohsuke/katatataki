export default class YesNoMaybe {
  public static readonly YES = new YesNoMaybe("Yes");
  public static readonly NO = new YesNoMaybe("No");
  public static readonly MAYBE = new YesNoMaybe("Maybe");

  public readonly name: string;

  private constructor(name: string) {
    this.name = name;
  }

  toString() {
    return this.name;
  }
}
