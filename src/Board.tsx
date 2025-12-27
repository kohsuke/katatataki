import React,{useState,useEffect} from 'react';
import './Board.css';
import Game from './Game.tsx';
import ActionButton from './components/button.tsx';

export default function Board({ game }: { game: Game }) {
  // 1. A bit of "dummy" state just to force React to re-render
  const [tick, setTick] = useState(0);
  const forceUpdate = () => {
    setTick(tick => tick + 1);
  }

  // 2. The Bridge
  useEffect(() => game.subscribe(forceUpdate), [game]);
  // If we have 3 cells, we have 2 borders between them.
  // The CSS 'repeat' logic handles the N-1 borders automatically.
  const gridStyle = {
    '--grid-cols': game.X - 1,
    '--grid-rows': game.Y - 1,
  };

  return (
    <>
      <div className="puzzle-board" style={gridStyle}>
        {(()=> {
          const elements = [];

          for (let r = 0; r < game.Y*2-1; r++) {
            for (let c = 0; c < game.X*2-1; c++) {

              const isRowEven = r % 2 === 0;
              const isColEven = c % 2 === 0;

              if (isRowEven && isColEven) {
                const cell = game.cells[c/2][r/2];
                // not sure why, but this only works if data-version={tick} is there. that must be somehow
                // forcing a redraw
                elements.push(<div key={`${r}-${c}`} data-version={tick} className="cell" onClick={()=>cell.click()}>
                  {cell.render()}
                </div>);
              } else if (isRowEven && !isColEven) {
                elements.push(<div key={`${r}-${c}`} className="border-v dotted"></div>);
              } else if (!isRowEven && isColEven) {
                elements.push(<div key={`${r}-${c}`} className="border-h solid"></div>);
              } else {
                elements.push(<div key={`${r}-${c}`} className="corner"></div>);
              }
            }
          }
          return elements;
          })()}
      </div>
      <ActionButton label="Solve" onAction={() => {game.cells[0][0].click()}} />
    </>
  );
};
