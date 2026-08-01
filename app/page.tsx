"use client";

import { useEffect, useMemo, useState } from "react";
import quizData from "@/data/quiz.json";

type AtlasVisual = { board: number; index: number };
type Seed = {
  id: string;
  name: string;
  scientific: string;
  region: string;
  travel: "風" | "水" | "動物" | "重力";
  tag: string;
  fact: string;
  detail: string;
  size: string;
  visual: AtlasVisual;
  caution?: string;
};

const tabs = ["出發任務", "世界圖鑑", "種子祕密", "手作工坊", "闖關挑戰", "探索資源"];

const seeds: Seed[] = [
  { id: "coco", name: "海椰子", scientific: "Lodoicea maldivica", region: "塞席爾", travel: "重力", tag: "世界最大", fact: "一顆可重達約 25 公斤。", detail: "巨大的種子內藏豐富養分，讓幼苗在陰暗森林底層也有機會慢慢長大。", size: "最長約 50 公分", visual: { board: 1, index: 0 } },
  { id: "rosary", name: "雞母珠", scientific: "Abrus precatorius", region: "熱帶地區", travel: "動物", tag: "紅黑警戒", fact: "亮麗外表是一種警告。", detail: "紅黑種子非常醒目，但含有毒性；只可看圖片學習，不可觸摸、串珠或放入口中。", size: "約 5–8 毫米", visual: { board: 1, index: 1 }, caution: "有毒，禁止手作與食用" },
  { id: "maple", name: "楓樹翅果", scientific: "Acer spp.", region: "北半球溫帶", travel: "風", tag: "旋翼飛行", fact: "落下時像直升機旋轉。", detail: "薄翅增加空氣阻力、減慢下降，風就有更多時間把種子送離母樹。", size: "約 2–5 公分", visual: { board: 1, index: 2 } },
  { id: "dandelion", name: "蒲公英瘦果", scientific: "Taraxacum spp.", region: "世界多地", travel: "風", tag: "降落傘", fact: "冠毛會張成輕盈小傘。", detail: "細毛增加受風面積，讓很輕的果實在空中停留更久。", size: "果實約 3–5 毫米", visual: { board: 1, index: 3 } },
  { id: "victoria", name: "王蓮果實", scientific: "Victoria amazonica", region: "南美洲亞馬遜", travel: "水", tag: "水上育兒房", fact: "果實藏著許多圓形種子。", detail: "水生植物的果實成熟後釋出種子，種子可在水環境中展開下一段生命旅程。", size: "種子約 1 公分", visual: { board: 2, index: 0 } },
  { id: "chestnut", name: "甜栗", scientific: "Castanea sativa", region: "歐洲與西亞", travel: "動物", tag: "養分寶庫", fact: "厚實子葉儲存大量澱粉。", detail: "松鼠等動物會搬運並埋藏栗子；忘記取回的栗子可能萌芽。", size: "約 2–4 公分", visual: { board: 2, index: 1 } },
  { id: "scorpion", name: "蝎尾豆捲莢", scientific: "Scorpiurus muricatus", region: "地中海地區", travel: "動物", tag: "螺旋偽裝", fact: "成熟豆莢會捲成奇妙螺旋。", detail: "盤繞果莢表面的突起可勾住周遭物體，幫種子在近距離移動。", size: "豆莢約 2–4 公分", visual: { board: 2, index: 2 } },
  { id: "seaheart", name: "海心豆", scientific: "Entada gigas", region: "熱帶美洲", travel: "水", tag: "海上旅行家", fact: "心形種子能隨洋流漂流。", detail: "堅硬外殼與內部空間帶來浮力，漂流種子甚至可能跨越海洋後被沖上岸。", size: "可達約 6 公分", visual: { board: 2, index: 3 } },
  { id: "sunflower", name: "向日葵瘦果", scientific: "Helianthus annuus", region: "北美洲原生", travel: "動物", tag: "黑白條紋", fact: "我們常叫它種子，其實是果實。", detail: "堅硬果皮包住真正的種子；鳥類與小動物會取食並搬運它。", size: "約 1–2 公分", visual: { board: 3, index: 0 } },
  { id: "lotus", name: "蓮蓬與蓮子", scientific: "Nelumbo nucifera", region: "亞洲與澳洲", travel: "水", tag: "天然收納盒", fact: "每個圓孔都是一間果實小房。", detail: "花托成熟後像蓮蓬頭，裡面的果實可掉入水中或泥裡等待適合的萌芽時機。", size: "蓮子約 1–2 公分", visual: { board: 3, index: 1 } },
  { id: "ravenala", name: "旅人蕉種子", scientific: "Ravenala madagascariensis", region: "馬達加斯加", travel: "動物", tag: "藍色寶石", fact: "鮮藍外被配上橘色假種皮。", detail: "強烈色彩能吸引動物注意；動物取食周圍組織時，也幫助種子移動。", size: "約 1 公分", visual: { board: 3, index: 2 } },
  { id: "okra", name: "秋葵種子", scientific: "Abelmoschus esculentus", region: "非洲起源", travel: "重力", tag: "星形豆莢", fact: "乾果裂開後露出一排排圓種子。", detail: "成熟果莢逐漸乾燥並裂開，種子落到附近土壤，等待水分與溫度合適。", size: "種子約 4–6 毫米", visual: { board: 3, index: 3 } }
];

