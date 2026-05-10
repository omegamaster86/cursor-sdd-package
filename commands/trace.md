<meta>
description: 要件から実装証跡までのトレーサビリティを生成
argument-hint: <feature-name:$1>
</meta>

# トレース生成

<background_information>
 - **ミッション**: requirements.md の要件IDを、design.md と実装証跡に対応付けて追跡可能にする
- **成功基準**:
  - 要件IDごとに設計・実装証跡の対応を一覧化
  - 未マップ要件と証跡不足を明示
  - spec.json の traceability を更新
</background_information>

<instructions>
## コアタスク
機能 **$1** のトレーサビリティを生成し、`.cursor/$1/trace.md` と spec.json を更新する。

本コマンドの責務は、要件から実装証跡までの **一次マッピング情報** を整備すること。
品質判定（PASS/FAIL）は `/review` と `/final-check` に委譲する。

## 実行ステップ

### ステップ1: コンテキストの読み込み
- `.cursor/$1/spec.json`
- `.cursor/$1/requirements.md`
- `.cursor/$1/design.md`
- `implementation.red_green_evidence`
- `.cursor/rules/spec-state-management.md` と `.cursor/rules/gate-invalidation-policy.md`

### ステップ2: 要件IDの抽出
- requirements.md から数値要件IDを抽出する
  - 例: `1`、`1.1`、`2.3`
- アルファベットIDや自由形式ラベルは警告する
- 受け入れ基準が数値IDを持つ場合は、できるだけ細かいIDを優先する

### ステップ3: 対応付け
以下の順で対応付ける:

1. **Design**: design.md の要件トレーサビリティ、コンポーネント表、本文中の要件ID
2. **Implementation Evidence**: `implementation.red_green_evidence[].task` と完了記録

### ステップ4: trace.md の作成
`.cursor/$1/trace.md` を作成または更新し、以下の構造で記録する:

```markdown
# トレーサビリティ

## サマリー
- 要件数:
- マップ済み要件:
- 未マップ要件:
- 証跡不足:

## 要件トレース
| 要件ID | 設計 | 実装証跡 | 状態 |
| ------ | ---- | -------- | ---- |
| 1.1 | design.md#... | RED/GREENあり | OK |

## 未マップ / リスク
- ...
```

### ステップ5: spec.json の更新
- 共通更新は `.cursor/rules/spec-state-management.md` に従う
- 未マップ要件がなく、完了記録の証跡が確認できる場合:
  - `traceability.status: "current"`
- 未マップ要件または証跡不足がある場合:
  - `traceability.status: "incomplete"`
- 共通更新:
  - `traceability.updated_at` を更新
  - `traceability.requirement_count` を設定
  - `traceability.mapped_task_count` を設定（互換キーとして実装済み要件数を格納）
  - `traceability.unmapped_requirements` を設定
  - `quality_gates.final_check.status` は `.cursor/rules/gate-invalidation-policy.md` に従って更新

## 重要な制約
- Coherence / impact analysis のような依存グラフは作らない
- 文字列一致だけに頼りすぎず、requirements/design/spec.json 証跡を一次情報として扱う
- 対応が曖昧な場合は推測で OK にせず、リスクに記録する
- trace.md は軽量な確認表に留める
</instructions>

## ツールガイダンス
- **Read**: spec、requirements、design を読み込む
- **慎重に解析**: 要件IDとTDD証跡を対応付ける
- **最後に書き込み**: trace.md と spec.json を更新する

## 出力説明
spec.json で指定された言語で以下を出力:

1. **トレースサマリー**: 要件数、マップ済み数、未マップ数
2. **不足/リスク**: 未マップ要件、証跡不足、曖昧な対応
3. **更新ファイル**: trace.md と spec.json
4. **次のアクション**: `/review $1` または `/final-check $1`

**フォーマット**: 簡潔（250語以内）

## 安全性とフォールバック
- **requirements.md がない**: `/requirements $1` を案内して停止
- **要件IDが不正**: 数値IDへの修正を案内
- **実装前**: 実装証跡がないことをリスクではなく「未実装」として記録
</output>
