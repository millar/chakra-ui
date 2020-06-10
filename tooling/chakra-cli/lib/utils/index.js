const program = require('commander');
const leven = require('leven');
const { camelCase } = require('lodash');

module.exports = {
  suggestCommands(unknownCommand) {
    const availableCommands = program.commands.map((cmd) => cmd._name);

    let suggestion;

    availableCommands.forEach((cmd) => {
      const isBestMatch =
        leven(cmd, unknownCommand) < leven(suggestion || '', unknownCommand);
      if (leven(cmd, unknownCommand) < 3 && isBestMatch) {
        suggestion = cmd;
      }
    });

    if (suggestion) {
      consola.info(
        `  ` + chalk.red(`Did you mean ${chalk.yellow(suggestion)}?`)
      );
    }
  },

  cleanArgs(cmd) {
    const args = {};
    cmd.options.forEach((o) => {
      const key = camelCase(o.long.replace(/^--/, ''));
      // if an option is not present and Command has a method with the same name
      // it should not be copied
      if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
        args[key] = cmd[key];
      }
    });
    return args;
  },
  getProjectType(package) {
    if (keyExists(package, 'react')) {
      return 'REACT';
    } else if (keyExists(package, 'vue')) {
      return 'VUE';
    } else {
      throw new Error("Can't detect Vue or React");
    }
  },
  /**
   * Download a file from the network
   * @param {string} url
   * @param {string} dest
   * @param {function} cb
   */
  download(url, dest, cb) {
    const fs = require('fs');
    const https = require('https');
    var file = fs.createWriteStream(dest);
    https.get(url, function (response) {
      response.pipe(file);
      file.on('finish', function () {
        file.close(cb);
      });
    });
  },
};

function keyExists(obj, key) {
  return obj.hasOwnProperty(key);
}
