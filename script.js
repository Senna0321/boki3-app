/* =========================================================
   日商簿記3級 仕訳アプリ
   HTML / CSS / JavaScript only
   300問（基礎100・応用100・本試験100）を生成
========================================================= */

const LEVELS = {
  basic: {name:"基礎レベル", short:"基礎", count:100},
  advanced: {name:"応用レベル", short:"応用", count:100},
  exam: {name:"本試験レベル", short:"本試験", count:100}
};

const ACCOUNTS = [
  "現金","普通預金","当座預金","売掛金","買掛金","商品","仕入","売上",
  "受取手形","支払手形","電子記録債権","電子記録債務","貸倒引当金",
  "貸倒損失","備品","車両運搬具","建物","土地","減価償却累計額",
  "減価償却費","前払費用","未払費用","前受収益","未収収益",
  "支払利息","受取利息","支払手数料","受取手数料","給料","広告宣伝費",
  "通信費","水道光熱費","旅費交通費","消耗品費","地代家賃","保険料",
  "租税公課","雑費","資本金","引出金","仮払金","仮受金","現金過不足",
  "有価証券","有価証券評価損","有価証券売却益","有価証券売却損",
  "固定資産売却益","固定資産売却損","受取配当金","仕入割引","売上割引"
];

const yen = n => Number(n).toLocaleString("ja-JP");

function q(id, level, text, debit, credit, explanation){
  return {id, level, text, debit, credit, explanation};
}

let QUESTIONS = [];
let idCounter = 1;
function add(level, text, debit, credit, explanation){
  QUESTIONS.push(q(`Q${String(idCounter++).padStart(3,"0")}`, level, text, debit, credit, explanation));
}

const variants = [
  [1000, 1200, 1500, 1800, 2000],
  [2500, 3000, 3500, 4200, 5000],
  [6000, 7200, 8000, 9500, 10000],
  [12000, 15000, 18000, 20000, 25000],
  [30000, 35000, 40000, 48000, 50000],
  [60000, 75000, 80000, 90000, 100000],
  [120000, 150000, 180000, 200000, 250000],
  [300000, 350000, 400000, 450000, 500000],
];

function amountsFor(i){
  return variants[i % variants.length];
}

