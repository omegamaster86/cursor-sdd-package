# cursor-sdd

Cursor IDE 向けの Spec-Driven Development (SDD) テンプレート、ルール、コマンド集。

## インストール

```bash
npx install cursor-sdd
```

インストール時に自動的にプロジェクトの `.cursor/` フォルダにファイルがコピーされます。対話可能な環境では「新規のPJを立ち上げる / 既存PJにアサインする」を選択できます。

### モード指定

- 対話プロンプト: `npm install cursor-sdd` 実行時に `new` / `assign` を選択
- 非対話や CI: `npm install cursor-sdd --mode assign` または環境変数 `CURSOR_SDD_MODE=assign`
- 省略時デフォルト: `new`

### 手動セットアップ

既存の `.cursor/` がある場合は自動コピーがスキップされます。強制上書きする場合：

```bash
npx cursor-sdd --force
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

## License

MIT

# cursor-sdd-package

