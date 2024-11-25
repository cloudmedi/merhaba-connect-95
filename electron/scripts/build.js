const fs = require('fs-extra');
const path = require('path');

// Ensure dist directory exists
fs.ensureDirSync(path.join(__dirname, '../dist'));

// Copy index.html to dist
fs.copyFileSync(
  path.join(__dirname, '../index.html'),
  path.join(__dirname, '../dist/index.html')
);

// Copy renderer directory to dist if it exists
const rendererDir = path.join(__dirname, '../renderer');
if (fs.existsSync(rendererDir)) {
  fs.copySync(rendererDir, path.join(__dirname, '../dist/renderer'));
}

console.log('Build completed successfully!');