/* ---------- 基礎 100 ---------- */
const basicTemplates = [
  (a)=>[`現金で商品を仕入れた。代金は${yen(a)}円である。`, [["仕入",a]],[["現金",a]],"商品を仕入れたので仕入を借方、現金を貸方に記入します。"],
  (a)=>[`商品${yen(a)}円を現金で販売した。`, [["現金",a]],[["売上",a]],"商品を販売して現金を受け取ったので、現金が増加し売上が発生します。"],
  (a)=>[`商品${yen(a)}円を掛けで仕入れた。`, [["仕入",a]],[["買掛金",a]],"掛け仕入れでは仕入を借方、買掛金を貸方に記入します。"],
  (a)=>[`商品${yen(a)}円を掛けで販売した。`, [["売掛金",a]],[["売上",a]],"掛け売上では売掛金が増加し、売上が発生します。"],
  (a)=>[`売掛金${yen(a)}円を現金で回収した。`, [["現金",a]],[["売掛金",a]],"売掛金を回収すると現金が増加し、売掛金が減少します。"],
  (a)=>[`買掛金${yen(a)}円を現金で支払った。`, [["買掛金",a]],[["現金",a]],"買掛金を支払うと負債が減少し、現金も減少します。"],
  (a)=>[`給料${yen(a)}円を現金で支払った。`, [["給料",a]],[["現金",a]],"給料は費用なので借方、現金の減少を貸方に記入します。"],
  (a)=>[`家賃${yen(a)}円を現金で支払った。`, [["地代家賃",a]],[["現金",a]],"家賃は費用なので借方、現金の減少を貸方に記入します。"],
  (a)=>[`水道光熱費${yen(a)}円を現金で支払った。`, [["水道光熱費",a]],[["現金",a]],"水道光熱費は費用なので借方、現金の減少を貸方に記入します。"],
  (a)=>[`通信費${yen(a)}円を現金で支払った。`, [["通信費",a]],[["現金",a]],"通信費は費用なので借方、現金の減少を貸方に記入します。"],
  (a)=>[`広告宣伝費${yen(a)}円を現金で支払った。`, [["広告宣伝費",a]],[["現金",a]],"広告宣伝費は費用なので借方、現金の減少を貸方に記入します。"],
  (a)=>[`備品${yen(a)}円を現金で購入した。`, [["備品",a]],[["現金",a]],"備品は資産なので借方、現金の減少を貸方に記入します。"],
  (a)=>[`備品${yen(a)}円を掛けで購入した。`, [["備品",a]],[["未払費用",a]],"固定資産の購入で代金が未払いの場合、備品を借方、未払いの負債を貸方にします。"],
  (a)=>[`事業を始めるため、現金${yen(a)}円を元入れした。`, [["現金",a]],[["資本金",a]],"事業主からの元入れは資本金の増加として処理します。"],
  (a)=>[`事業主が生活費として現金${yen(a)}円を引き出した。`, [["引出金",a]],[["現金",a]],"事業主の私的な引出しは引出金を借方、現金を貸方にします。"],
  (a)=>[`普通預金に現金${yen(a)}円を預け入れた。`, [["普通預金",a]],[["現金",a]],"預金したので普通預金が増加し、手元現金が減少します。"],
  (a)=>[`普通預金から現金${yen(a)}円を引き出した。`, [["現金",a]],[["普通預金",a]],"預金から引き出すと現金が増加し、普通預金が減少します。"],
  (a)=>[`銀行から現金${yen(a)}円を借り入れた。`, [["現金",a]],[["借入金",a]],"借入によって現金が増加し、借入金という負債が増加します。"],
  (a)=>[`借入金${yen(a)}円を現金で返済した。`, [["借入金",a]],[["現金",a]],"借入金を返済すると負債と現金が減少します。"],
  (a)=>[`受取手数料${yen(a)}円を現金で受け取った。`, [["現金",a]],[["受取手数料",a]],"手数料を受け取ったので現金が増加し、収益が発生します。"],
  (a)=>[`支払手数料${yen(a)}円を現金で支払った。`, [["支払手数料",a]],[["現金",a]],"手数料を支払ったので費用が増加し、現金が減少します。"],
  (a)=>[`受取利息${yen(a)}円を現金で受け取った。`, [["現金",a]],[["受取利息",a]],"利息を受け取ったので現金が増加し、受取利息という収益が発生します。"],
  (a)=>[`支払利息${yen(a)}円を現金で支払った。`, [["支払利息",a]],[["現金",a]],"利息を支払ったので費用が増加し、現金が減少します。"],
  (a)=>[`商品券${yen(a)}円を受け取り商品を販売した。`, [["現金",a]],[["売上",a]],"この練習では受け取った商品券を現金同等として簡略処理しています。"],
  (a)=>[`消耗品${yen(a)}円を現金で購入した。`, [["消耗品費",a]],[["現金",a]],"消耗品の購入は費用として借方に記入します。"],
];

for(let i=0;i<100;i++){
  const t = basicTemplates[i % basicTemplates.length];
  const a = amountsFor(i)[i % 5];
  const [text,debit,credit,exp]=t(a);
  add("basic", text, debit, credit, exp);
}