const crafts = [
  { id: "acorn", name: "橡實森林朋友", board: 1, index: 0, time: "20 分鐘", level: "簡單", materials: "乾淨橡實、白膠、紙黏土、樹枝", steps: ["擦乾橡實並確認沒有蟲蛀", "用紙黏土做眼睛與小手腳", "以白膠固定，靜置到完全乾燥", "替新朋友設計一張觀察卡"] },
  { id: "mosaic", name: "種子蝴蝶拼貼", board: 1, index: 1, time: "30 分鐘", level: "簡單", materials: "厚紙板、白膠、食用乾豆、鉛筆", steps: ["在紙板輕畫蝴蝶輪廓", "先不黏，排出左右對稱圖案", "由中央向外逐顆黏貼", "乾燥後比較兩邊的形狀與顏色"] },
  { id: "garland", name: "森林種子掛飾", board: 1, index: 2, time: "35 分鐘", level: "需協助", materials: "安全棉繩、紙黏土、乾燥果殼、樹枝", steps: ["只使用已有天然孔洞的材料", "用紙黏土包住棉繩固定種子", "把不同長度的棉繩綁上樹枝", "請成人檢查每個結是否牢固"] },
  { id: "jar", name: "種子觀察博物罐", board: 1, index: 3, time: "15 分鐘", level: "簡單", materials: "透明回收罐、紙隔板、乾豆、紙標籤", steps: ["將來源清楚的乾豆分成四組", "觀察大小、顏色、表面再分類", "放入有隔間的透明罐", "在外部貼上自己的分類名稱"] },
  { id: "mandala", name: "黏土種子曼陀羅", board: 2, index: 0, time: "25 分鐘", level: "簡單", materials: "風乾黏土、食用乾豆、南瓜籽", steps: ["把黏土壓成圓餅", "先從中心放一顆種子", "用重複規律向外排列", "輕壓固定並等待黏土乾燥"] },
  { id: "spinner", name: "種子旋轉陀螺", board: 2, index: 1, time: "25 分鐘", level: "需協助", materials: "厚瓦楞紙、白膠、乾豆、鈍頭木棒", steps: ["請成人在圓紙板中央開孔", "把種子排成平衡的放射圖案", "黏好並完全乾燥", "插入鈍頭木棒，比較不同排列的旋轉"] },
  { id: "shaker", name: "沙沙種子搖筒", board: 2, index: 2, time: "20 分鐘", level: "簡單", materials: "紙筒、厚紙、膠帶、少量乾豆", steps: ["用厚紙與膠帶封住一端", "放入一小匙不同大小的乾豆", "牢牢封住另一端", "輕搖並比較聲音高低"] },
  { id: "sprout", name: "豆豆發芽觀察杯", board: 2, index: 3, time: "10 分鐘＋7 天", level: "簡單", materials: "回收杯、培養土、可栽種豆類、噴水瓶", steps: ["使用包裝標示可栽種的豆類", "把豆子種入濕潤培養土", "放在明亮通風處並保持微濕", "每天同時觀察、畫下根與芽的變化"] }
];

