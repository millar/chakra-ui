#!/usr/bin/env node

const program = require('commander');
const consola = require('consola');
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const minimist = require('minimist');
const { upperFirst, lowerCase } = require('lodash');

const { directoryExists, getCurrentDirectory } = require('../lib/utils/files');
const { getProjectType, cleanArgs, suggestCommands } = require('../lib/utils');
const cliPkg = require('../package.json');

clear();

console.log(
  chalk.cyan(figlet.textSync('Chakra UI', { horizontalLayout: 'full' }))
);

if (!directoryExists('package.json')) {
  consola.error(chalk.red('Package.json not found!'));
  process.exit();
}

const currentDirectory = getCurrentDirectory();

const pkg = require(`${currentDirectory}/package.json`);

let projectType;

try {
  projectType = getProjectType(pkg.dependencies);

  const fmtProjectType = upperFirst(lowerCase(projectType));

  consola.success(`${upperFirst(fmtProjectType)} detected`);

  console.log();

  consola.info(`Installing Chakra UI for ${fmtProjectType}...`);
} catch (error) {
  consola.error(chalk.red(error.message));
  process.exit();
}

program
  .version(`${cliPkg.name} ${cliPkg.version}`)
  .usage('<command> [options]');

program
  .command('init')
  .description('Set up Chakra UI')
  .option(
    '-t, --theme',
    "Clone the chakra default theme into the user's project under `chakra` directory."
  )
  .option('-d, --dir <dir>', 'specify the directory to put Chakra UI')
  .option('-ts, --typescript', 'Setup the typescript version of the command')
  .action((cmd) => {
    const options = cleanArgs(cmd);

    if (minimist(process.argv.slice(3))._.length > 1) {
      console.log(
        chalk.yellow(
          "\n Info: You provided more than one argument. The first one will be used as the app's name, the rest are ignored."
        )
      );
    }
    require('../lib/init')(projectType, options);
  });

// Help

// output help information on unknown commands
program.arguments('<command>').action((cmd) => {
  program.outputHelp();
  consola.info(`  ` + chalk.red(`Unknown command ${chalk.yellow(cmd)}.`));
  consola.info();
  suggestCommands(cmd);
});

// add some useful info on help
program.on('--help', () => {
  consola.info(
    `Run ${chalk.blueBright(
      `chakra <command> --help`
    )} for detailed usage of given command.`
  );
});

program.commands.forEach((c) => c.on('--help', () => consola.info()));

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
