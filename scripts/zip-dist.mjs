import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const zipOutputPath = path.resolve(rootDir, 'dist-deploy.zip');

export function createDeployZip() {
  console.log('\n📦 [Deploy ZIP] Generating deployment zip archive for Cloud Hosting / cPanel...');

  if (!fs.existsSync(distDir)) {
    throw new Error('dist/ directory not found. Please build the project first (e.g. npm run build).');
  }

  // Ensure .htaccess exists in dist
  const htaccessDist = path.join(distDir, '.htaccess');
  const htaccessPublic = path.join(rootDir, 'public', '.htaccess');
  if (!fs.existsSync(htaccessDist) && fs.existsSync(htaccessPublic)) {
    fs.copyFileSync(htaccessPublic, htaccessDist);
    console.log('📄 Copied .htaccess to dist folder.');
  }

  // Remove existing zip if present
  if (fs.existsSync(zipOutputPath)) {
    try {
      fs.unlinkSync(zipOutputPath);
    } catch (e) {
      console.warn('⚠️ Could not remove old zip, will overwrite:', e.message);
    }
  }

  try {
    if (process.platform === 'win32') {
      execSync(
        `powershell -Command "Get-ChildItem -Path dist -Force | Compress-Archive -DestinationPath dist-deploy-ready.zip -Force"`,
        { cwd: rootDir, stdio: 'inherit' }
      );
      // Attempt copy to dist-deploy.zip if possible
      try {
        fs.copyFileSync(path.resolve(rootDir, 'dist-deploy-ready.zip'), zipOutputPath);
      } catch {
        console.log('ℹ️ dist-deploy.zip is currently locked, packaged as dist-deploy-ready.zip.');
      }
    } else {
      execSync(
        `cd dist && zip -r ../dist-deploy.zip .`,
        { cwd: rootDir, stdio: 'inherit' }
      );
    }

    const finalPath = fs.existsSync(zipOutputPath) ? zipOutputPath : path.resolve(rootDir, 'dist-deploy-ready.zip');
    const stats = fs.statSync(finalPath);
    const sizeMb = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`\n✅ [Deploy ZIP Created] ${path.basename(finalPath)} (${sizeMb} MB) ready for upload to cPanel / Cloud Hosting public_html!\n`);
  } catch (err) {
    throw new Error('Failed to create deploy zip: ' + err.message);
  }
}

// Run directly if invoked from CLI
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    createDeployZip();
  } catch (err) {
    console.error('❌ Failed to create deploy zip:', err);
    process.exit(1);
  }
}
