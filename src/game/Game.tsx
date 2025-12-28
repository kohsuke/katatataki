import Cell from './Cell.tsx';
import Border from './Border.tsx';
import Direction from "./Direction.tsx";
import Phrase from "./Phrase.tsx";
import YesNoMaybe from "./YesNoMaybe.tsx";
import BorderGrid from "../components/BorderGrid.tsx";

export default class Game {
  public readonly X: number;
  public readonly Y: number;

  public readonly cells: Cell[][];
  public readonly borders : {
    /** vertical border. v[0][0] is the right border of cells[0][0] */
    v: BorderGrid,
    /** horizontal border. h[0][0] is the bottom border of cells[0][0] */
    h: BorderGrid
  };

  private readonly listeners: Set<() => void> = new Set();

  constructor(input: string[]) {
    this.X = input[0].length;
    this.Y = input.length;
    this.listeners = new Set();
    this.cells = [];
    const bvv: Border[][] = [];
    const bhh: Border[][] = [];
    for (let x = 0; x < this.X; x++) {
      const a = [], bv = [], bh = [];
      for (let y = 0; y < this.Y; y++) {
        a.push(new Cell(this, x, y, input[y][x]));
        bv.push(Border.MAYBE);
        if (y != this.Y - 1) {
          bh.push(Border.MAYBE);
        }
      }
      this.cells.push(a);
      if (x != this.X - 1) {
        bvv.push(bv);
      }
      bhh.push(bh);
    }
    this.borders = { h: new BorderGrid(bhh), v: new BorderGrid(bvv) };
  }

  // A way for React to "subscribe"
  subscribe(callback: () => void): () => void {
    this.listeners.add(callback);
    // Return a function to "unsubscribe" easily
    return () => this.listeners.delete(callback);
  }

  // Tell everyone to update
  emitChange() {
    this.listeners.forEach(callback => callback());
  }

