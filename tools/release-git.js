const { execFileSync } = require('child_process');

const git = (root, args) => execFileSync('git', ['-C', root, ...args], {
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'pipe'],
}).trim();

const releaseGitInfo = (root) => {
  try {
    const commit = git(root, ['rev-parse', 'HEAD']);
    const status = git(root, ['status', '--porcelain', '--untracked-files=all']);
    const tags = git(root, ['tag', '--points-at', 'HEAD', '--list', 'release-r*'])
      .split(/\r?\n/).filter(Boolean).sort();
    return {
      commit,
      shortCommit: commit.slice(0, 12),
      dirty: status.length > 0,
      releaseTags: tags,
    };
  } catch (error) {
    return { commit: '', shortCommit: '', dirty: true, releaseTags: [], error: error.message };
  }
};

module.exports = { git, releaseGitInfo };
