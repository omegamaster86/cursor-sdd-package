# cursor-sdd

Cursor IDE 向けの Spec-Driven Development (SDD) テンプレート、ルール、コマンド集。

## インストール

```bash
# 推奨（都度実行・インストール不要）
npx cursor-sdd@latest

# 依存に入れたい場合（必要な時に自分で実行する）
npm i -D cursor-sdd
```

実行時にプロジェクトの `.cursor/` フォルダにファイルがコピーされます。

### 依存として入れた場合の実行

`npm i -D cursor-sdd` しただけでは `.cursor/` は変更しません。セットアップは明示的に実行してください：

```bash
npx cursor-sdd
```

### 強制上書き

既存の `.cursor/` がある場合は同名ファイルがスキップされます。強制上書きする場合：

```bash
npx cursor-sdd --force
```

## 使い方

Cursor IDE で以下のコマンドが使えるようになります：

| コマンド | 説明 |
|---------|------|
| `/init` | プロジェクト仕様の初期化 |
| `/requirements` | 要件定義書の生成 |
| `/requirements-import` | 既存要件のインポート |
| `/design` | 技術設計書の作成 |
| `/check-design` | 設計書の検証 |
| `/tasks` | タスクの生成 |
| `/impl` | 実装の開始 |
| `/status` | 進捗確認 |
| `/difference-check` | 差分チェック |

### `/init` の使い分け

- **PJ全体を初期化**: `/init <プロジェクト説明>`
- **個別画面/機能を初期化**: `/init --feature billing-history <画面の説明>`
  - `--feature` / `-f` で指定したキーが `.cursor/<PJ名>/<feature>` ディレクトリとして作成されます
  - 以降の `/requirements` などは `<PJ名>/<feature>` を引数に渡してください（例: `/requirements my-project/billing-history`）

## 含まれるファイル

```
.cursor/
├── commands/          # Cursor コマンド定義
│   ├── init.md
│   ├── requirements.md
│   ├── requirements-import.md
│   ├── design.md
│   ├── check-design.md
│   ├── tasks.md
│   ├── impl.md
│   ├── status.md
│   └── difference-check.md
├── rules/             # AI ルール・ガイドライン
│   ├── artifacts-generation.md
│   ├── design-principles.md
│   ├── design-review.md
│   ├── design-discovery-full.md
│   ├── design-discovery-light.md
│   ├── ears-format.md
│   ├── frontend.md
│   ├── gap-analysis.md
│   ├── tasks-generation.md
│   └── tasks-parallel-analysis.md
└── templates/
    ├── artifacts/     # テーブル定義テンプレート
    │   ├── artifacts_rules.md
    │   ├── create-data-model.md
    │   ├── create-feature-list.md
    │   └── create-table-definition.md
    └── specs/         # 仕様書テンプレート
        ├── init.json
        ├── requirements-init.md
        ├── requirements.md
        ├── design.md
        ├── tasks.md
        └── research.md
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
