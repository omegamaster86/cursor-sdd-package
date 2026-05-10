# spec.json 状態管理ルール（共通）

## 目的
- コマンドごとに重複しがちな `spec.json` 更新手順を統一し、更新漏れや整合ズレを防ぐ。

## 基本原則（必須）
- 各コマンドは **固有責務に関わるキーのみ明示** し、共通更新は本ルールに従う。
- 変更を加えたら必ず `updated_at` を更新する。
- フェーズ遷移が起きたら `phase_history` に `{ phase, at, summary }` を追記する。
- 判定値は `passed / failed / not_run / stale / current / incomplete` の既存語彙を使う。

## 共通更新チェックリスト
1. `phase` を現在の成果物フェーズへ更新
2. `updated_at` を更新
3. `phase_history` を追記
4. 対応する `approvals.*` と `quality_gates.*` の状態を更新
5. 影響範囲に応じてトレーサビリティ状態を見直す（詳細は `gate-invalidation-policy.md`）

## 承認フィールドの扱い
- `generated` は成果物生成完了の事実を示す。
- `approved` は人間または自動承認の判断を示す。
- `checked` / `check_result` はレビュー系コマンドでのみ更新する。

## 更新禁止・注意事項
- 不必要に既存の履歴や承認結果を消去しない。
- コマンド責務と無関係なキーは変更しない。
- `ready_for_implementation` / `ready_for_release` は該当フェーズ以外で安易に true にしない。

## コマンド側への適用方法
- 各コマンドの「spec.json 更新」節では、固有キーのみ列挙する。
- 共通更新は次の一文で参照する:
  - `共通の状態更新手順は .cursor/rules/spec-state-management.md に従う。`
