import type Game from "../game/Game.tsx";
import {useState} from "react";
import Board from "./Board.tsx";
import './Root.css';
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";

export default function Root({games}: {games: Game[]}) {
  const [game,setGame] = useState(games[0]);

  function selectGame(name: string) {
    setGame(games.find(g => g.name == name)!);
  }

  return <div className="puzzle-root">
    <div className="selector">
      <FormControl sx={{ width: 300 }}>
        <InputLabel id="game-label">Select a puzzle</InputLabel>
        <Select
          labelId="game-label"
          id="game-select"
          value={game.name}
          label="Select a puzzle"
          onChange={ev => selectGame(ev.target.value)}
        >
          {games.map(g => <MenuItem key={g.name} value={g.name}>{g.name}</MenuItem>)}
        </Select>
      </FormControl>
    </div>
    <Board game={game} />
  </div>;
}
