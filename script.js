/* Cafe Compass: page behavior and Gemini connection are intentionally separated. */

const GEMINI_CONFIG = {
  // Keep secrets on a server. This front end sends to your own proxy endpoint by default.
  apiKey: "",
  model: "",
  endpoint: "/api/gemini",
  // ========================================
  // Gemini API Prompt: edit only this value later.
  // ========================================
  prompt: ""
};

const QUESTIONS = [
  { key:"purpose", question:"今日カフェに行く一番の理由は？", options:["集中して作業・勉強をしたい","友人・パートナーとおしゃべりを楽しみたい","読書や一人時間をまったり過ごしたい","美味しいスイーツや珈琲を味わいたい（カフェ巡り・写真映え）"] },
  { key:"atmosphere", question:"どんな空間が好き？", options:["モダン・スタイリッシュ（コンクリート打ちっぱなし、無機質）","レトロ・喫茶店風（落ち着いた照明、木目調、ジャズが流れる）","ナチュラル・グリーン（植物が多い、明るく開放的）","アットホーム・隠れ家風（こぢんまりとしていて静か）"] },
  { key:"stayTime", question:"どれくらい過ごす予定？", options:["30分〜1時間未満（サクッと休憩・テイクアウト利用も考慮）","1〜2時間（標準的）","2〜3時間以上（じっくり長居したい）"] },
  { key:"equipment", question:"これがないと困るものは？", options:["Wi-Fi ＆ 電源コンセント","ソファ席やゆったりした座席","テラス席・景観の良さ","特にこだわらない／静かさ重視"] },
  { key:"drink", question:"何を飲みたい？", options:["浅煎り・ハンドドリップなどの本格スペシャリティコーヒー","深煎り・濃いめのブレンドやエスプレッソ","映えるラテアートや甘いフレーバー系","紅茶・ハーブティー・ノンカフェインメニュー"] },
  { key:"food", question:"一緒に食べたいものは？", options:["しっかりめのランチ（パスタ、サンドイッチ、プレート等）","絶品スイーツ（ケーキ、プリン、パフェ等）","軽くつまめる焼き菓子・パン","ドリンクのみでOK"] },
  { key:"noise", question:"店内の空気感は？", options:["BGM控えめで静か（会話も控えめな空間）","適度なガヤガヤ感（会話や作業音が気にならない程度）","にぎやかで活気がある（大きめの声で会話できる）"] },
  { key:"people", question:"誰と行く？", options:["1人","2人（デート・友人）","3〜4人のグループ","子連れ・ペット連れ"] },
  { key:"budget", question:"ドリンク＋フードの1人あたりの目安は？", options:["〜1,000円以内（手軽に）","1,000円〜2,000円（標準的）","2,000円以上（ご褒美・贅沢）"] },
  { key:"location", question:"重視する立地条件は？", options:["駅から徒歩3分以内（雨でも行きやすい）","駅から少し離れた閑静なエリア・隠れ家","買い物や散策ついでに行ける商業施設内・賑やかな通り沿い"] }
];

function initLanding() {
  const panels = document.querySelectorAll(".story-panel");
  const observer = new IntersectionObserver(entries => entries.forEach(entry => entry.target.classList.toggle("is-visible", entry.isIntersecting)), { threshold: .55 });
  panels.forEach(panel => observer.observe(panel));
  const bgs = [".bg-cafe", ".bg-outside", ".bg-forest", ".bg-deep-forest"].map(s => document.querySelector(s));
  window.addEventListener("scroll", () => { const p = Math.min(1, window.scrollY / Math.max(1, document.body.scrollHeight - innerHeight)); const stage = p * 3; bgs.forEach((bg, i) => bg.style.opacity = i === 0 ? String(Math.max(0, 1 - stage)) : String(Math.max(0, 1 - Math.abs(stage - (i - 1))))); }, { passive:true });
}

function renderQuestions(answers) {
  const container = document.querySelector("#question-container");
  container.innerHTML = QUESTIONS.map((item, index) => `<article class="question-card"><span class="question-label">QUESTION ${String(index + 1).padStart(2,"0")}</span><h2>${item.question}</h2><div class="options">${item.options.map((option, optionIndex) => `<button class="option-button ${answers[item.key] === option ? "is-selected" : ""}" type="button" data-key="${item.key}" data-value="${encodeURIComponent(option)}"><span class="option-letter">${String.fromCharCode(65 + optionIndex)}.</span>${option}</button>`).join("")}</div></article>`).join("");
}

