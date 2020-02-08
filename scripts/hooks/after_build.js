/**
  Copyright (c) 2015, 2019, Oracle and/or its affiliates.
  The Universal Permissive License (UPL), Version 1.0
*/

'use strict';

const fs = require('fs-extra');
module.exports = function (configObj) {
  return new Promise((resolve, reject) => {
    console.log("Running after_build hook.");

    // if (configObj.buildType === 'release') {
    // do something here to copy production files to /dist folder
    // which can then be used with a dockerfile
    fs.copy('./web/', './dist/', (err) => {
      if (err) throw err;
      console.log('copied /web to dist folder');
    });
    // }
    resolve();
  });
};
