<meta>
description: 詳細なプロジェクト説明で新しい仕様を初期化
argument-hint: [-f|--feature <feature-key>] <project-description>
</meta>

# Spec 初期化

<background_information>
- **ミッション**: PJ 全体または機能単位の仕様ディレクトリとメタデータを作成し、SDD の最初のフェーズを初期化
- **成功基準**:
  - ワークスペースのルートフォルダ名をプロジェクト名として使用
  - `.cursor/<project>/`（PJ全体）または `.cursor/<project>/<feature>/`（機能単位）に spec 構造を作成
  - 次フェーズ（要件生成）への明確なパスを提供
</background_information>

<instructions>
## コアタスク
ワークスペースのルートフォルダ名をプロジェクト名として使用し、PJ 全体または `--feature/-f` で指定された機能サブディレクトリの仕様構造を初期化する。

## 実行ステップ
1. **プロジェクト名の取得**: 現在のワークスペースのルートフォルダ名を `project_name` として使用。
2. **引数解析とスラッグ化**:
   - `$ARGUMENTS` から `--feature foo` / `--feature=foo` / `-f foo` を検出。
   - フラグが存在する場合は値を正規化:
     - 前後の空白を除去し、小文字へ変換。
     - スペース・`/`・`_`・`.` を `-` に置換。
     - `[^a-z0-9-]` を削除、連続ハイフンは 1 つに圧縮、先頭末尾の `-` を除去。
   - スラッグが空になった場合はエラーとして停止（ユーザーに別名指定を依頼）。
   - フラグ部分を除いた残りをプロジェクト説明として使用（空なら「説明未入力」と記載）。
3. **ターゲットパス決定**:
   - `projectDir = .cursor/<project_name>/`
   - `feature_mode = (feature_key が存在する場合 true)`
   - `targetDir = feature_mode ? .cursor/<project_name>/<feature_key>/ : projectDir`
   - `feature_name_for_template` = feature_mode ? `<project_name>/<feature_key>` : `<project_name>`
   - `feature_path = targetDir`
   - `feature_identifier` = feature_mode ? `<project_name>/<feature_key>` : `<project_name>`
4. **存在確認とディレクトリ作成**:
   - `Glob` で `targetDir` の存在を確認。
   - 既に `spec.json` がある場合はユーザーへ上書き可否を尋ね、許可が得られなければ安全に停止。
   - `projectDir` および `targetDir` を再帰的に作成（feature モード時は projectDir も保証）。
5. **テンプレートの読み込みと置換**:
   - `.cursor/templates/specs/init.json`
   - `.cursor/templates/specs/requirements-init.md`
   - 置換マップ:
     - `{{PROJECT_NAME}}` → `project_name`
     - `{{FEATURE_NAME}}` → `feature_name_for_template`
     - `{{FEATURE_KEY}}` → `feature_key`（feature モード以外は `project_name` を使用）
     - `{{FEATURE_PATH}}` → `feature_path`
     - `{{INIT_MODE}}` → `"feature"` または `"project"`
     - `{{TIMESTAMP}}` → 現在の ISO 8601 タイムスタンプ
     - `{{PROJECT_DESCRIPTION}}` → 解析済み説明文
6. **ファイル書き込み**: `spec.json` と `requirements.md` を `targetDir` に書き込む。
   - 今後の `/requirements` 以降の案内では `feature_identifier` を渡す。

## 重要な制約
- この段階で requirements/design/tasks を生成しない
- PJ 全体モードと機能モードで共通のテンプレ・ルールを使い、記録されるパス/名称のみを切り替える
- 厳格なフェーズ分離を維持し、初期化のみを実行
</instructions>

## ツールガイダンス
- **Glob**: `.cursor/<project_name>/` と `targetDir` の存在確認に使用
- **Read**: テンプレート `init.json` と `requirements-init.md` の取得
- **Write**: 置換済みテンプレートを `targetDir` に保存
- ディレクトリ新規作成時は `projectDir` → `targetDir` の順で検証

## 出力説明
`spec.json.language` に従い、以下を 250 語以内で報告:

1. **プロジェクト**: ルートフォルダ名
2. **対象スコープ**: `PJ全体` または `<feature_key>`（feature モード時は表示名に `<project>/<feature>` を含める）
3. **サマリー**: 初期化内容を 1 文で記述
4. **作成されたファイル**: フルパス付き箇条書き
5. **次のステップ**: `\`/requirements <feature_identifier>\`` を含むコードブロック
6. **注記**: 初期化のみ実施した理由（フェーズ分離）を 2-3 文

## 安全性とフォールバック
- **テンプレートが見つからない**: `.cursor/templates/specs/` にテンプレートファイルが存在しない場合、具体的な不足ファイルパスでエラーを報告し、リポジトリセットアップの確認を提案
- **ディレクトリ既存**: `targetDir` に既存 `spec.json` がある場合はユーザーの明示的同意なしに上書きしない。必要に応じて新しい `feature_key` を案内。
- **書き込み失敗**: 具体的パスを示し、権限またはディスク容量を確認するよう提案

</output>
