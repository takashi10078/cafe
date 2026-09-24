# 喫茶・余白 — 自分に合ったカフェ診断

スマートフォン向けの、レトロなカフェから深い森へと世界観が変わる体験型カフェ診断です。HTML、CSS、JavaScriptだけで構成されています。

## ファイル構成と役割

```text
index.html       導入・スクロール演出・診断への入口
question.html    スタート画面、10問、ローディング画面
result.html      画像のみを表示する結果画面
style.css        全ページの見た目とアニメーション
script.js        質問と画面遷移
assets/images/   差し替え用画像
assets/audio/    差し替え用BGM
```

`assets/images/` に、次のファイル名で画像を置いてください。`cafe-bg.jpg`、`outside-bg.jpg`、`forest-bg.jpg`、`deep-forest-bg.jpg`、`scary.jpg`。BGMは `assets/audio/bgm.mp3` に置きます。ファイル名と場所を保てば、コードの変更は不要です。

## 起動方法

診断はブラウザー内で10個の回答から結果を作ります。Gemini APIやGoogle Places APIの設定、APIキーは必要ありません。

Node.js 18以降を用意し、`npm start` を実行して `http://localhost:3000` を開いてください。ホスティング環境では、HTML/CSS/JavaScriptと `assets/` を静的サイトとして公開することもできます。

## 変更のしかた

- 質問: `script.js` の `QUESTIONS` 配列を編集します。`key` は回答オブジェクトの名前です。
- デザイン: `style.css` の先頭にある色変数、または各ページのスタイルを編集します。
- ホラー画像: `assets/images/scary.jpg` を同名で差し替えます。
- BGM: `assets/audio/bgm.mp3` を同名で差し替えます。音量は `script.js` の `bgm.volume = .35` で調整できます。
