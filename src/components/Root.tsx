import type Game from "../game/Game.tsx";
import {useState} from "react";
import Board from "./Board.tsx";
import './Root.css';

export default function Root({games}: {games: Game[]}) {
  const [game,setGame] = useState(games[0]);

  function selectGame(name: string) {
    setGame(games.find(g => g.name == name)!);
  }

  return <div className="puzzle-root">
    <div className="selector">
      <label htmlFor="game-select">Select a puzzle:</label>
      <select id="game-select" value={game.name} onChange={ev => selectGame(ev.target.value)}>
        {games.map(g => <option key={g.name} value={g.name}>{g.name}</option>)}
      </select>
    </div>
    <Board game={game} />
  </div>;
}