/* ---------- 応用 100 ---------- */
const advancedTemplates = [
  (a)=>[`商品${yen(a)}円を掛けで仕入れ、引取運賃${yen(Math.round(a*.1))}円を現金で支払った。`, [["仕入",a+Math.round(a*.1)]],[["買掛金",a],["現金",Math.round(a*.1)]],"仕入に直接要した引取運賃は仕入原価に含めます。"],
  (a)=>[`売掛金${yen(a)}円を普通預金で回収した。`, [["普通預金",a]],[["売掛金",a]],"回収先が普通預金なので、普通預金が増加します。"],
  (a)=>[`買掛金${yen(a)}円を普通預金から振り込んで支払った。`, [["買掛金",a]],[["普通預金",a]],"買掛金を決済し、普通預金が減少します。"],
  (a)=>[`得意先から約束手形${yen(a)}円を受け取った。`, [["受取手形",a]],[["売掛金",a]],"売掛金の回収として約束手形を受け取った場合、受取手形を借方にします。"],
  (a)=>[`仕入先に約束手形${yen(a)}円を振り出した。`, [["買掛金",a]],[["支払手形",a]],"買掛金を手形で決済すると、買掛金が減少し支払手形が増加します。"],
  (a)=>[`受取手形${yen(a)}円が満期となり、当座預金に入金された。`, [["当座預金",a]],[["受取手形",a]],"満期到来した受取手形を当座預金で回収した処理です。"],
  (a)=>[`支払手形${yen(a)}円が満期となり、当座預金から支払われた。`, [["支払手形",a]],[["当座預金",a]],"支払手形の決済により手形債務と当座預金が減少します。"],
  (a)=>[`商品代金${yen(a)}円を電子記録債権として受け取った。`, [["電子記録債権",a]],[["売上",a]],"電子記録債権を受け取ったので資産が増加し、売上を計上します。"],
  (a)=>[`買掛金${yen(a)}円を電子記録債務の発生により支払った。`, [["買掛金",a]],[["電子記録債務",a]],"電子記録債務を負担して買掛金を決済する処理です。"],
  (a)=>[`備品${yen(a)}円を購入し、代金は翌月払いとした。`, [["備品",a]],[["未払費用",a]],"備品購入代金の未払いは負債として処理します。"],
  (a)=>[`保険料${yen(a)}円を現金で支払った。`, [["保険料",a]],[["現金",a]],"保険料は費用として借方に記入します。"],
  (a)=>[`広告料${yen(a)}円を普通預金から支払った。`, [["広告宣伝費",a]],[["普通預金",a]],"広告料は広告宣伝費、支払手段は普通預金です。"],
  (a)=>[`地代家賃${yen(a)}円を翌月払いとした。`, [["地代家賃",a]],[["未払費用",a]],"当期に発生した未払いの家賃は費用と未払費用を計上します。"],
  (a)=>[`受取利息${yen(a)}円が未収となった。`, [["未収収益",a]],[["受取利息",a]],"収益は発生しているが未受取なので未収収益を計上します。"],
  (a)=>[`次月分の家賃${yen(a)}円を前払いした。`, [["前払費用",a]],[["現金",a]],"翌期分を前払いした部分は資産である前払費用です。"],
  (a)=>[`取引先から次月分のサービス料${yen(a)}円を先に受け取った。`, [["現金",a]],[["前受収益",a]],"まだ提供していないサービスの対価は前受収益として負債にします。"],
  (a)=>[`期末に備品の減価償却費${yen(a)}円を計上した。`, [["減価償却費",a]],[["減価償却累計額",a]],"間接法では減価償却費を計上し、減価償却累計額を増加させます。"],
  (a)=>[`売掛金${yen(a)}円について、貸倒引当金を設定する。`, [["貸倒引当金繰入",a]],[["貸倒引当金",a]],"貸倒れに備えて費用を計上し、貸倒引当金を増加させます。"],
  (a)=>[`売掛金${yen(a)}円が回収不能となった。貸倒引当金は十分に設定済みである。`, [["貸倒引当金",a]],[["売掛金",a]],"設定済みの貸倒引当金を取り崩して売掛金を消します。"],
  (a)=>[`現金実査の結果、帳簿残高より${yen(a)}円少なかった。原因は不明である。`, [["現金過不足",a]],[["現金",a]],"原因不明の現金不足は現金過不足を借方に計上します。"],
  (a)=>[`現金実査の結果、帳簿残高より${yen(a)}円多かった。原因は不明である。`, [["現金",a]],[["現金過不足",a]],"原因不明の現金超過は現金過不足を貸方に計上します。"],
  (a)=>[`現金不足${yen(a)}円の原因が通信費の記帳漏れと判明した。`, [["通信費",a]],[["現金過不足",a]],"記帳漏れの原因が判明したので、正しい費用科目へ振り替えます。"],
  (a)=>[`現金過不足${yen(a)}円のうち、${yen(a)}円は売上代金の記帳漏れと判明した。`, [["現金過不足",a]],[["売上",a]],"現金超過の原因が売上記帳漏れなら売上を計上します。"],
  (a)=>[`所有する土地を取得価額${yen(a)}円で売却し、代金を現金で受け取った。`, [["現金",a]],[["土地",a]],"土地売却時は現金を受け取り、土地を帳簿から除きます。差額があれば売却損益となります。"],
  (a)=>[`備品を帳簿価額${yen(a)}円で売却し、代金を現金で受け取った。`, [["現金",a]],[["備品",a]],"帳簿価額と売却価額が同額の単純な処理です。"],
];

for(let i=0;i<100;i++){
  const t=advancedTemplates[i%advancedTemplates.length];
  const a=amountsFor(i+7)[(i+2)%5];
  const [text,debit,credit,exp]=t(a);
  add("advanced",text,debit,credit,exp);
}

