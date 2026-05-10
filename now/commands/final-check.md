<meta>
description: リリース前の最終整合性チェックを実施
argument-hint: <feature-name:$1>
</meta>

# 最終チェック

<background_information>
- **ミッション**: 仕様、実装、レビュー、トレース、検証証跡がリリース可能な状態に収束しているか確認
- **成功基準**:
  - すべての必須フェーズが完了
  - review ゲートが PASS
  - 完了タスクに TDD 証跡がある
  - trace が最新で未マップ要件を示していない
  - spec.json に最終判定が記録される
</background_information>

<instructions>
## コアタスク
機能 **$1** の最終チェックを実施し、`.cursor/$1/final-check.md` と spec.json に結果を記録する。

## 実行ステップ

### ステップ1: コンテキストの読み込み
- `.cursor/$1/spec.json`
- `.cursor/$1/requirements.md`
- `.cursor/$1/design.md`
- `.cursor/$1/tasks.md`
- `.cursor/$1/review.md`（存在する場合）
- `.cursor/$1/trace.md`（存在する場合）
- `implementation.red_green_evidence`

### ステップ2: チェック項目
以下を確認する:

1. **成果物**: requirements/design/tasks が存在し、生成済みフラグが true
2. **承認**: requirements/design/tasks が承認済み
3. **実装**: 通常タスクが完了し、`implementation.completed` が true または tasks.md から完了と判断できる
4. **TDD証跡**: 完了タスクごとに RED/GREEN/VERIFY が記録されている
5. **レビュー**: `quality_gates.review.status` が `"passed"`
6. **トレース**: `traceability.status` が `"current"` で、未マップ要件がない
7. **未解決リスク**: 未実行テスト、手動確認、既知の制約が残っていないか

### ステップ3: final-check.md の作成
`.cursor/$1/final-check.md` を作成または更新し、以下の構造で記録する:

```markdown
# 最終チェック

## 判定
READY / NOT READY

## チェック結果
- Requirements:
- Design:
- Tasks:
- Implementation:
- Review:
- Trace:
- Tests:

## 未解決事項
- ...

## 次のアクション
- ...
```

### ステップ4: spec.json の更新
- すべてのチェックが通過した場合:
  - `quality_gates.final_check.status: "passed"`
  - `ready_for_release: true`
  - `phase: "completed"`
- いずれかが未通過の場合:
  - `quality_gates.final_check.status: "failed"`
  - `ready_for_release: false`
  - `phase: "final-check-failed"`
- 共通更新:
  - `quality_gates.final_check.checked_at` を更新
  - `quality_gates.final_check.summary` に判定要約を設定
  - `phase_history` に `{ phase, at, summary }` を追記
  - `updated_at` を更新

## 重要な制約
- 最終チェックは新しい実装を行わない
- 失敗時は不足項目と再実行すべきコマンドを明示する
- テスト未実行を成功扱いにしない。実行不能な場合は理由と代替確認を記録し、リスクとして扱う
- Coherence / impact analysis はこの軽量版では必須にしない。必要な場合は将来拡張として扱う
</instructions>

## ツールガイダンス
- **Read/Glob**: 必須成果物と spec.json を確認
- **必要に応じて差分確認**: 未コミット差分とレビュー結果の整合を見る
- **最後に書き込み**: final-check.md と spec.json を更新

## 出力説明
spec.json で指定された言語で以下を出力:

1. **最終判定**: READY / NOT READY
2. **通過項目**: 簡潔なチェック結果
3. **未解決事項**: あれば具体的に
4. **次のアクション**: 修正、`/review $1`、`/trace $1`、再度 `/final-check $1`

**フォーマット**: 簡潔（250語以内）

## 安全性とフォールバック
- **review 未実行**: `/review $1` を案内して NOT READY
- **trace 未生成/古い**: `/trace $1` を案内して NOT READY
- **TDD証跡不足**: 対象タスクを列挙して NOT READY
- **タスク未完了**: 残タスクを列挙して NOT READY
</output>
