<meta>
description: 既存の要件ドキュメントをインポート（互換コマンド）
argument-hint: <feature-name:$1>
</meta>

# 既存要件インポート

> 互換運用のための専用コマンド。将来的に `/requirements --import` への統合を検討するが、
> 現時点では本コマンドを正式サポートする。

<background_information>
- **ミッション**: 初期化済み requirements.md に記載された既存要件を正式な要件として取り込み、spec駆動開発のフローに統合
- **成功基準**:
  - `.cursor/$1/requirements.md` の「プロジェクト説明」セクションを要件として整形
  - メタデータを更新してインポート状況を追跡
  - 次のフェーズ（設計生成）への明確なパスを提供
- **前提**: `/requirements` の自動初期化で、ユーザーが要件の元情報を入力済み
</background_information>

<instructions>
## コアタスク
初期化済みの `.cursor/$1/requirements.md` の「プロジェクト説明」セクションを読み取り、正式な要件として整形・統合する。

## 実行ステップ

### ステップ1: 前提条件の確認
- `.cursor/$1/spec.json` が存在することを確認（初期化済み）
- `.cursor/$1/requirements.md` が存在することを確認
- 「## プロジェクト説明（入力）」セクションに内容があることを確認
- `.cursor/rules/spec-state-management.md` と `.cursor/rules/gate-invalidation-policy.md` を読み込み

### ステップ2: 既存要件の読み込み
- `.cursor/$1/requirements.md` から「## プロジェクト説明（入力）」セクションの内容を抽出
- 要件の構造を解析（見出し、箇条書き、番号付きリスト等）
- 複数の要件項目がある場合は個別に識別

### ステップ3: 要件の整形・統合
- 「## プロジェクト説明（入力）」セクションは維持
- 「## 要件」セクションにプロジェクト説明の内容を要件として整形・配置
- 元のフォーマットをできるだけ尊重しつつ、Markdown形式に整形
- **注意**: EARS フォーマットへの強制変換は行わない（元の記述を尊重）
- 要件には連番を付与（1, 2, 3...）

### ステップ4: メタデータの更新
spec.json は、共通ルール `.cursor/rules/spec-state-management.md` と
`.cursor/rules/gate-invalidation-policy.md` に従って更新する。

- `phase: "requirements-imported"` を設定
- `approvals.requirements.generated: true` を設定
- `approvals.requirements.approved: false` を設定
- `approvals.requirements.source: "imported"` を追加
- 下流成果物が既にある場合は、影響確認が必要なため `quality_gates.review.status` と `quality_gates.final_check.status` を `not_run` または `stale` に更新
- `traceability.status: "stale"` を設定

## 重要な制約
- 既存要件の内容を勝手に変更・削除しない
- プロジェクト説明セクションは維持（要件セクションにコピー）
- 元の記述スタイルをできるだけ保持
- インポート後のレビュー機会を提供

</instructions>

## ツールガイダンス
- **Read** を使用: `.cursor/$1/spec.json`、`.cursor/$1/requirements.md`
- **Write** を使用: requirements.md の更新、spec.json の更新
- **Glob** を使用: ファイル存在確認

## 出力説明
spec.json で指定された言語で以下を出力:

1. **インポート結果サマリー**:
   - 取り込んだ要件の概要（主要な要件領域を3-5項目で要約）
   - 要件数
   - フォーマット変換の内容（あれば）

2. **更新されたファイル**:
   - `.cursor/$1/requirements.md`
   - `.cursor/$1/spec.json`

3. **次のステップ**:
   - 内容確認の案内
   - `/design $1` で設計フェーズへ進む方法

**フォーマット要件**:
- Markdown見出しを使用
- ファイルパスはコードブロックに含める
- サマリーは簡潔に（300語以内）

## 安全性とフォールバック

### エラーシナリオ
- **spec.json が見つからない**: `/requirements $1 <要件メモ>` で初期化兼要件生成を案内
- **requirements.md が見つからない**: `/requirements $1 <要件メモ>` で初期化兼要件生成を案内
- **プロジェクト説明が空**: `/requirements $1 <要件メモ>` で要件の元情報入力を案内
- **既に要件セクションに内容がある**: 上書きするか確認をユーザーに求める

### 次のフェーズ: 設計生成

**インポート完了後**:
- `.cursor/$1/requirements.md` でインポートされた要件をレビュー
- 必要に応じて手動で調整
- `/design $1` で設計フェーズに進む

**修正が必要な場合**:
- requirements.md を直接編集
- または `/requirements $1 <要件メモ>` を再実行