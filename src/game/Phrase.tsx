export default class Phrase {
  public static readonly かたたたき = new Phrase("かたたたき");
  public static readonly かた = new Phrase("かた");
  public static readonly たか = new Phrase("たか");
  public static readonly たき = new Phrase("たき");
  public static readonly きた = new Phrase("きた");
  public static readonly かき = new Phrase("かき");

  public readonly name: string;

  private constructor(name: string) {
    this.name = name;
  }
}