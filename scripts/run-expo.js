const { spawn } = require('child_process');
const path = require('path');

process.env.EXPO_NO_DEPENDENCY_VALIDATION = '1';
process.env.EXPO_NO_TELEMETRY = '1';

const expoCli = require.resolve('expo/bin/cli');
const args = process.argv.slice(2);

const child = spawn(process.execPath, [expoCli, ...args], {
  cwd: process.cwd(),
  env: process.env,
  stdio: 'inherit',
  windowsHide: false,
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});

child.on('error', (error) => {
  console.error(error);
  process.exit(1);
});
