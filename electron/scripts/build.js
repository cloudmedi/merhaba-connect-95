const fs = require('fs-extra');
const path = require('path');

async function build() {
  try {
    // Ensure we're using absolute paths
    const rootDir = path.resolve(__dirname, '..');
    const distDir = path.join(rootDir, 'dist');
    
    console.log('Building to:', distDir);
    
    // Clean and ensure dist directory exists
    await fs.emptyDir(distDir);
    console.log('Cleaned dist directory');
    
    // Copy index.html
    await fs.copy(
      path.join(rootDir, 'index.html'),
      path.join(distDir, 'index.html')
    );
    console.log('Copied index.html');
    
    // Copy preload.js if it exists
    const preloadSrc = path.join(rootDir, 'preload.js');
    if (await fs.pathExists(preloadSrc)) {
      await fs.copy(preloadSrc, path.join(distDir, 'preload.js'));
      console.log('Copied preload.js');
    }
    
    // Copy renderer directory
    const rendererSrc = path.join(rootDir, 'renderer');
    const rendererDest = path.join(distDir, 'renderer');
    
    if (await fs.pathExists(rendererSrc)) {
      await fs.copy(rendererSrc, rendererDest);
      console.log('Copied renderer directory');
    }
    
    // Copy package.json for production dependencies
    await fs.copy(
      path.join(rootDir, 'package.json'),
      path.join(distDir, 'package.json')
    );
    console.log('Copied package.json');
    
    console.log('Build completed successfully!');
  } catch (err) {
    console.error('Build failed:', err);
    process.exit(1);
  }
}

build();