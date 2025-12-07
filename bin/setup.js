#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const isAuto = process.argv.includes('--auto');
const isForce = process.argv.includes('--force');

// パッケージのルートディレクトリを取得
const packageRoot = path.resolve(__dirname, '..');

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

const folders = ['templates', 'rules', 'commands'];

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

function setup() {
  console.log('\n🚀 Setting up Cursor SDD...\n');
  console.log(`📁 Target: ${targetDir}\n`);
  
  // .cursor ディレクトリを作成
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  // 各フォルダをコピー
  for (const folder of folders) {
    const src = path.join(packageRoot, folder);
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

// 自動実行時は既存の .cursor がある場合スキップ
if (isAuto && fs.existsSync(targetDir) && !isForce) {
  console.log('ℹ️  .cursor already exists. Run `npx cursor-sdd --force` to overwrite.');
  process.exit(0);
}

setup();

