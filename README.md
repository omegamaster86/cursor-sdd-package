# cursor-sdd

Cursor IDE 向けの Spec-Driven Development (SDD) テンプレート、ルール、コマンド集。

## インストール

```bash
# 推奨（都度実行・インストール不要）
npx cursor-sdd@latest

# 依存に入れたい場合（必要な時に自分で実行する）
npm i -D cursor-sdd
```

実行時にプロジェクトの `.cursor/` フォルダにファイルがコピーされます。対話可能な環境では「新規のPJを立ち上げる / 既存PJにアサインする」を選択できます。

### モード指定

- 明示指定（おすすめ）:

```bash
npx cursor-sdd@latest --mode new
npx cursor-sdd@latest --mode assign
```

- 対話プロンプト: `npx cursor-sdd@latest` 実行時に `new` / `assign` を選択
- 非対話や CI: `npx cursor-sdd@latest --mode assign` または環境変数 `CURSOR_SDD_MODE=assign`
- 省略時デフォルト: `new`

### 依存として入れた場合の実行

`npm i -D cursor-sdd` しただけでは `.cursor/` は変更しません。セットアップは明示的に実行してください：

```bash
npx cursor-sdd --mode new
```

### 手動セットアップ

既存の `.cursor/` がある場合は自動コピーがスキップされます。強制上書きする場合：

```bash
npx cursor-sdd@latest --force
```

## 使い方

Cursor IDE で以下のコマンドが使えるようになります：

| コマンド | 説明 |
|---------|------|
| `/init` | プロジェクト仕様の初期化 |
| `/requirements` | 要件定義書の生成 |
| `/design` | 技術設計書の作成 |
| `/tasks` | タスクの生成 |
| `/impl` | 実装の開始 |
| `/status` | 進捗確認 |
| `/check-design` | 設計のレビュー |
| `/difference-check` | 差分チェック |

### `/init` の使い分け

- **PJ全体を初期化**: `/init <プロジェクト説明>`
- **個別画面/機能を初期化**: `/init --feature billing-history <画面の説明>`
  - `--feature` / `-f` で指定したキーが `.cursor/<PJ名>/<feature>` ディレクトリとして作成されます
  - 以降の `/requirements` などは `<PJ名>/<feature>` を引数に渡してください（例: `/requirements my-project/billing-history`）

## 含まれるファイル

```
.cursor/
├── (assign 用の内容をコピーする場合は assign/ 配下がコピーされます)
├── commands/          # Cursor コマンド定義
│   ├── init.md
│   ├── requirements.md
│   ├── design.md
│   ├── tasks.md
│   ├── impl.md
│   ├── status.md
│   ├── check-design.md
│   └── difference-check.md
├── rules/             # AI ルール・ガイドライン
│   ├── design-principles.md
│   ├── design-review.md
│   ├── design-discovery-full.md
│   ├── design-discovery-light.md
│   ├── ears-format.md
│   ├── gap-analysis.md
│   ├── tasks-generation.md
│   └── tasks-parallel-analysis.md
└── templates/         # 仕様書テンプレート
    └── specs/
        ├── init.json
        ├── requirements-init.md
        ├── requirements.md
        ├── design.md
        ├── tasks.md
        └── research.md

assign モード時に配布したいファイルはリポジトリ直下の `assign/` に配置してください（例: `assign/commands`, `assign/rules`, `assign/templates`）。
```

## ワークフロー

```
/init → /requirements → /design → /tasks → /impl
                ↑                    ↓
            /status ←←←←←←←←←←←←←←←←
```

1. `/init` - プロジェクトの基本情報を設定
2. `/requirements` - ユーザーストーリーと要件を定義
3. `/design` - 技術設計書を作成
4. `/tasks` - 実装タスクを生成
5. `/impl` - タスクを実装
6. `/status` - 進捗を確認
