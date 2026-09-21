# 喫茶・余白 — 自分に合ったカフェ診断

スマートフォン向けの、レトロなカフェから深い森へと世界観が変わる体験型カフェ診断です。HTML、CSS、JavaScriptだけで構成されています。

## ファイル構成と役割

```text
index.html       導入・スクロール演出・診断への入口
question.html    スタート画面、10問、通信中画面
result.html      サプライズ演出と結果表示
style.css        全ページの見た目とアニメーション
script.js        質問、Gemini通信、画面遷移、結果の受け渡し
assets/images/   差し替え用画像
assets/audio/    差し替え用BGM
```

`assets/images/` に、次のファイル名で画像を置いてください。`cafe-bg.jpg`、`outside-bg.jpg`、`forest-bg.jpg`、`deep-forest-bg.jpg`、`scary.jpg`。BGMは `assets/audio/bgm.mp3` に置きます。ファイル名と場所を保てば、コードの変更は不要です。

## Gemini APIの設定

設定はすべて `script.js` の先頭にある `GEMINI_CONFIG` にあります。特に `prompt` はここだけを書き換えればよい設計です。現在は意図的に空欄で、具体的な診断指示や結果形式は固定していません。

このサイトは既定で `POST /api/gemini` に `{ answers, prompt, model }` を送ります。バックエンド側で環境変数から Gemini API キーを読み、Gemini に中継してレスポンスを返す実装を用意してください。**APIキーを `script.js` やHTMLに書く方法は本番環境では推奨されません。** ブラウザに配布され、誰でも取得できてしまうためです。

バックエンドは Gemini の応答を JSON またはテキストでそのまま返せます。応答は `localStorage` に保存され、`result.html` が汎用的に表示します。後からJSON形式を決めた場合は、`labels` 定数に表示名を追加すると読みやすくなります。

## 起動方法

画像・音源を配置後、ローカル開発サーバーでこのフォルダを公開し、`index.html` を開いてください。Gemini接続も試す場合は、同じオリジンで `/api/gemini` を提供するバックエンドが必要です。

## 変更のしかた

- 質問: `script.js` の `QUESTIONS` 配列を編集します。`key` は回答オブジェクトの名前です。
- デザイン: `style.css` の先頭にある色変数、または各ページのスタイルを編集します。
- ホラー画像: `assets/images/scary.jpg` を同名で差し替えます。
- BGM: `assets/audio/bgm.mp3` を同名で差し替えます。音量は `script.js` の `bgm.volume = .35` で調整できます。
