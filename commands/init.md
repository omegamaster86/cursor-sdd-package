<meta>
description: 詳細なプロジェクト説明で新しい仕様を初期化
argument-hint: <project-description>
</meta>

# Spec 初期化

<background_information>
- **ミッション**: 新しい仕様のディレクトリ構造とメタデータを作成し、spec駆動開発の最初のフェーズを初期化
- **成功基準**:
  - ワークスペースのルートフォルダ名をプロジェクト名として使用
  - `.cursor/[ルートフォルダ名]/` にspec構造を作成
  - 次のフェーズ（要件生成）への明確なパスを提供
</background_information>

<instructions>
## コアタスク
ワークスペースのルートフォルダ名をプロジェクト名として使用し、仕様構造を初期化する。

## 実行ステップ

### ステップ1: プロジェクト名と対象キーの取得
- ワークスペースのルートフォルダ名をプロジェクト名として使用する。
- `$ARGUMENTS` に `--feature <key>` または `-f <key>` が含まれる場合は、個別機能として初期化する。
  - `PROJECT_NAME` はルートフォルダ名
  - `FEATURE_KEY` は指定された key
  - `FEATURE_NAME` は指定された key（説明から明確な表示名を抽出できる場合のみ自然な名前にする）
  - `FEATURE_PATH` は `[PROJECT_NAME]/[FEATURE_KEY]`
- `--feature` がない場合は、プロジェクト全体として初期化する。
  - `FEATURE_KEY` と `FEATURE_NAME` はルートフォルダ名
  - `FEATURE_PATH` は `[PROJECT_NAME]`

### ステップ2: ディレクトリ作成
`.cursor/[FEATURE_PATH]/` と `.cursor/[FEATURE_PATH]/artifacts/` を作成する。

### ステップ3: テンプレートを使用してファイルを初期化
- `.cursor/templates/specs/init.json` を読み込み
- `.cursor/templates/specs/requirements-init.md` を読み込み
- プレースホルダーを置換:
  - `{{PROJECT_NAME}}` → ルートフォルダ名（プロジェクト名）
  - `{{FEATURE_NAME}}` → 対象名
  - `{{FEATURE_KEY}}` → 対象キー
  - `{{FEATURE_PATH}}` → `.cursor/` 配下の相対パス
  - `{{INIT_MODE}}` → `project` または `feature`
  - `{{TIMESTAMP}}` → 現在の日付（YYYY/MM/DD 形式）
  - `{{PROJECT_DESCRIPTION}}` → `--feature` 指定を除いた説明文
- `spec.json` と `requirements.md` を `.cursor/[FEATURE_PATH]/` に書き込み

## 重要な制約
- この段階で requirements/design/tasks を生成しない
- ステージごとの開発原則に従う
- 厳格なフェーズ分離を維持
- このフェーズでは初期化のみを実行
- spec.json の新しい状態管理フィールド（`phase_history`、`implementation`、`quality_gates`、`traceability`）を削除しない
</instructions>

## ツールガイダンス
- **Glob** を使用して `.cursor/[ルートフォルダ名]/` が既に存在するか確認
- **Read** を使用してテンプレートを取得: `init.json` と `requirements-init.md`
- **Write** を使用してプレースホルダー置換後に spec.json と requirements.md を作成
- ファイル書き込み操作前に検証を実行

## 出力説明
`spec.json` で指定された言語で以下の構造で出力:

1. **プロジェクト名 / 対象**: ルートフォルダ名と FEATURE_PATH
2. **プロジェクトサマリー**: 簡潔なサマリー（1文）
3. **作成されたファイル**: フルパス付きの箇条書きリスト
4. **次のステップ**: `/requirements` を示すコマンドブロック
5. **注記**: 初期化のみが実行された理由の説明（フェーズ分離について2-3文）

**フォーマット要件**:
- Markdown見出しを使用（##、###）
- コマンドはコードブロックで囲む
- 総出力は簡潔に（250語以内）
- `spec.json.language` に従った明確でプロフェッショナルな言語を使用

## 安全性とフォールバック
- **テンプレートが見つからない**: `.cursor/templates/specs/` にテンプレートファイルが存在しない場合、具体的な不足ファイルパスでエラーを報告し、リポジトリセットアップの確認を提案
- **ディレクトリ既存**: `.cursor/[FEATURE_PATH]/` が既に存在する場合、上書きするか確認をユーザーに求める
- **書き込み失敗**: 具体的なパスでエラーを報告し、権限またはディスク容量の確認を提案

</output>
