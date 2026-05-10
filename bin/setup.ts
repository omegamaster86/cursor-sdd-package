#!/usr/bin/env npx tsx
// @ts-nocheck

const fs = require('fs');
const path = require('path');

const isForce = process.argv.includes('--force');

// パッケージのルートディレクトリを取得
const packageRoot = path.resolve(__dirname, '..');
const sourceDir = packageRoot;
const FOLDERS = ['commands', 'rules', 'templates'];

// プロジェクトのルートを取得
function getProjectRoot() {
  if (process.env.INIT_CWD) {
    return process.env.INIT_CWD;
  }
  const nodeModulesIndex = __dirname.indexOf('node_modules');
  if (nodeModulesIndex !== -1) {
    return __dirname.substring(0, nodeModulesIndex);
  }
  return process.cwd();
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

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  for (const folder of FOLDERS) {
    const src = path.join(sourceDir, folder);
    const dest = path.join(targetDir, folder);
    if (!fs.existsSync(src)) continue;

    console.log(`📂 ${folder}/`);
    copyRecursive(src, dest);
  }

  console.log('\n✨ Cursor SDD setup complete!\n');
  console.log('Available commands:');
  console.log('  /init              - Initialize project specs');
  console.log('  /requirements      - Generate requirements');
  console.log('  /requirements-import - Import existing requirements');
  console.log('  /design            - Create design document');
  console.log('  /check-design      - Validate design document');
  console.log('  /tasks             - Generate tasks');
  console.log('  /impl              - Implementation');
  console.log('  /review            - Review implementation evidence');
  console.log('  /trace             - Generate traceability');
  console.log('  /final-check       - Final readiness check');
  console.log('  /status            - Check status');
  console.log('  /difference-check  - Check differences\n');
}

setup();

