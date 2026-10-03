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

  if (process.platform === 'win32') {
    // Windows PowerShell Compress-Archive (force include hidden files like .htaccess)
    execSync(
      `powershell -Command "Get-ChildItem -Path dist -Force | Compress-Archive -DestinationPath dist-deploy.zip -Force"`,
      { cwd: rootDir, stdio: 'inherit' }
    );
  } else {
    // Linux / macOS zip
    execSync(
      `cd dist && zip -r ../dist-deploy.zip .`,
      { cwd: rootDir, stdio: 'inherit' }
    );
  }

  if (fs.existsSync(zipOutputPath)) {
    const stats = fs.statSync(zipOutputPath);
    const sizeMb = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`\n✅ [Deploy ZIP Created] dist-deploy.zip (${sizeMb} MB) ready for upload to cPanel / Cloud Hosting public_html!\n`);
  } else {
    throw new Error('Failed to create dist-deploy.zip');
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
