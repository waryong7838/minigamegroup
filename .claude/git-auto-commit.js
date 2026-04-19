const { execSync } = require('child_process');
const path = require('path');
const cwd = path.join(__dirname, '..');

let d = '';
process.stdin.on('data', c => d += c);
process.stdin.on('end', () => {
  try {
    const j = JSON.parse(d);
    const f = (j.tool_input && j.tool_input.file_path) ||
              (j.tool_response && j.tool_response.filePath) || '';
    if (!f) process.exit(0);

    // .claude/ 내부 파일(설정/스크립트)은 자동 커밋에서 제외
    if (f.replace(/\\/g, '/').includes('/.claude/')) process.exit(0);

    const name = f.replace(/.*[/\\]/, '');

    execSync(`git add "${f}"`, { cwd, stdio: 'inherit' });
    execSync(`git commit -m "auto: update ${name}"`, { cwd, stdio: 'inherit' });
    execSync('git push origin HEAD', { cwd, stdio: 'inherit' });
  } catch (_) {
    process.exit(0);
  }
});
