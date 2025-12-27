import React,{useState,useEffect} from 'react';
import './Board.css';
import Game from '../game/Game.tsx';
import ActionButton from './Button.tsx';
import Legend from "./Legend.tsx";
import type BorderGrid from "./BorderGrid.tsx";

export default function Board({ game }: { game: Game }) {
  // bridge the mutable world of game engine with the React world by using the dummy 'tick' as the sole state
  const [tick, setTick] = useState(0);
  const forceUpdate = () => {
    setTick(tick => tick + 1);
  }
  useEffect(() => game.subscribe(forceUpdate), [game]);

  const gridStyle = {
    '--grid-cols': game.X - 1,
    '--grid-rows': game.Y - 1,
  } as React.CSSProperties;

  return (
    <div className="puzzle-layout">
      <div className="puzzle-board" style={gridStyle}>
        {(()=> {
          const elements = [];

          for (let r = 0; r < game.Y*2-1; r++) {
            for (let c = 0; c < game.X*2-1; c++) {
              const x = Math.floor(c/2);
              const y = Math.floor(r/2);
              const isRowEven = r % 2 === 0;
              const isColEven = c % 2 === 0;

              function toggleBorder(bg: BorderGrid, x: number, y: number) {
                bg.values[x][y] = bg.get(x,y).next();
                forceUpdate();
              }

              if (isRowEven && isColEven) {
                const cell = game.cells[x][y];
                // not sure why, but this only works if data-version={tick} is there. that must be somehow
                // forcing a redraw
                elements.push(<div key={`${r}-${c}`} data-version={tick} className={`cell color-${cell.phrase?.name}`}>
                  {cell.render()}
                </div>);
              } else if (isRowEven && !isColEven) {
                const bv = game.borders.v;
                elements.push(<div key={`${r}-${c}`} data-version={tick} className={`border-v ${bv.get(x,y).name}`} onClick={() => toggleBorder(bv,x,y)}></div>);
              } else if (!isRowEven && isColEven) {
                const bh = game.borders.h;
                elements.push(<div key={`${r}-${c}`} data-version={tick} className={`border-h ${bh.get(x,y).name}`} onClick={() => toggleBorder(bh,x,y)}></div>);
              } else {
                elements.push(<div key={`${r}-${c}`} className="corner"></div>);
              }
            }
          }
          return elements;
          })()}
      </div>
      <div>
        <ActionButton label="Solve" onAction={() => game.solve()} />
        <Legend />
      </div>
    </div>
  );
};
