import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Board from './components/Board.tsx'
import Game from './game/Game.tsx'
import Border from "./game/Border.tsx";

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

const 上級1 = translate(`
TTKTK= TT=TTT K=TTK=
TTTT=T KTKTTT KTTKTT
=A=TTT T=T=KK =KTTT=
KKT=TK =TTTTT TTT=KT
TTTT=K TT=KTT =TTKTT
AK=TTT KTTATT TK=KT=
T=AKK= KT=KKT =TTTTT
TTTTTT TTTTA= K=TKKA
KKTTT= KKTTKT TATKTT
ATKKTT =T=T=T TTTK=T
KAKT=T TTTKTT =TKKT=
TTTTTK K=KT=T TT=TTT
TT=TTK TTTTTK =KKKTT
=TK=T= TT=KTT KATTT=
`)

const game = new Game(上級1);
game.borders.h.values[16][11] = Border.CLOSED;
game.borders.v.values[0][1] = Border.CLOSED;
game.borders.h.values[9][0] = Border.CLOSED;
game.borders.v.values[14][0] = Border.CLOSED;
game.borders.h.values[15][0] = Border.CLOSED;
game.borders.h.values[11][9] = Border.CLOSED;
game.borders.v.values[10][9] = Border.CLOSED;
game.borders.v.values[12][9] = Border.CLOSED;
game.borders.h.values[12][8] = Border.CLOSED;
game.borders.v.values[7][9] = Border.CLOSED;
game.borders.h.values[8][8] = Border.CLOSED;
game.borders.v.values[10][5] = Border.CLOSED;
game.borders.h.values[3][9] = Border.CLOSED;
game.borders.v.values[2][8] = Border.CLOSED;
game.borders.h.values[4][7] = Border.CLOSED;
game.borders.h.values[6][4] = Border.CLOSED;
game.borders.h.values[5][5] = Border.CLOSED;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Board game={game} />
  </StrictMode>,
)