/* ---------- 本試験レベル 100 ---------- */
const examTemplates = [
  (a)=>[`商品${yen(a)}円を仕入れ、代金のうち${yen(Math.round(a*.4))}円を現金で支払い、残額を掛けとした。`, [["仕入",a]],[["現金",Math.round(a*.4)],["買掛金",a-Math.round(a*.4)]],"一部現金・残額掛けの複合仕訳です。仕入総額を借方にし、支払手段を貸方に分けます。"],
  (a)=>[`商品${yen(a)}円を販売し、代金のうち${yen(Math.round(a*.6))}円を現金で受け取り、残額を掛けとした。`, [["現金",Math.round(a*.6)],["売掛金",a-Math.round(a*.6)]],[["売上",a]],"売上総額を貸方にし、受取方法を借方に分けます。"],
  (a)=>[`売掛金${yen(a)}円を回収し、振込手数料${yen(Math.round(a*.05))}円が差し引かれて普通預金に入金された。`, [["普通預金",a-Math.round(a*.05)],["支払手数料",Math.round(a*.05)]],[["売掛金",a]],"入金額と手数料を分け、売掛金全額を消します。"],
  (a)=>[`買掛金${yen(a)}円を決済するため普通預金から振り込み、振込手数料${yen(Math.round(a*.05))}円も支払った。`, [["買掛金",a],["支払手数料",Math.round(a*.05)]],[["普通預金",a+Math.round(a*.05)]],"買掛金の決済額と手数料を費用として分けます。"],
  (a)=>[`商品を${yen(a)}円で掛け仕入れし、引取運賃${yen(Math.round(a*.1))}円を現金で支払った。`, [["仕入",a+Math.round(a*.1)]],[["買掛金",a],["現金",Math.round(a*.1)]],"引取運賃は仕入原価に含めます。"],
  (a)=>[`期末に家賃${yen(a)}円が未払いであることが判明した。`, [["地代家賃",a]],[["未払費用",a]],"発生主義により当期の費用と未払費用を計上します。"],
  (a)=>[`期末に受取利息${yen(a)}円が未収であることが判明した。`, [["未収収益",a]],[["受取利息",a]],"当期に発生した未収の収益を計上します。"],
  (a)=>[`翌期分の保険料${yen(a)}円を当期に現金で支払った。`, [["前払費用",a]],[["現金",a]],"翌期分は前払費用という資産に振り替えます。"],
  (a)=>[`当期分の保険料${yen(a)}円を現金で支払った。`, [["保険料",a]],[["現金",a]],"当期の保険料は費用として処理します。"],
  (a)=>[`備品${yen(a)}円を購入し、代金は小切手を振り出して支払った。`, [["備品",a]],[["当座預金",a]],"小切手を振り出して支払う処理は当座預金の減少として扱います。"],
  (a)=>[`得意先から受け取った手形${yen(a)}円を銀行で割り引き、割引料${yen(Math.round(a*.05))}円を差し引かれた残額が当座預金に入金された。`, [["当座預金",a-Math.round(a*.05)],["手形売却損",Math.round(a*.05)]],[["受取手形",a]],"手形を割り引いた際の差額は手形売却損として処理する考え方を使います。"],
  (a)=>[`備品を現金${yen(a)}円で購入したが、後日${yen(Math.round(a*.1))}円の値引きを受け、現金で返金された。`, [["現金",Math.round(a*.1)]],[["備品",Math.round(a*.1)]],"購入後の値引きは購入した資産の取得価額を減額する処理として表します。"],
  (a)=>[`売上${yen(a)}円について${yen(Math.round(a*.1))}円の返品を受け、売掛金を減額した。`, [["売上",Math.round(a*.1)]],[["売掛金",Math.round(a*.1)]],"売上返品は売上を減額し、掛け売上なら売掛金を減額します。"],
  (a)=>[`仕入${yen(a)}円について${yen(Math.round(a*.1))}円の返品を行い、買掛金を減額した。`, [["買掛金",Math.round(a*.1)]],[["仕入",Math.round(a*.1)]],"仕入返品は仕入を減額し、買掛金を減額します。"],
  (a)=>[`株主から現金${yen(a)}円の出資を受け、事業を開始した。`, [["現金",a]],[["資本金",a]],"出資を受けた現金は資産の増加、資本金は純資産の増加です。"],
  (a)=>[`当期利益の配当として現金${yen(a)}円を支払った。`, [["繰越利益剰余金",a]],[["現金",a]],"利益剰余金から配当を行う場合、純資産を減少させます。"],
  (a)=>[`取得価額${yen(a)}円、減価償却累計額${yen(Math.round(a*.6))}円の備品を${yen(Math.round(a*.5))}円で現金売却した。`, [["現金",Math.round(a*.5)],["減価償却累計額",Math.round(a*.6)],["固定資産売却損",Math.round(a*.0)+Math.max(0,Math.round(a*.4)-Math.round(a*.5))]],[["備品",a]],"備品の帳簿価額を計算し、売却価額との差額を売却損益として処理します。"],
  (a)=>[`売掛金${yen(a)}円のうち${yen(Math.round(a*.1))}円が貸倒れた。貸倒引当金${yen(Math.round(a*.1))}円が設定済みである。`, [["貸倒引当金",Math.round(a*.1)]],[["売掛金",Math.round(a*.1)]],"貸倒引当金が設定済みなら、その範囲内で取り崩して処理します。"],
  (a)=>[`売掛金${yen(a)}円のうち${yen(Math.round(a*.1))}円が貸倒れた。貸倒引当金は設定されていない。`, [["貸倒損失",Math.round(a*.1)]],[["売掛金",Math.round(a*.1)]],"引当金がない場合は貸倒損失として費用処理します。"],
  (a)=>[`現金過不足${yen(a)}円について調査した結果、原因が判明しなかったため決算で処理する。`, [["雑費",a]],[["現金過不足",a]],"原因不明の現金過不足を決算で処理する練習です。"],
  (a)=>[`普通預金から現金${yen(a)}円を引き出し、そのうち${yen(Math.round(a*.3))}円を旅費交通費として支払った。`, [["現金",a-Math.round(a*.3)],["旅費交通費",Math.round(a*.3)]],[["普通預金",a]],"預金引出しと費用支払いを1つの複合仕訳で表します。"],
  (a)=>[`現金${yen(a)}円のうち、${yen(Math.round(a*.2))}円を広告宣伝費、残額を通信費として支払った。`, [["広告宣伝費",Math.round(a*.2)],["通信費",a-Math.round(a*.2)]],[["現金",a]],"1つの支払額を複数の費用科目に分ける複合仕訳です。"],
  (a)=>[`商品${yen(a)}円を販売し、代金は電子記録債権として受け取った。`, [["電子記録債権",a]],[["売上",a]],"電子記録債権は資産なので借方、売上は収益なので貸方です。"],
  (a)=>[`買掛金${yen(a)}円を電子記録債務に振り替えた。`, [["買掛金",a]],[["電子記録債務",a]],"買掛金を電子記録債務に振り替える処理です。"],
];

