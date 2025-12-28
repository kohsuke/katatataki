export default class Phrase {
  public static readonly かたたたき = new Phrase("かたたたき");
  public static readonly かた = new Phrase("かた");
  public static readonly たか = new Phrase("たか");
  public static readonly たき = new Phrase("たき");
  public static readonly きた = new Phrase("きた");
  public static readonly かき = new Phrase("かき");

  public static readonly ALL = [Phrase.かたたたき, Phrase.かた, Phrase.たか, Phrase.たき, Phrase.きた, Phrase.かき]

  public readonly name: string;
  public readonly length: number;
  public readonly head: string;
  public readonly reverseName: string;

  private constructor(name: string) {
    this.name = name;
    this.length = name.length;
    this.head = name.charAt(0);
    this.reverseName = name.split('').reverse().join('');
  }

  toString() {
    return this.name;
  }

  static of(s: string) {
    const p = Phrase.ALL.find(p => p.name==s);
    console.assert(p!=undefined);
    return p!;
  }
}
