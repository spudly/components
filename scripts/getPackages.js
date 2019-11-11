const cp = require('child_process');

const getPackages = () => {
  const stdout = cp.execSync('yarn workspaces info --json', {
    cwd: __dirname,
    encoding: 'utf8',
  });
  const packageMap = JSON.parse(JSON.parse(stdout).data);
  return Object.keys(packageMap).map(name => {
    const {location, workspaceDependencies: dependencies} = packageMap[name];
    return {name, location, dependencies};
  });
};

module.exports = getPackages;
