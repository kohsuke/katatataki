import Phrase from "../game/Phrase.tsx";
import './Legend.css';

export default function Legend() {
  return <aside className="game-legend">
    <h3>Legend</h3>
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
