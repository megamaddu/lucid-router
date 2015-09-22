module.exports = function (config) {
  'use strict';
  config.set({
    autoWatch: true,
    singleRun: false,

    frameworks: ['jspm', 'jasmine'],

    files: [
      'node_modules/babel-core/browser-polyfill.js'
    ],

    jspm: {
      config: 'src/config.js',
      loadFiles: [
        'src/*.spec.js'
      ],
      serveFiles: [
        'src/!(*spec).js'
      ]
    },

    proxies: {
      '/src/': '/base/src/',
      '/jspm_packages/': '/base/src/jspm_packages/'
    },

    browsers: ['PhantomJS'],

    preprocessors: {
      'src/*.js': ['babel', 'sourcemap', 'coverage']
    },

    babelPreprocessor: {
      options: {
        sourceMap: 'inline',
        stage: 0
      },
      sourceFileName: function(file) {
        return file.originalPath;
      }
    },

    reporters: ['coverage', 'progress'],

    coverageReporter: {
      instrumenters: {isparta: require('isparta')},
      instrumenter: {
        'src/*.js': 'isparta'
      },

      reporters: [
        {
          type: 'text-summary',
          subdir: normalizationBrowserName
        },
        {
          type: 'html',
          dir: 'coverage/',
          subdir: normalizationBrowserName
        }
      ]
    }
  });

  function normalizationBrowserName (browser) {
    return browser.toLowerCase().split(/[ /-]/)[0];
  }
};