const resources = [
  { title: "Kew：什麼是種子？", type: "科學文章", grade: "國小高年級", url: "https://www.kew.org/read-and-watch/what-is-a-seed", desc: "認識種皮、胚與養分三個基本部分。" },
  { title: "Kew：世界最大的海椰子", type: "自然故事", grade: "國小高年級", url: "https://www.kew.org/read-and-watch/double-coconut-largest-seed-in-the-world", desc: "從島嶼環境理解巨大種子如何演化。" },
  { title: "Kew 千禧種子銀行", type: "線上博物館", grade: "親子共讀", url: "https://www.kew.org/science/collections-and-resources/collections/seed-collection", desc: "看看科學家如何保存世界植物多樣性。" },
  { title: "美國國家公園署：植物會移動嗎？", type: "教學活動", grade: "國小高年級", url: "https://www.nps.gov/teachers/classrooms/who-says-plants-can-t-move.htm", desc: "用角色扮演比較風、水與動物傳播。" },
  { title: "佛羅里達大學：漂流海豆", type: "海岸觀察", grade: "親子共讀", url: "https://blogs.ifas.ufl.edu/putnamco/2019/03/18/sea-beans-drift-seeds/", desc: "認識漂流種子的浮力與海洋旅程。" },
  { title: "亞利桑那州立大學：口袋種子實驗", type: "互動實驗", grade: "國小高年級", url: "https://askabiologist.asu.edu/experiments/vpocketseeds_teachers", desc: "用真實資料觀察發芽、向地性與公平測試。" }
];

function AtlasImage({ visual, label, className = "" }: { visual: AtlasVisual; label: string; className?: string }) {
  const col = visual.index % 2;
  const row = Math.floor(visual.index / 2);
  return <div className={`atlas-image ${className}`} role="img" aria-label={`${label}，由 Image 2.0 生成的教學圖片`} style={{ backgroundImage: `url(/generated/${visual.board <= 3 ? `seed-board-${visual.board}` : `craft-board-${visual.board - 3}`}.png)`, backgroundPosition: `${col * 100}% ${row * 100}%` }} />;
}