for(let i=0;i<100;i++){
  const t=examTemplates[i%examTemplates.length];
  const a=amountsFor(i+13)[(i+3)%5];
  let [text,debit,credit,exp]=t(a);
  // Remove zero-value lines to keep answer clean.
  debit=debit.filter(x=>x[1]!==0);
  credit=credit.filter(x=>x[1]!==0);
  add("exam",text,debit,credit,exp);
}

/* 勘定科目の誤りを補正するための追加科目 */
["借入金","貸倒引当金繰入","手形売却損","繰越利益剰余金"].forEach(a=>{
  if(!ACCOUNTS.includes(a)) ACCOUNTS.push(a);
});

const state = {
  screen:"home",
  selectedLevel:"basic",
  selectedCount:20,
  examQuestions:[],
  answers:[],
  currentIndex:0,
  lastFinished:false,
  lastResult:null
};

const $ = id => document.getElementById(id);
const levelName = level => LEVELS[level]?.name || level;

function showScreen(id){
  document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
  const target=$(id);
  if(!target)return;
  target.classList.add("active");
  state.screen=id;

  // 画面切り替え時は必ずページ最上部へ戻す
  // smoothだと一瞬だけ前のスクロール位置が表示されるため即時移動にする
  window.scrollTo(0,0);
  document.documentElement.scrollTop=0;
  document.body.scrollTop=0;
  requestAnimationFrame(()=>{
    window.scrollTo(0,0);
    document.documentElement.scrollTop=0;
    document.body.scrollTop=0;
  });
}

function loadStorage(){
  const history=JSON.parse(localStorage.getItem("boki3_history")||"[]");
  const wrong=JSON.parse(localStorage.getItem("boki3_wrong")||"[]");
  $("attemptCount").textContent=history.length;
  $("wrongCount").textContent=wrong.length;
  if(history.length){
    const avg=Math.round(history.reduce((s,x)=>s+x.accuracy,0)/history.length);
    $("lastAccuracy").textContent=avg;
  }
}

function selectLevel(level){
  state.selectedLevel=level;
  $("setupTitle").textContent=`${levelName(level)}の設定`;
  $("selectedLevelBox").innerHTML=`<b>${levelName(level)}</b><br><span>${LEVELS[level].count}問収録</span>`;
  showScreen("setupScreen");
}

function sampleQuestions(level,count){
  const pool=QUESTIONS.filter(x=>x.level===level);
  return shuffle(pool).slice(0,Math.min(count,pool.length));
}

function shuffle(arr){ return [...arr].sort(()=>Math.random()-.5); }

function startExam(customQuestions=null){
  state.examQuestions=customQuestions || sampleQuestions(state.selectedLevel,state.selectedCount);
  state.answers=state.examQuestions.map(()=>({debit:[null,null],credit:[null,null]}));
  state.currentIndex=0;
  state.lastFinished=false;
  $("examLevelLabel").textContent=customQuestions ? "前回間違えた問題" : levelName(state.selectedLevel);
  renderQuestion();
  renderQuestionButtons();
  showScreen("examScreen");
}


