import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Board from './components/Board.tsx'
import Game from './game/Game.tsx'

function translate(s: string) {
  const mapping = {'T':'た', '=':'＝', 'K':'き', 'A':'か', ' ':'' }
  s = s.trim();
  for (const [k,v] of Object.entries(mapping)) {
    s = s.replaceAll(k, v);
  }

  return s.split('\n');
}

const 初級1 = [
  "きたきたた＝",
  "た＝きかたき",
  "かたききたた",
  "たたかたたた",
  "き＝たかかた",
  "かきたたき＝"
];

const 中級1 = translate(`
TT=TTT TKTKTT
=TKKT= TKTA=T
KATT=T TTT=TA
KKTKT= TAKKTK
TATKTA KTAATK
TTATAA KKTTTK
TKTTAA TTTKAT
=TTKTTT =KT=T
TTKTTK =T=TTT
ATKT=K TTT=K=
K=TTT= T=TTTT
TTT=KT TKTK=T
`);


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Board game={new Game(中級1)} />
  </StrictMode>,
)