function CraftImage({ board, index, label }: { board: number; index: number; label: string }) {
  const col = index % 2;
  const row = Math.floor(index / 2);
  return <div className="atlas-image craft-image" role="img" aria-label={`${label}，由 Image 2.0 生成的手作示意圖`} style={{ backgroundImage: `url(/generated/craft-board-${board}.png)`, backgroundPosition: `${col * 100}% ${row * 100}%` }} />;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState(0);
  const [visited, setVisited] = useState<number[]>([0]);
  const [query, setQuery] = useState("");
  const [travel, setTravel] = useState("全部");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedSeed, setSelectedSeed] = useState<Seed | null>(null);
  const [selectedCraft, setSelectedCraft] = useState<(typeof crafts)[number] | null>(null);
  const [checkedSteps, setCheckedSteps] = useState<number[]>([]);
  const [simMode, setSimMode] = useState<"wind" | "water" | "animal">("wind");
  const [simRunning, setSimRunning] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("seed-planet-progress");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setVisited(parsed.visited ?? [0]);
        setFavorites(parsed.favorites ?? []);
      } catch { /* ignore damaged local data */ }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("seed-planet-progress", JSON.stringify({ visited, favorites }));
  }, [visited, favorites]);

  const goTab = (index: number) => {
    setActiveTab(index);
    setVisited((old) => old.includes(index) ? old : [...old, index]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredSeeds = useMemo(() => seeds.filter((seed) => {
    const matchesText = `${seed.name}${seed.scientific}${seed.region}${seed.tag}`.toLowerCase().includes(query.toLowerCase());
    return matchesText && (travel === "全部" || seed.travel === travel || (travel === "收藏" && favorites.includes(seed.id)));
  }), [query, travel, favorites]);

  const answerQuiz = (answer: number) => {
    if (choice !== null) return;
    setChoice(answer);
    if (answer === quizData[quizIndex].answer) setScore((value) => value + 1);
  };

  const nextQuiz = () => {
    if (quizIndex === quizData.length - 1) {
      setQuizDone(true);
      return;
    }
    setQuizIndex((value) => value + 1);
    setChoice(null);
  };

  const resetQuiz = () => {
    setQuizIndex(0); setChoice(null); setScore(0); setQuizDone(false);
  };

  const progress = Math.round((visited.length / tabs.length) * 100);

  return (
    <main>
      <header className="site-header">
        <button className="brand" onClick={() => goTab(0)} aria-label="回到出發任務"><span className="brand-seed">●</span><span><b>種子星球</b><small>SEED PLANET ATLAS</small></span></button>
        <div className="progress-wrap" aria-label={`學習進度 ${progress}%`}><span>{progress}%</span><div className="progress-track"><i style={{ width: `${progress}%` }} /></div></div>
      </header>

      <nav className="tabs" aria-label="教材頁籤">
        {tabs.map((tab, index) => <button key={tab} className={activeTab === index ? "active" : ""} onClick={() => goTab(index)} aria-selected={activeTab === index}>{String(index + 1).padStart(2, "0")}<span>{tab}</span>{visited.includes(index) && <i aria-label="已探索">✓</i>}</button>)}
      </nav>

      <section className="panel" aria-live="polite">
        {activeTab === 0 && (
          <div className="hero-panel">
            <img src="/generated/hero.png" alt="由 Image 2.0 生成的種子世界地圖，有海椰子、翅果、蓮蓬與可愛橡實角色" />
            <div className="hero-copy">
              <span className="eyebrow">一顆種子，一次環遊世界</span>
              <h1>小小種子，<br /><em>藏著大大的旅行。</em></h1>
              <p>打開 12 種奇妙種子的自然護照，觀察它們的外形、旅行方法，再把靈感變成安全又可愛的手作。</p>
              <div className="mission-stats"><span><b>12</b> 種世界種子</span><span><b>8</b> 款手作靈感</span><span><b>40</b> 分鐘探索</span></div>
              <button className="primary" onClick={() => goTab(1)}>開始環球蒐集 <span>→</span></button>
            </div>
            <div className="mission-card"><span>今日任務</span><strong>找到會飛、會漂流、會搭便車的種子</strong><small>適合國小五年級・自然科學</small></div>
          </div>
        )}

        {activeTab === 1 && (
          <div className="atlas-panel">
            <div className="section-heading"><div><span className="eyebrow">GLOBAL COLLECTION</span><h2>世界奇趣種子圖鑑</h2><p>先看形狀，再猜猜它靠什麼方法旅行。</p></div><div className="atlas-count"><b>{filteredSeeds.length}</b><span>本種子</span></div></div>
            <div className="toolbar">
              <label className="search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜尋名稱、產地或特色…" aria-label="搜尋種子" /></label>
              <div className="filter-row" role="group" aria-label="依傳播方式篩選">{["全部", "風", "水", "動物", "重力", "收藏"].map((item) => <button key={item} className={travel === item ? "active" : ""} onClick={() => setTravel(item)}>{item}</button>)}</div>
            </div>
            <div className="seed-grid">
              {filteredSeeds.map((seed) => <article className="seed-card" key={seed.id}>
                <div className="seed-visual-wrap"><AtlasImage visual={seed.visual} label={seed.name} /><span className="travel-badge">{seed.travel}力旅行</span><button className={`heart ${favorites.includes(seed.id) ? "saved" : ""}`} aria-label={`${favorites.includes(seed.id) ? "取消收藏" : "收藏"}${seed.name}`} onClick={() => setFavorites((old) => old.includes(seed.id) ? old.filter((id) => id !== seed.id) : [...old, seed.id])}>{favorites.includes(seed.id) ? "♥" : "♡"}</button></div>
                <div className="seed-body"><div className="seed-title"><div><h3>{seed.name}</h3><i>{seed.scientific}</i></div><span>{seed.region}</span></div><b className="seed-tag">{seed.tag}</b><p>{seed.fact}</p>{seed.caution && <small className="caution">！{seed.caution}</small>}<button className="text-button" onClick={() => setSelectedSeed(seed)}>打開觀察卡 <span>↗</span></button></div>
              </article>)}
            </div>
            {filteredSeeds.length === 0 && <div className="empty">沒有符合條件的種子，換個關鍵字試試看。</div>}
          </div>
        )}

        {activeTab === 2 && (
          <div className="secret-panel">
            <div className="section-heading"><div><span className="eyebrow">SEED LAB</span><h2>一顆種子，三份行李</h2><p>種子不是沉睡的小石頭，而是一套準備出發的生命系統。</p></div></div>
            <div className="concept-grid">
              <article><AtlasImage visual={{ board: 3, index: 0 }} label="種皮紋理" /><span>01</span><h3>種皮｜防護衣</h3><p>包住內部，減少乾燥與碰撞造成的傷害。</p></article>
              <article><AtlasImage visual={{ board: 2, index: 1 }} label="種子內的養分" /><span>02</span><h3>養分｜小便當</h3><p>蛋白質、油脂或澱粉，支持幼苗剛萌芽的日子。</p></article>
              <article><AtlasImage visual={{ board: 2, index: 0 }} label="等待萌芽的種子" /><span>03</span><h3>胚｜迷你植物</h3><p>內藏未來的幼根與幼芽，遇到適合條件就開始生長。</p></article>
            </div>
            <div className="simulation">
              <div className="sim-stage" aria-label="種子傳播方式動畫"><div className={`sim-landscape mode-${simMode}`}><div className={`demo-seed ${simRunning ? "running" : ""}`}>●</div><div className="mother-plant">♧</div><div className="destination">⌂</div></div></div>
              <div className="sim-copy"><span className="eyebrow">互動觀察站</span><h3>誰把種子送到遠方？</h3><p>選一種旅行方式，觀察種子的形狀如何幫助它離開母株。</p><div className="mode-buttons">{([['wind','風：輕與寬'],['water','水：浮與防水'],['animal','動物：醒目或能附著']] as const).map(([key,label]) => <button key={key} className={simMode === key ? "active" : ""} onClick={() => {setSimMode(key); setSimRunning(false);}}>{label}</button>)}</div><div className="sim-feedback">{simMode === "wind" ? "翅或冠毛增加阻力，讓種子慢慢落下。" : simMode === "water" ? "硬殼、纖維或空氣層讓種子不易進水並保持浮力。" : "果肉、鮮豔外被、鉤刺或黏性，讓動物成為交通工具。"}</div><div className="sim-controls"><button className="primary small" onClick={() => setSimRunning(!simRunning)}>{simRunning ? "暫停" : "播放"}</button><button className="secondary small" onClick={() => {setSimRunning(false); setTimeout(() => setSimRunning(true), 20);}}>重播</button><button className="secondary small" onClick={() => setSimRunning(false)}>重設</button></div><small>觀察任務：找出「形狀 → 移動方式 → 新位置」三個證據。</small></div>
            </div>
          </div>
        )}

        {activeTab === 3 && (
          <div className="craft-panel">
            <div className="section-heading"><div><span className="eyebrow">MAKER GARDEN</span><h2>把大自然變成小作品</h2><p>先觀察、再分類，最後用重複與對稱創作。</p></div><aside className="safety"><b>安全小約定</b><span>只用乾淨、乾燥、來源清楚的材料。不明種子不摸、不聞、不入口；尖銳工具交給成人。</span></aside></div>
            <div className="craft-grid">{crafts.map((craft) => <article className="craft-card" key={craft.id}><CraftImage board={craft.board} index={craft.index} label={craft.name} /><div><span className="craft-level">{craft.level}</span><h3>{craft.name}</h3><p>{craft.materials}</p><small>約 {craft.time}</small><button className="text-button" onClick={() => {setSelectedCraft(craft); setCheckedSteps([]);}}>查看步驟 <span>→</span></button></div></article>)}</div>
          </div>
        )}

        {activeTab === 4 && (
          <div className="quiz-panel">
            <div className="section-heading"><div><span className="eyebrow">SEED QUEST</span><h2>種子探險家挑戰</h2><p>不是背名詞：用觀察、比較與推理找到答案。</p></div></div>
            {!quizDone ? <div className="quiz-card"><div className="quiz-top"><span>第 {quizIndex + 1} / {quizData.length} 題</span><b>目前 {score} 顆星</b></div><div className="quiz-track"><i style={{ width: `${((quizIndex + 1) / quizData.length) * 100}%` }} /></div><h3>{quizData[quizIndex].question}</h3><div className="options">{quizData[quizIndex].options.map((option, index) => { const answered = choice !== null; const correct = index === quizData[quizIndex].answer; return <button key={option} disabled={answered} onClick={() => answerQuiz(index)} className={answered ? correct ? "correct" : choice === index ? "wrong" : "muted" : ""}><span>{String.fromCharCode(65 + index)}</span>{option}{answered && correct && <b>✓</b>}{answered && choice === index && !correct && <b>×</b>}</button>; })}</div>{choice !== null && <div className={`answer-box ${choice === quizData[quizIndex].answer ? "good" : "try"}`}><b>{choice === quizData[quizIndex].answer ? "答對了！" : "再想一想"}</b><p>{quizData[quizIndex].explanation}</p><button className="primary small" onClick={nextQuiz}>{quizIndex === quizData.length - 1 ? "看成果" : "下一題 →"}</button></div>}</div> : <div className="result-card"><span className="result-seed">●</span><p>探險完成</p><h3>{score} / {quizData.length}</h3><strong>{score >= 8 ? "你是種子觀察大師！" : score >= 6 ? "你已經是可靠的種子嚮導！" : "再逛一次圖鑑，就會發現更多線索。"}</strong><button className="primary" onClick={resetQuiz}>重新挑戰</button></div>}
          </div>
        )}

        {activeTab === 5 && (
          <div className="resource-panel">
            <div className="section-heading"><div><span className="eyebrow">KEEP EXPLORING</span><h2>把好奇心帶到真實世界</h2><p>以下資源來自植物園、博物館、政府與大學，適合和老師或家長一起探索。</p></div></div>
            <div className="resource-grid">{resources.map((resource, index) => <a key={resource.title} href={resource.url} target="_blank" rel="noreferrer"><span>{String(index + 1).padStart(2, "0")}</span><div><small>{resource.type}・{resource.grade}</small><h3>{resource.title}</h3><p>{resource.desc}</p><i>已檢查：2026-08-01</i></div><b>↗</b></a>)}</div>
            <div className="teacher-note"><b>給老師與家長</b><p>建議先讓孩子描述「看見的證據」，再猜傳播方式；手作材料請以食用乾豆、合法採集且來源清楚的乾燥種子為主。課綱代碼請依最新正式手冊確認。</p></div>
          </div>
        )}
      </section>

      <footer className="pager"><button disabled={activeTab === 0} onClick={() => goTab(activeTab - 1)}>← 上一站</button><span>{tabs[activeTab]}</span><button disabled={activeTab === tabs.length - 1} onClick={() => goTab(activeTab + 1)}>下一站 →</button></footer>

      {selectedSeed && <div className="modal-backdrop" role="presentation" onMouseDown={() => setSelectedSeed(null)}><section className="detail-modal" role="dialog" aria-modal="true" aria-labelledby="seed-modal-title" onMouseDown={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setSelectedSeed(null)} aria-label="關閉">×</button><AtlasImage visual={selectedSeed.visual} label={selectedSeed.name} className="modal-image" /><div className="modal-copy"><span className="eyebrow">{selectedSeed.region}・{selectedSeed.travel}力旅行</span><h2 id="seed-modal-title">{selectedSeed.name}</h2><i>{selectedSeed.scientific}</i><p>{selectedSeed.detail}</p><dl><div><dt>招牌特色</dt><dd>{selectedSeed.tag}</dd></div><div><dt>大約大小</dt><dd>{selectedSeed.size}</dd></div></dl>{selectedSeed.caution && <div className="modal-warning">！{selectedSeed.caution}</div>}<button className="primary small" onClick={() => setSelectedSeed(null)}>收進觀察筆記</button></div></section></div>}

      {selectedCraft && <div className="modal-backdrop" role="presentation" onMouseDown={() => setSelectedCraft(null)}><section className="detail-modal craft-modal" role="dialog" aria-modal="true" aria-labelledby="craft-modal-title" onMouseDown={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setSelectedCraft(null)} aria-label="關閉">×</button><CraftImage board={selectedCraft.board} index={selectedCraft.index} label={selectedCraft.name} /><div className="modal-copy"><span className="eyebrow">{selectedCraft.level}・{selectedCraft.time}</span><h2 id="craft-modal-title">{selectedCraft.name}</h2><p className="materials"><b>準備：</b>{selectedCraft.materials}</p><ol className="step-list">{selectedCraft.steps.map((step, index) => <li key={step}><button className={checkedSteps.includes(index) ? "done" : ""} onClick={() => setCheckedSteps((old) => old.includes(index) ? old.filter((item) => item !== index) : [...old, index])}><span>{checkedSteps.includes(index) ? "✓" : index + 1}</span>{step}</button></li>)}</ol><div className="step-progress"><i style={{ width: `${(checkedSteps.length / selectedCraft.steps.length) * 100}%` }} /></div><small>每完成一步就點一下，進度會在這張卡上亮起來。</small></div></section></div>}
    </main>
  );
}