function renderQuestion(){
  const qn=state.examQuestions[state.currentIndex];
  if(!qn)return;
  $("questionCounter").textContent=`問題 ${state.currentIndex+1} / ${state.examQuestions.length}`;
  $("questionIdLabel").textContent=qn.id;
  $("questionLevelBadge").textContent=LEVELS[qn.level].short;
  $("questionText").textContent=qn.text;
  const body=$("entryBody");
  body.innerHTML="";
  for(let row=0;row<2;row++){
    const tr=document.createElement("tr");
    tr.innerHTML=`
      <td>${accountSelect("debit",row)}</td>
      <td><input class="amount-input" inputmode="numeric" data-side="debit" data-row="${row}" placeholder="金額"></td>
      <td>${accountSelect("credit",row)}</td>
      <td><input class="amount-input" inputmode="numeric" data-side="credit" data-row="${row}" placeholder="金額"></td>`;
    body.appendChild(tr);
  }
  restoreAnswer();
  body.querySelectorAll("select,input").forEach(el=>{
    el.addEventListener("change",saveCurrentAnswer);
    el.addEventListener("input",saveCurrentAnswer);
  });
  $("prevBtn").disabled=state.currentIndex===0;
  $("nextBtn").textContent=state.currentIndex===state.examQuestions.length-1 ? "最後の問題 →" : "次の問題 →";
  const progress=((state.currentIndex+1)/state.examQuestions.length)*100;
  $("progressFill").style.width=progress+"%";
  renderQuestionButtons();
}

function accountSelect(side,row){
  const opts=["<option value=\"\">勘定科目を選択</option>",...ACCOUNTS.map(a=>`<option value="${escapeHtml(a)}">${escapeHtml(a)}</option>`)];
  return `<select data-side="${side}" data-row="${row}">${opts.join("")}</select>`;
}

function restoreAnswer(){
  const ans=state.answers[state.currentIndex];
  document.querySelectorAll("#entryBody select").forEach(el=>{
    const side=el.dataset.side,row=Number(el.dataset.row);
    el.value=ans[side][row]?.account||"";
  });
  document.querySelectorAll("#entryBody input").forEach(el=>{
    const side=el.dataset.side,row=Number(el.dataset.row);
    el.value=ans[side][row]?.amount ? String(ans[side][row].amount) : "";
  });
}

function saveCurrentAnswer(){
  const ans={debit:[null,null],credit:[null,null]};
  document.querySelectorAll("#entryBody select").forEach(el=>{
    const side=el.dataset.side,row=Number(el.dataset.row);
    ans[side][row]=ans[side][row]||{};
    ans[side][row].account=el.value||"";
  });
  document.querySelectorAll("#entryBody input").forEach(el=>{
    const side=el.dataset.side,row=Number(el.dataset.row);
    ans[side][row]=ans[side][row]||{};
    ans[side][row].amount=parseAmount(el.value);
  });
  state.answers[state.currentIndex]=ans;
  renderQuestionButtons();
}

function parseAmount(v){
  const n=String(v||"").replace(/[,\s円]/g,"");
  if(!n)return 0;
  const num=Number(n);
  return Number.isFinite(num)?num:0;
}

function hasAnswer(ans){
  return ["debit","credit"].some(side=>ans[side].some(x=>x && x.account && x.amount));
}

function renderQuestionButtons(){
  const box=$("questionButtons");
  if(!box)return;
  box.innerHTML="";
  state.examQuestions.forEach((q,i)=>{
    const b=document.createElement("button");
    b.textContent=i+1;
    if(hasAnswer(state.answers[i])) b.classList.add("answered");
    if(i===state.currentIndex) b.classList.add("current");
    b.title=q.text;
    b.addEventListener("click",()=>{saveCurrentAnswer();state.currentIndex=i;renderQuestion();});
    box.appendChild(b);
  });
}

function openConfirm(auto=false){
  saveCurrentAnswer();
  const answered=state.answers.filter(hasAnswer).length;
  const total=state.answers.length;
  $("confirmAnswered").textContent=answered;
  $("confirmUnanswered").textContent=total-answered;
  $("confirmText").textContent=total-answered>0?`未回答が${total-answered}問あります。このまま採点できます。`:"すべて回答済みです。採点へ進みます。";
  $("confirmCancel").style.display="inline-block";
  showScreen("confirmScreen");
}

