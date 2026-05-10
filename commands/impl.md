<meta>
description: TDD手法を使用して要件ベースの実装を実行
argument-hint: <feature-name:$1> [requirement-ids:$2]
</meta>

# 実装実行

<background_information>
- **ミッション**: 承認済み仕様に基づいて、テスト駆動開発手法を使用して要件ベース実装を進める
- **成功基準**:
  - すべてのテストを実装コードより先に記述
  - コードがすべてのテストに合格しリグレッションなし
  - 対象要件に対する実装証跡が spec.json に記録される
  - 実装が設計と要件に整合
</background_information>

<instructions>
## コアタスク
テスト駆動開発を使用して、機能 **$1** の要件ベース実装を実行する。

## 実行ステップ

### ステップ1: コンテキストの読み込み

**必要なすべてのコンテキストを読み込み**:
- `.cursor/$1/spec.json`、`requirements.md`、`design.md`
- `.cursor/rules/implementation.md` から実装ルール参照（必須）
- `.cursor/rules/frontend.md`（存在する場合）からフロントエンド実装ルール

**承認の検証**:
- spec.json で要件と設計が承認されていることを確認（未承認なら停止、安全性とフォールバック参照）
- `ready_for_implementation` が false かつ設計承認済みの場合は、spec.json を補正して `ready_for_implementation: true` に更新する。

### ステップ2: 実装スコープの選択

**実行する要件を決定**:
- `$2` が提供された場合: 指定された要件IDを実行（例: "1.1" または "1.1,2.3"）
- それ以外: requirements.md の未実装要件を対象に実装（既存証跡から進捗を判断）

### ステップ3: TDDで実行

選択された各要件について、Kent BeckのTDDサイクルに従う:

1. **RED - 失敗するテストを書く**:
   - 次の小さな機能のテストを書く
   - テストは失敗するはず（コードがまだ存在しない）
   - 説明的なテスト名を使用
   - 失敗したテストコマンド、失敗理由の要約、対象要件を記録

2. **GREEN - 最小限のコードを書く**:
   - テストを通過させる最もシンプルなソリューションを実装
   - このテストを通過させることだけにフォーカス
   - オーバーエンジニアリングを避ける
   - 通過したテストコマンド、変更ファイルの要約を記録

3. **REFACTOR - クリーンアップ**:
   - コード構造と可読性を改善
   - 重複を削除
   - 適切な箇所にデザインパターンを適用
   - リファクタリング後もすべてのテストが通過することを確認
   - リファクタ有無、再実行したテストコマンドを記録

4. **VERIFY - 品質を検証**:
   - すべてのテストが通過（新規と既存）
   - 既存機能にリグレッションなし
   - コードカバレッジを維持または改善
   - 最終検証コマンドと結果を記録

5. **spec.json への証跡記録**（必須）:
   - `phase: "implementation"` を設定
   - `implementation.started: true` を設定
   - 完了した要件IDを `implementation.tasks_completed` に追加（既存キーを互換維持として流用、重複しない）
   - `implementation.last_task` に最後に実行した要件IDを設定
   - `implementation.red_green_evidence` に、各要件ごとに以下の形式で追記:

```json
{
  "task": "1.1",
  "at": "YYYY/MM/DD",
  "red": {
    "command": "npm test -- example",
    "result": "failed",
    "summary": "期待する失敗理由"
  },
  "green": {
    "command": "npm test -- example",
    "result": "passed",
    "summary": "最小実装で通過"
  },
  "refactor": {
    "changed": true,
    "command": "npm test -- example",
    "result": "passed",
    "summary": "重複を整理"
  },
  "verify": {
    "command": "npm test",
    "result": "passed",
    "summary": "関連テストが通過"
  }
}
```

   - 対象要件すべての実装証跡が揃った場合 `implementation.completed: true` を設定
   - 実装が進んだら `quality_gates.review.status`、`quality_gates.final_check.status`、`traceability.status` を `"stale"` に更新
   - `phase_history` に `{ phase: "implementation", at, summary }` を追記
   - `updated_at` を更新

## 重要な制約
- **TDD必須**: テストは実装コードより先に書かなければならない
- **要件スコープ**: 指定された要件が要求するものだけを実装
- **テストカバレッジ**: すべての新しいコードにテストが必要
- **リグレッションなし**: 既存のテストは引き続き通過しなければならない
- **設計整合性**: 実装は design.md 仕様に従わなければならない
- **証跡必須**: RED/GREEN/REFACTOR/VERIFY のコマンドと結果を spec.json に残さなければならない。実行できないコマンドがある場合は `result: "skipped"` と理由を summary に記録する。
</instructions>

## ツールガイダンス
- **最初に読み込み**: 実装前にすべてのコンテキストを読み込み
- **テストファースト**: コードより先にテストを書く
- 必要に応じてライブラリドキュメントのため **WebSearch/WebFetch** を使用

## 出力説明

spec.json で指定された言語で簡潔なサマリーを提供:

1. **実行された要件**: 要件IDとテスト結果
2. **ステータス**: 記録済み実装証跡数、残り要件の目安
3. **TDD証跡**: RED/GREEN/VERIFY の記録先と、スキップした検証があれば理由

**フォーマット**: 簡潔（150語以内）

## 安全性とフォールバック

### エラーシナリオ

**要件/設計が未承認またはSpecファイルが見つからない**:
- **実行停止**: すべてのspecファイルが存在し、要件と設計が承認されていなければならない
- **提案アクション**: "前のフェーズを完了してください: `/requirements`、`/design`"

**テスト失敗**:
- **実装停止**: 続行前に失敗したテストを修正
- **アクション**: デバッグして修正、その後再実行
- **証跡**: 失敗した RED または VERIFY のコマンドと原因を spec.json に記録し、対象要件は未完了のままにする

### 要件指定実行

**特定の要件を実行**:
- `/impl $1 1.1` - 単一要件
- `/impl $1 1.1,2.3` - 複数要件

**未実装要件を順次実行**:
- `/impl $1` - 未実装要件を順次実行

</output>
