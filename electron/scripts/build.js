const fs = require('fs-extra');
const path = require('path');

async function build() {
  try {
    const distDir = path.join(__dirname, '../dist');
    
    // Clean and ensure dist directory exists
    await fs.emptyDir(distDir);
    
    // Copy index.html
    await fs.copy(
      path.join(__dirname, '../index.html'),
      path.join(distDir, 'index.html')
    );
    
    // Copy preload.js
    await fs.copy(
      path.join(__dirname, '../preload.js'),
      path.join(distDir, 'preload.js')
    );
    
    // Copy renderer directory
    const rendererSrc = path.join(__dirname, '../renderer');
    const rendererDest = path.join(distDir, 'renderer');
    
    if (await fs.pathExists(rendererSrc)) {
      await fs.copy(rendererSrc, rendererDest);
    }
    
    console.log('Build completed successfully!');
  } catch (err) {
    console.error('Build failed:', err);
    process.exit(1);
  }
}

build();