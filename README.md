#  Finance Management App

##  アプリケーション概要

**[Demo] アプリケーションのデモURL:https://yuni1005.github.io/finance-management-app/**

本アプリケーションは、CLI（コマンドラインインターフェース）とGUI（グラフィカルユーザーインターフェース）の操作をシームレスに切り替えられる、新感覚のパーソナル収支管理ツールです。

エンジニアや高速なデータ入力が必要なユーザーはCLIで素早くコマンド入力し、残高確認やデータ編集はGUIで行うという運用を可能にしました。

---

##  主な機能

### 1. インターフェース

| モード | 特徴 | 主な用途 |
| :--- | :--- | :--- |
|  **CLIモード** | ターミナル風のUI。コマンド (`add`, `list`, `clear`) で高速に操作。GUIサマリーがサイドパネルに表示される。 | 移動中や思考を中断せず、素早くデータを入力したい時。 |
|  **GUIモード** | 全画面のグラフィカルなUI。フォームやボタンで直感的に操作。 | 過去データの詳細確認、編集、削除、一括入力を行いたい時。 |

### 2. コア機能

* **追加機能**: CLI (`add income 1000 salary`) またはGUIフォームからトランザクションを追加。
* **編集機能**: GUIモードで既存のトランザクションを選択し、モーダルを通じて内容を修正・更新。
* **削除機能**: CLI（発展的）、またはGUIの一覧から個別に削除。
* **永続化**: すべてのデータはブラウザの**ローカルストレージ**に保存されるため、ブラウザを閉じてもデータが維持されます。
* **リアルタイム残高計算**: 総収入、総支出、純残高を常に計算し、両モードに表示。

---

##  挑戦・工夫した点 (自己アピールポイント)

本プロジェクトでは、単なる課題消化ではなく、実際のニーズを満たすための機能と設計に特に挑戦しました。

### 1. CLIの「速さ」とGUIの「使いやすさ」の両立 (着想と経緯)

* **経緯**: 従来の家計簿アプリは、マウスで項目を選択し、フォームを埋める作業が手間でした。特に作業中にサッと記録したい場合に煩雑でした。
* **挑戦点**: そこで、キーボード操作だけでデータを入力できるCLIコンソールと、データの視認性・編集性に優れたGUIを、**同一のステート**で管理するハイブリッド構造を採用しました。これにより、操作の目的に応じた最適なインターフェースを提供しています。

### 2. 厳密な型管理とロジックの分離

* **技術的挑戦**: プロジェクト全体でTypeScriptの型定義（`src/types`）を徹底し、型の安全性を確保しました。特に、コンパイラ設定で `verbatimModuleSyntax` を有効にしても警告が出ないように、**`import type`** を厳密に適用し、コードの堅牢性を高めました。
* **コードの分離**: メインロジック (`App.tsx`) から、データの永続化処理や各ビューのロジックを分離し、コンポーネントの責務を明確にしました。

### 3. モーダルによる快適な編集体験

* GUIでのデータ編集時、画面遷移を伴わず、オーバーレイ表示される**編集モーダル (`TransactionEditModal.tsx`)** を実装しました。これにより、ユーザーは現在のビューを維持したまま、スムーズにデータを修正できます。

---

##  アプリケーションのスクリーンショット

**CLIモード**
![CLI](/img/CLI.png)

**GUIモード(収入)**
![GUI_income](/img/GUI_income.png)

**GUIモード(支出)**
![GUi_expence](/img/GUI_expence.png)

---

##  使用技術 (技術スタック)

* **Frontend**: React
* **Language**: TypeScript
* **Styling**: Tailwind CSS
* **Bundler**: Vite
* **Major Libraries**: `uuid` (一意なID生成)

---

##  開発期間と時間 (必須情報)

開発期間: 2025.11.1 ~ 2025.11.28
取り組み時間合計: **35時間**

## ライセンス

MIT License

Copyright (c) 2025 YuNi1005

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

