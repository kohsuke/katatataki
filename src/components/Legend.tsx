import Phrase from "../game/Phrase.tsx";
import './Legend.css';
import {Typography} from "@mui/material";

export default function Legend() {
  return <aside className="game-legend">
    <Typography variant="h5">Legend</Typography>
    <ul>
      {(() => {
        return Phrase.ALL.map(p => {
          return <li key={p.name}>
            <span className={`swatch color-${p.name}`}></span>
            <span className="label">{p.name}</span>
          </li>
        })
      })()}
    </ul>
  </aside>;
}
