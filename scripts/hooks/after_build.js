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
    fs.copy('./web/index.html', './dist/index.html', (err) => {
      if (err) throw err;
      console.log('copied index.html file');
    });
    fs.copy('./web/css', './dist/css', (err) => {
      if (err) throw err;
      console.log('copied /css folder');
    });
    fs.copy('./web/js/main.js', './dist/js/main.js', (err) => {
      if (err) throw err;
      console.log('copied main.js file');
    });
    fs.copy('./web/js/accUtils.js', './dist/js/accUtils.js', (err) => {
      if (err) throw err;
      console.log('copied accUtils file');
    });
    fs.copy('./web/js/appController.js', './dist/js/appController.js', (err) => {
      if (err) throw err;
      console.log('copied appController file');
    });
    fs.copy('./web/js/views', './dist/js/views', (err) => {
      if (err) throw err;
      console.log('copied /views folder');
    });
    fs.copy('./web/js/viewModels', './dist/js/viewModels', (err) => {
      if (err) throw err;
      console.log('copied /viewModels folder');
    });
    fs.ensureDir('./dist/js/libs', (err) => {
      if (err) throw err;
      console.log('created /js/libs folder');
    });
    fs.copy('./web/js/libs/require', './dist/js/libs/require', (err) => {
      if (err) throw err;
      console.log('copied requirejs folder');
    });
    // }
    resolve();
  });
};
