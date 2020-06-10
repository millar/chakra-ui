const { spawn } = require('child_process');
const consola = require('consola');
const { directoryExists, getTheme } = require('./utils/files');

module.exports = async function init(projectType, options) {
  console.log(options);
  let installCmd;
  let packages;

  if (directoryExists('yarn.lock')) {
    installCmd = 'yarn add';
  } else {
    installCmd = 'npm install';
  }

  if (projectType == 'REACT') {
    packages = '@chakra-ui/core @emotion/core @emotion/styled emotion-theming';
  } else {
    packages = '@chakra-ui/vue emotion';
  }

  command = `${installCmd} ${packages}`;

  let [packageManager, managerCmd] = installCmd.split(' ');

  let installation = spawn(packageManager, [
    managerCmd,
    ...packages.split(' '),
  ]);

  installation.stdout.on('data', function (data) {
    console.log(data.toString());
  });

  installation.stderr.on('data', function (data) {
    consola.log(data.toString());
  });

  installation.on('close', function () {
    console.log('Installing theme');
    if (options.theme && options.typescript) {
      try {
        getTheme('packages/chakra-ui-theme', options.dir);
      } catch (error) {
        console.log(error);
      }
    }
    consola.success('Chakra UI has been setup.');
  });
};
