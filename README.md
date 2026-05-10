# cursor-sdd-package

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
| `/requirements` | 要件定義書の生成 |
| `/requirements-import` | 既存要件のインポート |
| `/design` | 技術設計書の作成 |
| `/check-design` | 設計書の検証 |
| `/tasks` | タスクの生成 |
| `/impl` | 実装の開始 |
| `/review` | 仕様・実装・TDD証跡のレビュー |
| `/trace` | 要件から実装証跡までのトレース生成 |
| `/final-check` | リリース前の最終整合性チェック |
| `/status` | 進捗確認 |
| `/difference-check` | 差分チェック |

### 入口（推奨）

- **まず `/requirements` から開始**: `/requirements <feature-name> <要件/背景メモ>`
- 既に `.cursor/<feature-name>/` があれば、その内容を読み込んで要件を更新
- 未初期化なら、`/requirements` が初期化を兼ねて作成してから要件生成

## 含まれるファイル

```
.cursor/
├── commands/          # Cursor コマンド定義
│   ├── requirements.md
│   ├── requirements-import.md
│   ├── design.md
│   ├── check-design.md
│   ├── tasks.md
│   ├── impl.md
│   ├── review.md
│   ├── trace.md
│   ├── final-check.md
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
│   ├── implementation.md
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
/requirements → /design → /tasks → /impl → /trace → /review → /final-check
      ↑                  ↓          ↓        ↓
            /status ←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←
```

`spec.json` は各フェーズの承認状態、TDD の RED/GREEN 証跡、レビュー結果、最終チェック結果、トレーサビリティ状態を保持します。Coherence / impact analysis のような依存グラフは軽量版では含めず、必要になった場合の将来拡張として扱います。
