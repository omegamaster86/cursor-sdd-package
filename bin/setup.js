#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const isAuto = process.argv.includes('--auto');
const isForce = process.argv.includes('--force');

// パッケージのルートディレクトリを取得
const packageRoot = path.resolve(__dirname, '..');
const FOLDERS_BY_MODE = {
  new: ['commands', 'rules', 'templates'],
  assign: ['assign'],
};

// プロジェクトのルートを取得（node_modules の2つ上）
function getProjectRoot() {
  let current = process.cwd();

  // npm install 経由の場合は INIT_CWD を使用
  if (process.env.INIT_CWD) {
    return process.env.INIT_CWD;
  }

  // node_modules から呼ばれた場合
  const nodeModulesIndex = __dirname.indexOf('node_modules');
  if (nodeModulesIndex !== -1) {
    return __dirname.substring(0, nodeModulesIndex);
  }

  return current;
}

const projectRoot = getProjectRoot();
const targetDir = path.join(projectRoot, '.cursor');

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;

  const stat = fs.statSync(src);

  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    for (const item of fs.readdirSync(src)) {
      copyRecursive(path.join(src, item), path.join(dest, item));
    }
  } else {
    // ファイルが既に存在する場合はスキップ（--force でない限り）
    if (fs.existsSync(dest) && !isForce) {
      console.log(`  ⏭️  Skip (exists): ${path.relative(projectRoot, dest)}`);
      return;
    }
    fs.copyFileSync(src, dest);
    console.log(`  ✅ ${path.relative(projectRoot, dest)}`);
  }
}

function getArgValue(flag) {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return null;
  const next = process.argv[idx + 1];
  if (!next || next.startsWith('-')) return null;
  return next;
}

function normalizeMode(value) {
  if (!value) return null;
  const lower = value.toLowerCase();
  if (lower === 'assign' || lower === 'a') return 'assign';
  if (lower === 'new' || lower === 'n') return 'new';
  return null;
}

function hasTTY() {
  if (process.stdout.isTTY && process.stdin.isTTY) return true;
  // npm install 時に stdin がパイプ扱いになる場合のため /dev/tty を確認
  try {
    fs.accessSync('/dev/tty', fs.constants.R_OK | fs.constants.W_OK);
    return true;
  } catch {
    return false;
  }
}

function createTTYInterface() {
  // stdin が非TTYでも /dev/tty を使って対話できるようにする
  const input = process.stdin.isTTY
    ? process.stdin
    : (() => {
      try {
        return fs.createReadStream('/dev/tty');
      } catch {
        return process.stdin;
      }
    })();
  const output = process.stdout; // 出力は常に標準出力に寄せる
  return readline.createInterface({ input, output });
}

function shouldPromptForMode(explicitMode) {
  return !explicitMode && hasTTY() && !process.env.CI;
}

async function askMode() {
  const rl = createTTYInterface();
  const answer = await new Promise((resolve) => {
    rl.question('新規PJを立ち上げますか？既存PJにアサインしますか？ [n]ew/[a]ssign (default: new): ', resolve);
  });
  rl.close();
  return normalizeMode(answer) || 'new';
}

function resolveMode() {
  const explicitMode = normalizeMode(getArgValue('--mode') || process.env.CURSOR_SDD_MODE);
  if (explicitMode) return Promise.resolve(explicitMode);
  if (shouldPromptForMode(explicitMode)) {
    return askMode();
  }
  return Promise.resolve('new');
}

function getFolders(mode) {
  const candidates = FOLDERS_BY_MODE[mode] || [];
  return candidates.filter((folder) => fs.existsSync(path.join(packageRoot, folder)));
}

function setup({ mode, sourceRoot, folders }) {
  console.log('\n🚀 Setting up Cursor SDD...\n');
  console.log(`📁 Target: ${targetDir}`);
  console.log(`🎚️  Mode: ${mode}\n`);

  // 自動実行時は既存の .cursor がある場合スキップ
  if (isAuto && fs.existsSync(targetDir) && !isForce) {
    console.log('ℹ️  .cursor already exists. Run `npx cursor-sdd --force` to overwrite.');
    process.exit(0);
  }

  // .cursor ディレクトリを作成
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  if (!folders.length) {
    console.log(`ℹ️  No folders to copy for mode: ${mode}.`);
    return;
  }

  // 各フォルダをコピー
  for (const folder of folders) {
    const src = path.join(sourceRoot, folder);
    const dest = path.join(targetDir, folder);

    console.log(`📂 ${folder}/`);
    copyRecursive(src, dest);
  }

  console.log('\n✨ Cursor SDD setup complete!\n');
  console.log('Available commands:');
  console.log('  /init         - Initialize project specs');
  console.log('  /requirements - Generate requirements');
  console.log('  /design       - Create design document');
  console.log('  /tasks        - Generate tasks');
  console.log('  /impl         - Implementation');
  console.log('  /status       - Check status\n');
}

(async () => {
  const mode = await resolveMode();
  const sourceRoot = packageRoot;
  const folders = getFolders(mode);

  setup({ mode, sourceRoot, folders });
})().catch((err) => {
  console.error(err);
  process.exit(1);
});

