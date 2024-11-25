const { build } = require('electron-builder');
const path = require('path');

async function buildApp() {
  try {
    await build({
      config: {
        directories: {
          output: path.join(__dirname, '../build'),
          app: path.join(__dirname, '..')
        }
      }
    });
    console.log('Build completed successfully!');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

buildApp();