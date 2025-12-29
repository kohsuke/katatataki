import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import Game from './game/Game.tsx'
import Border from "./game/Border.tsx";
import Root from "./components/Root.tsx";

function translate(s: string) {
  const mapping = {'T':'た', '=':'＝', 'K':'き', 'A':'か', ' ':'' }
  s = s.trim().replaceAll('\n\n', '\n');
  for (const [k,v] of Object.entries(mapping)) {
    s = s.replaceAll(k, v);
  }

  return s.split('\n');
}

const factories = [
  () =>
    new Game('初級1', [
      "きたきたた＝",
      "た＝きかたき",
      "かたききたた",
      "たたかたたた",
      "き＝たかかた",
      "かきたたき＝"
    ]),
  () => {
    const game = new Game('中級1', translate(`
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
`));
    game.borders.v.values[0][5] = Border.CLOSED;
    game.borders.v.values[0][9] = Border.CLOSED;
    game.borders.h.values[3][9] = Border.CLOSED;
    game.borders.h.values[9][9] = Border.CLOSED;
    game.borders.h.values[8][10] = Border.CLOSED;
    return game;
  },
  () => {
    const game = new Game('上級1',translate(`
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
`));
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
    return game;
  },
  () => {
    const game = new Game('上級2', translate(`
=TKATT TKTTT= KTTKTT
TTTK=T TAKATT K=T=TK
AKTKTT T=T=TK TTTKT=
T=T=AT KTTTTK TAT=TT
TKTKKT ATTTKK =TATAT
TKTT=T T=A=TT TTTTKK
T=T=TT KKKKT= KTTKTK
TTKKTT =TTTTT AA=T=K
AAKATT TT=K=T K=KTTT
KTTTK= TKTTTK ATTTKT
KT=TTT TKTTTK KT=T=T
=TTKKA TT=K=T TTKATT
TT=T=T KAKTAA T=KTTK
TTKKTT =TTTKT TKKAT=
`));
    game.borders.v.values[0][12] = Border.CLOSED;
    game.borders.v.values[15][1] = Border.CLOSED;
    game.borders.h.values[10][1] = Border.CLOSED;
    game.borders.v.values[3][5] = Border.CLOSED;
    game.borders.h.values[2][4] = Border.CLOSED;
    game.borders.v.values[1][11] = Border.CLOSED;
    game.borders.v.values[15][10] = Border.CLOSED;
    game.borders.h.values[15][9] = Border.CONNECTED;
    game.borders.v.values[13][9] = Border.CLOSED;
    game.borders.v.values[10][9] = Border.CLOSED;
    game.borders.v.values[4][10] = Border.CLOSED;
    return game;
  },
  () => {
    const game = new Game('超上級', translate(`
=TTTTK AT=KAT =KTAK= TKTA
KTKK=K TTKTTT T=TT=T T=TK
TTTTKT TT=TK= TTTTKK TTT=
TKT=KT TTTT=T T=KTT= T=TK
T=TTTT TT=KTT KT=KTT KTT=
KKT=KT =KTKTK =TTT=T TTTT
T=TKK= TT=TT= TTKTKT AK=T
TTTTTK TAT=TT TK=TTA =TKT
TK=TAT KTTKTK T=TKT= TT=T

=TTT=T TT=KKA KTT=TT TKTK
ATTKKT T=ATKK =TTTT= ATT=
KTT=T= TKTTTT TK=TTT KT=T
T=ATTK TAKT=T K=TTTT KKTT
AKTKTT TKTTTT KTTTT= KTTT
T=TT=T TKTK=T =KTK=K TT=K
TKTKK= T=TTTK ATTTT= TTKT
TTTTTK TTT=TT =KT=TT TTKT
K=KATT =T=KTT T=TT=K TK=T
`));
    game.borders.h.values[8][16] = Border.CLOSED;
    game.borders.h.values[8][14] = Border.CLOSED;
    game.borders.v.values[16][8] = Border.CLOSED;
    game.borders.v.values[14][9] = Border.CLOSED;
    game.borders.v.values[19][2] = Border.CLOSED;
    game.borders.h.values[12][8] = Border.CLOSED;
    game.borders.v.values[10][3] = Border.CLOSED;
    game.borders.h.values[12][0] = Border.CLOSED;
    game.borders.v.values[9][7] = Border.CLOSED;
    game.borders.h.values[13][1] = Border.CLOSED;
    game.borders.h.values[13][5] = Border.CLOSED;
    return game;
  }
];





createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root games={factories.map(f => f())} />
  </StrictMode>,
)
