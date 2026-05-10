# 実装ルール

## 必須: 要件単位の実装記録

**要件を実装完了したら、必ず同じターンで spec.json に実装証跡を記録すること。**

### ルール

1. 実装完了後、**同じターン内で** `implementation.red_green_evidence` に RED/GREEN/REFACTOR/VERIFY を追記
2. 後回しにしない、忘れない、例外なし
3. `implementation.tasks_completed` と `implementation.last_task` を必ず更新（キー名は互換維持）

### 理由

- 要件実装の進捗を正確に追跡するため
- ユーザーが何度も指摘する必要がないようにするため

## 必須: RED/GREEN証跡の記録

**実装要件を完了扱いにする前に、spec.json の `implementation.red_green_evidence` に TDD サイクルの証跡を残すこと。**

### 記録する内容

1. `red`: 先に書いたテストの実行コマンド、失敗結果、期待どおり失敗した理由
2. `green`: 最小実装後の実行コマンド、通過結果、変更の要約
3. `refactor`: リファクタの有無、再検証コマンド、結果
4. `verify`: 最終的に実行した関連テストまたは検証コマンド、結果

### スキップ時の扱い

テストコマンドが存在しない、または環境制約で実行できない場合も空欄にしない。`result: "skipped"` とし、`summary` に理由と代替確認を記録する。
