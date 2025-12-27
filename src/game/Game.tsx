import Cell from './Cell.tsx';
import Border from './Border.tsx';
import Direction from "./Direction.tsx";
import Phrase from "./Phrase.tsx";

export default class Game {
  public readonly X: number;
  public readonly Y: number;

  public readonly cells: Cell[][];
  public readonly borders = {
    /** vertical border. v[0][0] is the right border of cells[0][0] */
    v: [] as Border[][],
    /** horizontal border. h[0][0] is the bottom border of cells[0][0] */
    h: [] as Border[][]
};

  private readonly listeners: Set<() => void> = new Set();

  constructor(input: string[]) {
    this.X = input[0].length;
    this.Y = input.length;
    this.listeners = new Set();
    this.cells = [];
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
        this.borders.v.push(bv);
      }
      this.borders.h.push(bh);
    }
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
              if (c.phrase != null) n.phrase = c.phrase;
              if (n.phrase != null) c.phrase = n.phrase;
            }
          }
        });

        (() => {
          const soleNonClosedNeighbor = (() => {
            const x = Direction.ALL.filter(d => c.getBorder(d) != Border.CLOSED);
            return x.length == 1 ? x[0] : null;
          })();
          if (soleNonClosedNeighbor) {// three borders are closed
            const n = c.neighbor(soleNonClosedNeighbor)!;
            c.setBorder(soleNonClosedNeighbor, Border.CONNECTED);

            if (c.letter == 'き' && c.phrase == null && n.letter == 'か') {
              c.phrase = Phrase.かき;
            }
          }
        })();

        (() => {
          const soleConnectedNeighbor = (() => {
            const x = Direction.ALL.filter(d => c.getBorder(d) == Border.CONNECTED);
            return x.length == 1 ? x[0] : null;
          })();
          if (soleConnectedNeighbor) {
            const n = c.neighbor(soleConnectedNeighbor)!;

            if (c.phrase?.length == 2) {
              // if we are a part of the length 2 phrase like かき, then we will only have one neighbor
              Direction.allBut(soleConnectedNeighbor).map(d => {
                c.setBorder(d, Border.CLOSED)
              });
            }
          }
        })();


        if (c.phrase?.length==2 && c.letter==c.phrase?.head) {
          c.head = true;
        }


        // かたたたき backtrack search
        if (c.phrase==Phrase.かたたたき && c.head) {
          let routes = [[c]];

          // breadth first search
          for (let remaining=Phrase.かたたたき.name.substring(1); remaining.length>0; remaining=remaining.substring(1)) {
            const next: Cell[][] = [];
            routes.forEach(route => {
              const head = route.at(-1)!;
              Direction.ALL.forEach(d => {
                const n = head.neighbor(d);
                if (head.getBorder(d)!=Border.CLOSED && n && n!=head && n.letter==remaining.charAt(0)) {
                  next.push([...route, n]);
                }
              })
            });
            if (next.length==1) {

            }

            routes = next;
          }

          /**
           * Unit of backtrack search.
           *
           * @param remaining   remaining letters to find
           * @param cell        cell we are visiting to evaluate the match with `remaining`
           * @param from        the direction (from the `cell` PoV) the search came from
           */
          function search(head: Cell[], remaining: string, c: Cell, from: Direction|null) {
            if (remaining=="") {
              // found the whole match
              routes.push(head);
              return;
            }
            if (c.letter!=remaining.charAt(0)) {
              // not a match
              return;
            }

            Direction.allBut(from).map(d => {
              const n = c.neighbor(d);
              if (n) {
                search([...head, c],remaining.substring(1), n, d);
              }
            })
          }

          search([], Phrase.かたたたき.name, c, null);
        }
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