function normalizeEntries(entries){
  return entries
    .filter(x=>x && x.account && Number(x.amount)>0)
    .map(x=>({account:x.account,amount:Number(x.amount)}))
    .sort((a,b)=>a.account.localeCompare(b.account,"ja")||a.amount-b.amount);
}

function isCorrect(user,correct){
  const a=normalizeEntries(user),b=normalizeEntries(correct);
  return JSON.stringify(a)===JSON.stringify(b);
}

function finishExam(){
  state.lastFinished=true;
  const details=state.examQuestions.map((q,i)=>{
    const correct=isCorrect(state.answers[i].debit,q.debit)&&isCorrect(state.answers[i].credit,q.credit);
    const blank=!hasAnswer(state.answers[i]);
    return {q,user:state.answers[i],correct,blank};
  });
  const correctCount=details.filter(x=>x.correct).length;
  const wrongCount=details.filter(x=>!x.correct&&!x.blank).length;
  const blankCount=details.filter(x=>x.blank).length;
  const accuracy=Math.round(correctCount/details.length*100);
  state.lastResult={details,correctCount,wrongCount,blankCount,accuracy,level:state.selectedLevel,date:new Date().toISOString()};
  saveResult(state.lastResult);
  renderResult();
  showScreen("resultScreen");
}

function saveResult(result){
  const history=JSON.parse(localStorage.getItem("boki3_history")||"[]");
  history.unshift({
    date:result.date,level:result.level,total:result.details.length,
    correct:result.correctCount,wrong:result.wrongCount,blank:result.blankCount,accuracy:result.accuracy
  });
  localStorage.setItem("boki3_history",JSON.stringify(history.slice(0,30)));

  const previousWrong=result.details.filter(x=>!x.correct).map(x=>x.q.id);
  localStorage.setItem("boki3_wrong",JSON.stringify(previousWrong));
  loadStorage();
}

function renderResult(){
  const r=state.lastResult;
  $("scorePercent").textContent=r.accuracy+"%";
  $("scoreText").textContent=`${r.correctCount} / ${r.details.length}`;
  $("resultCorrect").textContent=r.correctCount;
  $("resultWrong").textContent=r.wrongCount;
  $("resultBlank").textContent=r.blankCount;
  $("resultAccuracy").textContent=r.accuracy+"%";
  $("resultMessage").textContent=r.accuracy>=70
    ?"今回の結果を保存しました。間違えた問題を復習して仕訳力を伸ばしましょう。"
    :"今回の結果を保存しました。解説を確認して、もう一度挑戦してみましょう。";
  const list=$("resultList");list.innerHTML="";
  r.details.forEach((d,i)=>{
    const div=document.createElement("div");
    div.className=`result-item ${d.correct?"correct":d.blank?"blank":"wrong"}`;
    const status=d.correct?"🟢 正解":d.blank?"⚪ 未回答":"🔴 不正解";
    div.innerHTML=`
      <div class="result-item-head"><b>問題 ${i+1}　${d.q.id}</b><span class="status">${status}</span></div>
      <p>${escapeHtml(d.q.text)}</p>
      <div class="explanation"><b>💡 解説：</b>${escapeHtml(d.q.explanation)}</div>
      <div class="explanation" style="margin-top:7px"><b>正解：</b>${formatEntries(d.q.debit)} ｜ ${formatEntries(d.q.credit)}</div>`;
    list.appendChild(div);
  });
}

function formatEntries(entries){
  return entries.map(x=>`${x.account} ${yen(x.amount)}円`).join("、");
}

function retry(){
  if(!state.lastResult)return;
  startExam(state.lastResult.details.map(x=>x.q));
}

function openSearch(){
  showScreen("searchScreen");
  renderSearch();
}
function renderSearch(){
  const word=$("searchInput").value.trim().toLowerCase();
  const level=$("searchLevel").value;
  const results=QUESTIONS.filter(q=>{
    const okLevel=level==="all"||q.level===level;
    const text=(q.text+" "+q.explanation+" "+q.debit.map(x=>x[0]).join(" ")+" "+q.credit.map(x=>x[0]).join(" ")).toLowerCase();
    return okLevel && (!word||text.includes(word));
  }).slice(0,100);
  const box=$("searchResults");
  if(!results.length){box.innerHTML=`<div class="empty">条件に一致する問題がありません。</div>`;return;}
  box.innerHTML=results.map(q=>`
    <div class="search-result-item">
      <b>${q.id}　${levelName(q.level)}</b>
      <p>${escapeHtml(q.text)}</p>
      <button data-qid="${q.id}">この問題を解く</button>
    </div>`).join("");
  box.querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{
    const q=QUESTIONS.find(x=>x.id===b.dataset.qid);
    startExam([q]);
  }));
}

