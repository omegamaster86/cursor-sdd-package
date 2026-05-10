<meta>
description: 仕様のステータスと進捗を表示
argument-hint: <feature-name:$1>
</meta>

# 仕様ステータス

<background_information>
- **ミッション**: 仕様の包括的なステータスと進捗を表示
- **成功基準**:
  - 現在のフェーズと完了状況を表示
  - 次のアクションとブロッカーを特定
  - 進捗の明確な可視性を提供
</background_information>

<instructions>
## コアタスク
機能 **$1** のステータスレポートを生成し、すべてのフェーズの進捗を表示する。

## 実行ステップ

### ステップ1: Specコンテキストの読み込み
- `.cursor/$1/spec.json` からメタデータとフェーズステータスを読み込み
- 既存ファイルを読み込み: `requirements.md`、`design.md`、`trace.md`（存在する場合）
- `.cursor/$1/` ディレクトリで利用可能なファイルを確認

### ステップ2: ステータスの分析
- **Requirements**: 要件と受け入れ基準の数をカウント
- **Design**: アーキテクチャ、コンポーネント、ダイアグラムを確認
- **Approvals**: spec.json で承認状況を確認
- **Implementation**: `implementation.started/completed`、完了記録、RED/GREEN証跡数を確認
- **Quality Gates**: `quality_gates.design_check/review/final_check` の status を確認
- **Traceability**: `traceability.status`、未マップ要件、`trace.md` の有無を確認
- **Phase History**: `phase_history` の最新3件を確認

### ステップ3: レポートの生成
spec.json で指定された言語でレポートを作成し、以下をカバー:
- **現在のフェーズと進捗**: ワークフローにおけるspecの位置
- **完了状況**: 各フェーズの完了率
- **実装内訳**: 証跡がある場合、完了/残り要件の目安を表示
- **次のアクション**: 次に何をすべきか
- **ブロッカー**: 進捗を妨げる問題
- **品質ゲート**: design check、review、final check、trace の状態
- **TDD証跡**: 実装済み要件に対して RED/GREEN/VERIFY の記録があるか

## 重要な制約
- spec.json の言語を使用
- 正確な完了率を計算
- 具体的な次のアクションコマンドを特定
</instructions>

## ツールガイダンス
- **Read**: 最初に spec.json を読み込み、次に必要に応じて他のspecファイルを読み込み
- **慎重に解析**: requirements と spec.json の証跡から完了データを抽出
- **Glob** を使用してどのspecファイルが存在するか確認

## 出力説明

spec.json で指定された言語でステータスレポートを提供:

**レポート構造**:
1. **機能概要**: 名前、フェーズ、最終更新
2. **フェーズステータス**: Requirements、Design、Implementation と完了率
3. **実装進捗**: 証跡が存在する場合、X/Y 要件完了の目安を表示
4. **実装証跡**: 完了記録数、TDD証跡数、最後の実装対象
5. **品質ゲート**: `/check-design`、`/review`、`/final-check`、`/trace` の状態
6. **次のアクション**: 次に実行する具体的なコマンド
7. **問題**: ブロッカーや不足要素

**フォーマット**: ステータス用の絵文字（✅/⏳/❌/⚠️）で明確でスキャンしやすいフォーマット

## 安全性とフォールバック

### エラーシナリオ

**Specが見つからない**:
- **メッセージ**: "`$1` のspecが見つかりません。`.cursor/` で利用可能なspecを確認してください"
- **アクション**: `.cursor/` 内の利用可能な機能ディレクトリをリスト

**不完全なSpec**:
- **警告**: どのファイルが不足しているか特定
- **提案アクション**: 次のフェーズコマンドを指示

### すべてのSpecをリスト

すべての利用可能なspecを見るには:
- 引数なしで実行またはワイルドカードを使用
- `.cursor/` 内のすべてのspecをステータス、ゲート状態、最終更新日とともに表示

</output>
