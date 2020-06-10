const fs = require('fs');
const mkdirp = require('mkdirp');
const assert = require('assert');
const download = require('./download');
module.exports = {
  getCurrentDirectory: () => {
    return process.cwd();
  },

  directoryExists: (filePath) => {
    return fs.existsSync(filePath);
  },

  createDir: (dir) => {
    return mkdirp(dir);
  },
  /**
   * Get Chakra Theme from github repo and stores in {dir} if defined or chakra directory
   */
  getTheme: (directory, dirToStore = '') => {
    console.log('go here');
    const downloadOptions = {
      owner: 'chakra-ui',
      repo: 'chakra-ui',
      directory,
    };

    download(
      downloadOptions.owner,
      downloadOptions.repo,
      downloadOptions.directory
    ).then(() => {
      console.log;
      console.error;
    });
  },
};