function renderHistory(){
  const history=JSON.parse(localStorage.getItem("boki3_history")||"[]");
  if(!history.length){
    $("historyContent").innerHTML=`<div class="empty">まだ学習履歴がありません。まず問題を解いてみましょう。</div>
    <div class="history-tools"><button class="danger-outline" id="resetHistoryBtn">🗑️ 学習履歴をリセット</button></div>`;
    bindResetHistory();
    return;
  }
  const avg=Math.round(history.reduce((s,x)=>s+x.accuracy,0)/history.length);
  const total=history.reduce((s,x)=>s+x.total,0);
  $("historyContent").innerHTML=`
    <div class="history-summary">
      <div class="history-card"><span>学習回数</span><b>${history.length}</b></div>
      <div class="history-card"><span>平均正答率</span><b>${avg}%</b></div>
      <div class="history-card"><span>解答した問題数</span><b>${total}</b></div>
    </div>
    <div class="history-tools">
      <button class="danger-outline" id="resetHistoryBtn">🗑️ 学習履歴をリセット</button>
    </div>
    <div class="panel">
      <div class="panel-title"><span>📖</span><h3>最近の学習履歴</h3></div>
      <div style="overflow:auto">
      <table class="history-table">
        <thead><tr><th>日時</th><th>レベル</th><th>問題数</th><th>正解</th><th>正答率</th></tr></thead>
        <tbody>
        ${history.map(x=>`<tr><td>${new Date(x.date).toLocaleString("ja-JP")}</td><td>${levelName(x.level)}</td><td>${x.total}</td><td>${x.correct}</td><td>${x.accuracy}%</td></tr>`).join("")}
        </tbody>
      </table></div>
    </div>`;
}

function bindResetHistory(){
  const btn=$("resetHistoryBtn");
  if(!btn)return;
  btn.addEventListener("click",()=>{
    if(confirm("学習履歴と前回間違えた問題をすべてリセットしますか？")){
      localStorage.removeItem("boki3_history");
      localStorage.removeItem("boki3_wrong");
      loadStorage();
      renderHistory();
    }
  });
}

function openWrongPractice(){
  const ids=JSON.parse(localStorage.getItem("boki3_wrong")||"[]");
  const qs=ids.map(id=>QUESTIONS.find(q=>q.id===id)).filter(Boolean);
  if(!qs.length){
    alert("前回間違えた問題はありません。まず問題を解いてみましょう。");
    return;
  }
  state.selectedLevel=qs[0].level;
  startExam(qs);
}

function escapeHtml(str){
  return String(str).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
}

/* ---------- Events ---------- */
document.querySelectorAll(".level-card").forEach(b=>b.addEventListener("click",()=>selectLevel(b.dataset.level)));

document.querySelectorAll("#countChoices button").forEach(b=>{
  b.addEventListener("click",()=>{
    document.querySelectorAll("#countChoices button").forEach(x=>x.classList.remove("selected"));
    b.classList.add("selected");
    state.selectedCount=Number(b.dataset.count);
  });
});

$("startExamBtn").addEventListener("click",()=>startExam());
$("wrongPracticeBtn").addEventListener("click",openWrongPractice);
$("searchBtn").addEventListener("click",openSearch);
$("historyBtn").addEventListener("click",()=>{renderHistory();showScreen("historyScreen");});
$("infoBtn").addEventListener("click",()=>showScreen("infoScreen"));
$("homeBtn").addEventListener("click",()=>{loadStorage();showScreen("homeScreen");});
$("setupBack").addEventListener("click",()=>showScreen("homeScreen"));
$("searchBack").addEventListener("click",()=>showScreen("homeScreen"));
$("historyBack").addEventListener("click",()=>showScreen("homeScreen"));
$("infoBack").addEventListener("click",()=>showScreen("homeScreen"));
$("prevBtn").addEventListener("click",()=>{saveCurrentAnswer();if(state.currentIndex>0){state.currentIndex--;renderQuestion();}});
$("nextBtn").addEventListener("click",()=>{saveCurrentAnswer();if(state.currentIndex<state.examQuestions.length-1){state.currentIndex++;renderQuestion();}});
$("finishBtn").addEventListener("click",()=>openConfirm(false));
$("confirmCancel").addEventListener("click",()=>showScreen("examScreen"));
$("confirmFinish").addEventListener("click",finishExam);
$("retryBtn").addEventListener("click",retry);
$("resultHomeBtn").addEventListener("click",()=>{loadStorage();showScreen("homeScreen");});
$("searchInput").addEventListener("input",renderSearch);
$("searchLevel").addEventListener("change",renderSearch);

loadStorage();
$("totalQuestions").textContent=QUESTIONS.length;
