const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SOURCE_DIR = path.resolve('c:/100days/first code/100days/first code');
const TARGET_DIR = path.resolve('C:/Users/Rajesh/Downloads/QueueLess-Smart-Digital-Token-System (2)');
const TARGET_ZIP = path.resolve('C:/Users/Rajesh/Downloads/QueueLess-Smart-Digital-Token-System.zip');
const WORKSPACE_ZIP = path.resolve('c:/100days/first code/100days/first code/QueueLess-Smart-Digital-Token-System.zip');

function copyRecursive(src, dest, ignore = ['node_modules', '.git', '.gemini']) {
  if (!fs.existsSync(src)) return;
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (ignore.includes(path.basename(src))) return;
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const child of fs.readdirSync(src)) {
      copyRecursive(path.join(src, child), path.join(dest, child), ignore);
    }
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

console.log('🔄 Syncing updated project files to Downloads folder...');
copyRecursive(SOURCE_DIR, TARGET_DIR);
console.log('✅ Synchronized to:', TARGET_DIR);

console.log('📦 Compressing clean release ZIP (excluding node_modules)...');
try {
  // Compress clean TARGET_DIR
  const psCmd = `powershell -NoProfile -Command "Compress-Archive -Path '${TARGET_DIR}\\*' -DestinationPath '${TARGET_ZIP}' -Force"`;
  execSync(psCmd, { stdio: 'inherit', timeout: 30000 });
  console.log('✅ Successfully created target ZIP:', TARGET_ZIP);

  if (fs.existsSync(TARGET_ZIP)) {
    fs.copyFileSync(TARGET_ZIP, WORKSPACE_ZIP);
    console.log('✅ Successfully copied ZIP to workspace root:', WORKSPACE_ZIP);
  }
} catch (e) {
  console.error('⚠️ ZIP creation warning:', e.message);
}
