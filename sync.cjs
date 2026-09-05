const fs = require('fs');
const path = require('path');

const srcDir = 'c:/Users/hiver/Desktop/Github/sandbox-main/sandbox-main';
const destDir = 'c:/Users/hiver/Desktop/Github/GameGenPlay';

const ignorePaths = [
  'node_modules',
  '.git',
  '.next',
  '.env.local',
  '.env',
  'app/layout.tsx',
  'public/logo.svg',
  'app/icon.svg',
  'app/favicon.ico',
  'package.json',
  'trigger.config.ts',
  'sentry.client.config.ts',
  'sentry.edge.config.ts',
  'sentry.server.config.ts',
  'scratch',
  '.agents'
];

function isIgnored(relPath) {
  const normalizedPath = relPath.replace(/\\/g, '/');
  return ignorePaths.some(ignored => {
    return normalizedPath === ignored || normalizedPath.startsWith(ignored + '/');
  });
}

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach(function(childItemName) {
      const srcPath = path.join(src, childItemName);
      const destPath = path.join(dest, childItemName);
      const relPath = path.relative(srcDir, srcPath);
      
      if (!isIgnored(relPath)) {
        copyRecursiveSync(srcPath, destPath);
      }
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

console.log('Starting sync...');
copyRecursiveSync(srcDir, destDir);
console.log('Sync complete.');
