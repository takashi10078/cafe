/* Cafe Compass: quiz flow and local diagnosis. */

const QUESTIONS = [
  { 
    key: "purpose", 
    question: "カフェに行く一番の理由は？", 
    options: [
      "作業・勉強に集中したい",
      "おしゃべりを楽しみたい",
      "一人でボーッと過ごしたい",
      "美味しいカフェ飯や写真映えが目当て"
    ] 
  },
  { 
    key: "atmosphere", 
    question: "どんな雰囲気のお店が好き？", 
    options: [
      "無機質・スタイリッシュ（韓国風・コンクリート感）",
      "レトロ・喫茶店風（薄暗い・落ち着く木目調）",
      "明るい・開放的（観葉植物や自然光が多い）",
      "隠れ家風（小さめで静か）"
    ] 
  },
  { 
    key: "stayTime", 
    question: "どのくらい滞在したい？", 
    options: [
      "サクッと30分〜1時間（休憩やテイクアウト）",
      "1〜2時間（ふつう）",
      "2〜3時間以上（じっくり長居）"
    ] 
  },
  { 
    key: "equipment", 
    question: "絶対ほしい設備・環境は？", 
    options: [
      "Wi-Fi と コンセント",
      "ふかふかのソファ席",
      "眺めのいいテラス席",
      "特になし（静かさ重視）"
    ] 
  },
  { 
    key: "drink", 
    question: "何を飲みたい気分？", 
    options: [
      "フルーティー・こだわり豆のコーヒー",
      "コクのある苦めのコーヒー",
      "映えるラテアートや甘いドリンク",
      "紅茶・ハーブティー・ノンカフェイン"
    ] 
  },
  { 
    key: "food", 
    question: "何か食べる？", 
    options: [
      "ガッツリ食事（パスタ・ご飯もの）",
      "ケーキやプリンなどのスイーツ",
      "パンやクッキーなどの軽食",
      "ドリンクだけでOK"
    ] 
  },
  { 
    key: "noise", 
    question: "お店のにぎやかさは？", 
    options: [
      "静か（ヒソヒソ話レベル）",
      "ほどよい雑音（会話や作業がしやすい）",
      "にぎやか（声の大きさを気にせず喋れる）"
    ] 
  },
  { 
    key: "people", 
    question: "誰と行く？", 
    options: [
      "1人で",
      "2人で（デートや友達と）",
      "3〜4人のグループで",
      "子ども・ペットと一緒に"
    ] 
  },
  { 
    key: "budget", 
    question: "予算の目安（1人あたり）は？", 
    options: [
      "1,000円以内（お手頃に）",
      "1,000円〜2,000円（ふつう）",
      "2,000円以上（ちょっと贅沢）"
    ] 
  },
  { 
    key: "location", 
    question: "場所の希望は？", 
    options: [
      "駅からすぐ（徒歩3分以内）",
      "駅からちょっと離れた静かな場所",
      "買い物のついでに寄れる場所"
    ] 
  }
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

function initQuiz() {
  const start = document.querySelector("#start-screen"), quiz = document.querySelector("#quiz-screen"), loading = document.querySelector("#loading-screen");
  if (!start) return; const answers = {}; let bgm;
  document.querySelector("#start-button").addEventListener("click", () => {
    document.body.classList.remove("starting");

    bgm = new Audio("assets/audio/bgm.mp3");
    bgm.loop = true;
    bgm.volume = .35;
    bgm.play().catch(() => {});

    start.hidden = true;
    quiz.hidden = false;
    renderQuestions(answers);
  });
  document.querySelector("#quiz-form").addEventListener("click", event => { const button = event.target.closest(".option-button"); if (!button) return; answers[button.dataset.key] = decodeURIComponent(button.dataset.value); renderQuestions(answers); const done = Object.keys(answers).length; document.querySelector("#question-count").textContent = `${String(done).padStart(2,"0")} / 10`; document.querySelector("#progress-bar").style.width = `${done * 10}%`; document.querySelector("#form-message").textContent = ""; });
  document.querySelector("#quiz-form").addEventListener("submit", event => { event.preventDefault(); if (Object.keys(answers).length !== QUESTIONS.length) { document.querySelector("#form-message").textContent = "すべての質問に回答してください。"; return; } quiz.hidden = true; loading.hidden = false; document.querySelector("#loading-message").textContent = "回答を受け取りました……"; window.setTimeout(() => { location.href = "result.html"; }, 4000); });
}

function initResult() {
  const button = document.querySelector("#view-result-button");
  const responseScreen = document.querySelector("#response-screen");
  const scaryImage = document.querySelector("#scary-image");
  const cafeImage = document.querySelector("#cafe-image");

  if (!button || !responseScreen || !scaryImage || !cafeImage) return;

  button.addEventListener("click", () => {

    // 回答を見る画面を消す
    responseScreen.hidden = true;

    // 1.5秒待って怖い画像を表示
    window.setTimeout(() => {

      scaryImage.hidden = false;

      // 3秒後に怖い画像を消してカフェ画像を表示
      window.setTimeout(() => {

        scaryImage.hidden = true;
        cafeImage.hidden = false;

      }, 3000);

    }, 1500);
  });
}


if (document.body.classList.contains("landing-page")) initLanding(); if (document.body.classList.contains("question-page")) initQuiz(); if (document.body.classList.contains("result-page")) initResult();
