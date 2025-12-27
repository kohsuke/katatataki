import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Board from './components/Board.tsx'
import Game from './game/Game.tsx'

const 初級1 = [
"きたきたた＝",
"た＝きかたき",
"かたききたた",
"たたかたたた",
"き＝たかかた",
"かきたたき＝"
];

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Board game={new Game(初級1)} />
  </StrictMode>,
)
