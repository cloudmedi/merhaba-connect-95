const fs = require('fs-extra');
const path = require('path');

// Clean dist directory
fs.emptyDirSync(path.join(__dirname, '../dist'));

// Copy index.html to dist
fs.copyFileSync(
  path.join(__dirname, '../index.html'),
  path.join(__dirname, '../dist/index.html')
);

// Copy renderer directory to dist
const rendererDir = path.join(__dirname, '../renderer');
if (fs.existsSync(rendererDir)) {
  fs.copySync(rendererDir, path.join(__dirname, '../dist/renderer'));
}

// Copy preload.js to dist
fs.copyFileSync(
  path.join(__dirname, '../preload.js'),
  path.join(__dirname, '../dist/preload.js')
);

console.log('Build completed successfully!');