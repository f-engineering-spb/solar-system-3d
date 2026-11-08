const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log('[Build] Preparing dist bundle for Capacitor Android...');

if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// 1. Copy index.html
fs.copyFileSync(path.join(rootDir, 'index.html'), path.join(distDir, 'index.html'));
console.log('  -> Copied index.html');

// 2. Copy vendor/
if (fs.existsSync(path.join(rootDir, 'vendor'))) {
  copyDirRecursive(path.join(rootDir, 'vendor'), path.join(distDir, 'vendor'));
  console.log('  -> Copied vendor/');
}

// 3. Copy assets/
if (fs.existsSync(path.join(rootDir, 'assets'))) {
  copyDirRecursive(path.join(rootDir, 'assets'), path.join(distDir, 'assets'));
  console.log('  -> Copied assets/');
}

console.log('[Build] dist bundle ready for Capacitor sync!');
