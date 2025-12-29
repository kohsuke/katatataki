import Button from '@mui/material/Button';
import React, {useEffect, useState} from 'react';
import './Board.css';
import Game from '../game/Game.tsx';
import Legend from "./Legend.tsx";
import type BorderGrid from "./BorderGrid.tsx";
import Border from "../game/Border";
import {Typography} from "@mui/material";

export default function Board({ game }: { game: Game }) {
  // bridge the mutable world of game engine with the React world by using the dummy 'tick' as the sole state
  const [tick, setTick] = useState(0);
  const forceUpdate = () => {
    setTick(tick => tick + 1);
  }
  useEffect(() => game.subscribe(forceUpdate), [game]);

  const [patches, setPatches] = useState<string[]>([]);

  const gridStyle = {
    '--grid-cols': game.X - 1,
    '--grid-rows': game.Y - 1,
  } as React.CSSProperties;

  return <div className="puzzle-layout">
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
              const v = bg.get(x,y).next();
              bg.values[x][y] = v;
              setPatches([...patches, `game.borders.${bg===game.borders.h?'h':'v'}.values[${x}][${y}] = Border.${v.name.toUpperCase()};`]);
              forceUpdate();
            }

            if (isRowEven && isColEven) {
              const cell = game.cells[x][y];
              // not sure why, but this only works if data-version={tick} is there. that must be somehow
              // forcing a redraw
              elements.push(<div key={`${r}-${c}`} data-version={tick} className={`cell color-${cell.phrase?.name}`}>
                {cell.render()}
              </div>);
            } else if (!isRowEven && !isColEven) {
              elements.push(<div key={`${r}-${c}`} className="corner"></div>);
            } else {
              const bg = isRowEven ? game.borders.v : game.borders.h;

              const b = bg.get(x,y);
              const colorClass = b==Border.CONNECTED ? `color-${game.cells[x][y].phrase?.name}` : ''
              elements.push(<div key={`${r}-${c}`}
                                 data-version={tick}
                  className={`border-${isRowEven?'v':'h'} ${b.name} ${colorClass}`}
                  onClick={() => toggleBorder(bg,x,y)}></div>);
            }
          }
        }
        return elements;
        })()}
    </div>
    <div>
      <Button variant="contained" onClick={() => game.solve()}>Solve</Button>
      <Legend />
      <div>
        <Typography variant="h5">Patches</Typography>
        {patches.map((p,i) => <div key={i}>{p}</div>)}
      </div>
    </div>
  </div>;
};