async function sendToGemini(answers) {
  // This endpoint should be a server-side proxy that reads GEMINI_API_KEY from its environment.
  // It receives { answers, prompt, model } and can pass the provider response back unchanged.
  if (!GEMINI_CONFIG.endpoint || !GEMINI_CONFIG.prompt.trim()) throw new Error("Gemini connection is not configured");
  const response = await fetch(GEMINI_CONFIG.endpoint, { method:"POST", headers:{ "Content-Type":"application/json" }, body:JSON.stringify({ answers, prompt:GEMINI_CONFIG.prompt, model:GEMINI_CONFIG.model }) });
  if (!response.ok) throw new Error("Gemini request failed");
  const contentType = response.headers.get("content-type") || "";
  return contentType.includes("application/json") ? response.json() : response.text();
}

function initQuiz() {
  const start = document.querySelector("#start-screen"), quiz = document.querySelector("#quiz-screen"), loading = document.querySelector("#loading-screen"), responseScreen = document.querySelector("#response-screen"), errorScreen = document.querySelector("#error-screen");
  if (!start) return; const answers = {}; let bgm;
  document.querySelector("#start-button").addEventListener("click", () => { bgm = new Audio("assets/audio/bgm.mp3"); bgm.loop = true; bgm.volume = .35; bgm.play().catch(() => {}); start.hidden = true; quiz.hidden = false; renderQuestions(answers); });
  document.querySelector("#quiz-form").addEventListener("click", event => { const button = event.target.closest(".option-button"); if (!button) return; answers[button.dataset.key] = decodeURIComponent(button.dataset.value); renderQuestions(answers); const done = Object.keys(answers).length; document.querySelector("#question-count").textContent = `${String(done).padStart(2,"0")} / 10`; document.querySelector("#progress-bar").style.width = `${done * 10}%`; document.querySelector("#form-message").textContent = ""; });
  document.querySelector("#quiz-form").addEventListener("submit", async event => { event.preventDefault(); if (Object.keys(answers).length !== QUESTIONS.length) { document.querySelector("#form-message").textContent = "すべての質問に回答してください。"; return; } quiz.hidden = true; loading.hidden = false; const messages = ["あなたの回答を分析しています……","理想のカフェタイムを考えています……","もうすぐ診断結果が完成します……"]; let i = 0; const timer = setInterval(() => { i = (i + 1) % messages.length; document.querySelector("#loading-message").textContent = messages[i]; }, 1700); try { const result = await sendToGemini(answers); localStorage.setItem("cafeDiagnosisResult", JSON.stringify(result)); clearInterval(timer); loading.hidden = true; responseScreen.hidden = false; } catch (_) { clearInterval(timer); loading.hidden = true; errorScreen.hidden = false; } });
  document.querySelector("#view-result-button").addEventListener("click", () => location.href = "result.html");
  document.querySelector("#retry-button").addEventListener("click", () => { errorScreen.hidden = true; quiz.hidden = false; });
}

const labels = { cafeType:"あなたのカフェタイプ", summary:"あなたに合う理由", reason:"理由", atmosphere:"おすすめの空間", recommendedDrink:"おすすめのドリンク", recommendedFood:"おすすめのフード", howToSpend:"おすすめの過ごし方", importantPoint:"カフェ選びのポイント" };
function stringifyValue(value) { return typeof value === "string" ? value : JSON.stringify(value, null, 2); }
function initResult() { const intro = document.querySelector("#result-intro"); if (!intro) return; const surprise = document.querySelector("#surprise"), actual = document.querySelector("#actual-result"), content = document.querySelector("#result-content"); let data; try { data = JSON.parse(localStorage.getItem("cafeDiagnosisResult")); } catch (_) { data = null; } setTimeout(() => { intro.hidden = true; surprise.hidden = false; setTimeout(() => { surprise.hidden = true; actual.hidden = false; if (!data) { content.innerHTML = `<p class="fallback-message">診断データが見つかりませんでした。もう一度、診断をお試しください。</p>`; return; } if (data && typeof data === "object" && !Array.isArray(data)) { const type = data.cafeType || data.title || data.name; content.innerHTML = `${type ? `<h1 class="result-type">${escapeHtml(stringifyValue(type))}</h1>` : ""}${Object.entries(data).filter(([key]) => key !== "cafeType" && key !== "title" && key !== "name").map(([key,value]) => `<article class="result-card"><h3>${escapeHtml(labels[key] || key)}</h3><p class="raw-result">${escapeHtml(stringifyValue(value))}</p></article>`).join("")}`; } else { content.innerHTML = `<article class="result-card"><h3>診断結果</h3><p class="raw-result">${escapeHtml(stringifyValue(data))}</p></article>`; } }, 2600); }, 1500); }
function escapeHtml(text) { const div = document.createElement("div"); div.textContent = text; return div.innerHTML; }
if (document.body.classList.contains("landing-page")) initLanding(); if (document.body.classList.contains("question-page")) initQuiz(); if (document.body.classList.contains("result-page")) initResult();
