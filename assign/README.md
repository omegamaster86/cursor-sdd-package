# assign プロファイル

既存プロジェクトにアサインする際のカスタム `.cursor` 一式をここに配置します。

- `assign/commands` … アサイン時専用のコマンド定義
- `assign/rules` … アサイン時専用のルール
- `assign/templates` … アサイン時専用のテンプレート

`npx cursor-sdd@latest --mode assign` あるいは対話選択で `assign` を選ぶと、このフォルダ配下が `.cursor/` にコピーされます。

依存に入れる場合は、インストール後にセットアップを実行してください：

```bash
npm i -D cursor-sdd
npx cursor-sdd --mode assign
```
