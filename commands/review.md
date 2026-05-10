<meta>
description: 仕様・実装・証跡の軽量レビューを実施
argument-hint: <feature-name:$1>
</meta>

# 実装レビュー

<background_information>
- **ミッション**: 要件、設計、実装差分、TDD証跡を照合し、リリース前に重大な不整合を発見する
- **成功基準**:
  - 要件に対する実装漏れや設計逸脱を特定
  - RED/GREEN証跡が要件実装と対応しているか確認
  - 最大5件の重要 findings に絞って報告
  - spec.json の review ゲートを更新
</background_information>

<instructions>
## コアタスク
機能 **$1** の軽量レビューを実施し、結果を `.cursor/$1/review.md` と spec.json に記録する。

本コマンドは **実装妥当性と重大リスクの検出** を担う。
リリース可否の最終集約判断は `/final-check` で行う。

## 実行ステップ

### ステップ1: コンテキストの読み込み
- `.cursor/$1/spec.json`
- `.cursor/$1/requirements.md`
- `.cursor/$1/design.md`
- `.cursor/$1/trace.md`（存在する場合）
- 実装差分（利用可能なら git diff）
- `implementation.red_green_evidence`
- `.cursor/rules/spec-state-management.md`

### ステップ2: レビュー観点
以下を確認する:

1. **要件忠実性**: requirements.md の要件IDが実装証跡と対応しているか
2. **設計整合性**: design.md の境界・契約・制約から逸脱していないか
3. **実装完了の妥当性**: 実装差分と spec.json の完了記録が一致するか
4. **TDD証跡**: 完了記録ごとに RED/GREEN/VERIFY の記録があるか
5. **リスク**: セキュリティ、データ破壊、互換性、未実行テストなどの重大リスク

### ステップ3: review.md の作成
`.cursor/$1/review.md` を作成または更新し、以下の構造で記録する:

```markdown
# 実装レビュー

## 判定
PASS / FAIL

## Findings
- [critical|major|minor] FIND-001: タイトル
  - 根拠:
  - 影響:
  - 推奨:
  - 関連要件:

## TDD証跡
- 完了記録:
- 証跡あり:
- 証跡不足:

## 次のアクション
- ...
```

### ステップ4: spec.json の更新
- 共通更新は `.cursor/rules/spec-state-management.md` に従う
- findings に critical または major がない場合:
  - `quality_gates.review.status: "passed"`
- critical または major がある場合:
  - `quality_gates.review.status: "failed"`
- 共通更新:
  - `phase: "reviewed"`
  - `quality_gates.review.reviewed_at` を更新
  - `quality_gates.review.critical_findings` に critical + major の件数を設定
  - `quality_gates.review.summary` に判定要約を設定
  - `ready_for_release: false` を設定

## 重要な制約
- Claude Code 専用の adversary agent や hooks は使わない
- 完璧な網羅レビューではなく、重大な問題の検出に集中する
- findings は最大5件に絞る
- 根拠のない推測で FAIL にしない
- 未実行テストや証跡不足は明示する
</instructions>

## ツールガイダンス
- **最初に読み込み**: spec と関連ドキュメントをすべて読み込む
- **必要に応じて検索**: 実装差分や関連コードを確認する
- **最後に書き込み**: review.md と spec.json を更新する

## 出力説明
spec.json で指定された言語で以下を出力:

1. **レビュー判定**: PASS / FAIL と理由
2. **主要 findings**: 最大5件
3. **TDD証跡の状態**: 不足があれば明記
4. **次のアクション**: 修正、再レビュー、または `/final-check $1`

**フォーマット**: 簡潔（300語以内）

## 安全性とフォールバック
- **必須ファイル不足**: 不足ファイルを列挙し、前フェーズのコマンドを案内
- **実装差分が読めない**: ドキュメントと spec.json 証跡ベースでレビューし、差分未確認をリスクとして明記
- **TDD証跡不足**: FAIL ではなく、完了記録に対する不足が重大な場合のみ major finding にする
</output>
