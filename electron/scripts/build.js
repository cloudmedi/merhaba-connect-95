const fs = require('fs-extra');
const path = require('path');

// Clean and ensure dist directory exists
fs.emptyDirSync(path.join(__dirname, '../dist'));

// Copy index.html to dist
fs.copyFileSync(
  path.join(__dirname, '../index.html'),
  path.join(__dirname, '../dist/index.html')
);

// Copy preload.js to dist
fs.copyFileSync(
  path.join(__dirname, '../preload.js'),
  path.join(__dirname, '../dist/preload.js')
);

// Copy renderer files
const rendererSrcDir = path.join(__dirname, '../renderer');
const rendererDestDir = path.join(__dirname, '../dist/renderer');

if (fs.existsSync(rendererSrcDir)) {
  fs.copySync(rendererSrcDir, rendererDestDir);
}

console.log('Build completed successfully!');