  solve() {
    this.cells.forEach(r => {
      r.forEach(c => {
        Direction.ALL.forEach(d => {
          const n = c.neighbor(d);
          if (n) {
            // no phrase includes these sequences
            if (['きき', 'かか'].includes(c.letter + n.letter)) {
              c.setBorder(d, Border.CLOSED);
            }

            if (c.letter == 'か' && c.phrase == Phrase.かたたたき && n.letter == 'き') {
              c.setBorder(d, Border.CLOSED);
            }

            // if two cells are connected, they belong to the same phrase
            if (c.getBorder(d) == Border.CONNECTED) {
              if (c.phrase != null) n.setPhrase(c.phrase);
              if (n.phrase != null) c.setPhrase(n.phrase);
            }
          }
        });

        const soleNonClosedDirection = c.soleNonClosedDirection();
        if (soleNonClosedDirection) {// three borders are closed
          const n = c.neighbor(soleNonClosedDirection)!;
          c.setBorder(soleNonClosedDirection, Border.CONNECTED);

          if (c.letter == 'き' && c.phrase == null && n.letter == 'か') {
            c.setPhrase(Phrase.かき);
          }
        }

        const soleConnectedDirection = c.soleConnectedDirection();
        if (soleConnectedDirection) {
          // const n = c.neighbor(soleConnectedDirection)!;

          if (c.phrase?.length == 2) {
            // if we are a part of the length 2 phrase like かき, then we will only have one neighbor
            Direction.allBut(soleConnectedDirection).map(d => {
              c.setBorder(d, Border.CLOSED)
            });
          }
        }

        // かたたたき backtrack search
        if (c.phrase==Phrase.かたたたき && c.head==YesNoMaybe.YES) {
          type Route = Cell[];

          const routes: Route[] = [];
          /**
           * Unit of backtrack search.
           *
           * @param head      the route where we came from
           * @param remaining remaining letters to find
           * @param c         cell we are visiting to evaluate the match with `remaining`
           * @param from      the direction (from the `cell` PoV) the search came from
           */
          function search(head: Route, remaining: string, c: Cell, from: Direction|null) {
            if (c.letter!=remaining.charAt(0)) {
              // not a match
              return;
            }
            if (remaining.length==1) {
              // found the whole match
              routes.push([...head, c]);
              return;
            }

            Direction.ALL.forEach(d => {
              if (d==from)    return;   // we came from there
              if (c.getBorder(d)==Border.CLOSED)  return;  // can't go there

              const n = c.neighbor(d);
              if (n) {
                search([...head, c],remaining.substring(1), n, d.opposite());
              }
            })
          }

          // first find all the possible routes
          search([], Phrase.かたたたき.name, c, null);

          if (c.x==11 && c.y==9) {
            console.log(`routes: ${routes.map(r => `[${r}]`).join(', ')}`);
          }

          // find the choking points, where all the routes pass
          const chokingRoute = [];
          for (let pos=0; pos<Phrase.かたたたき.length; pos++) {
            const possibilities = new Set<Cell>();
            routes.map(r => possibilities.add(r[pos]));
            if (possibilities.size==1) {
              let choke = [...possibilities][0];
              choke.setPhrase(Phrase.かたたたき);
              chokingRoute.push(choke);
            } else {
              chokingRoute.push(null);
            }
          }

          for (let pos=0; pos<Phrase.かたたたき.length; pos++) {
            const l = chokingRoute[pos-1];
            const c = chokingRoute[pos];
            const r = chokingRoute[pos+1];

            // if both sides of the choke is also choked, then we can close off other borders
            if (l!==null && c!==null && r!==null) {// !== to handle the index out of bounds (undefined) case correctly
              Direction.ALL.forEach(d => {
                const n = c.neighbor(d);
                let b = null;
                if (n==null)    return;
                if (n===l || n===r) b = Border.CONNECTED;
                if (l!==null && r!==null && n!==l && n!==r) b = Border.CLOSED;
                if (b) c.setBorder(d, b);
              })
            }

            // if we are a choking point, we can close off borders that have no possibilities of connection
            if (c!==null) {
              Direction.ALL.forEach(d => {
                const n = c.neighbor(d);
                if (!routes.find(r => r[pos-1]==n || r[pos+1]==n)) {
                  c.setBorder(d, Border.CLOSED);
                }
              })
            }
          }
        }

        // (c,o) are paird up as two letter phrase but we don't know what phrase they are
        const o = c.theOtherInPair();
        if (o && c.cannotBeHead()) {
          const p = Phrase.of(o.letter+c.letter);
          c.setPhrase(p);
          o.setPhrase(p);
        }

        // if two cells are inter-connected, and if it begins/ends with た or か, then
        // it has to be a two-letter phrase, so we can close off other borders.
        // WRONG: could be たき of かたたたき
        if (c.phrase==null && soleNonClosedDirection) {
          const n = c.neighbor(soleNonClosedDirection)!;

          if (c.letter=='た' || (c.letter=='か' && c.head!=YesNoMaybe.YES)) {
            Direction.allBut(soleNonClosedDirection.opposite()).map(d => {
              n.setBorder(d, Border.CLOSED);
            })
          }
        }

        // if all the cells you can be possibly connected to are た, then you have to be a part of かたたたき
        if (c.letter == 'た') {
          let cn = c.connectableNeighbors();
          if (!cn.some(c => c.letter != 'た')) {
            c.setPhrase(Phrase.かたたたき);
            if (cn.length==2) {
              // further, if you are only connected to た, then all of them are also a part of かたたたき
              cn.forEach(n => n.setPhrase(Phrase.かたたたき));
            }
          }
        }

        // if you are not a head, and all of the cells you can be connected to cannot be a head either, then
        // you have to be a part of かたたたき
        if (c.cannotBeHead() && c.connectableNeighbors().some(c => !c.cannotBeHead())==null) {
          c.setPhrase(Phrase.かたたたき);
        }

        c.updateHead();
      });
    });
    this.emitChange();
  }

  cell(x: number, y: number) {
    function inRange(s: number, v: number, e: number) {
      return s <= v && v < e;
    }

    if (inRange(0, x, this.X) && inRange(0, y, this.Y)) {
      return this.cells[x][y];
    } else {
      return null;
    }
  }
}
