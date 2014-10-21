'use strict';

var path = require('path');
var prompt = require('inquirer').prompt;
var npmconf = require('npmconf');
var dequote = require('./dequote');

module.exports = function(next) {
  npmconf.load({}, function(err, config) {
    if (err) {
      return next(err);
    }

    var prompts = [{
      type: 'input',
      name: 'moduleName',
      message: 'module name:',
      default: path.basename(process.cwd())
    }, {
      type: 'input',
      name: 'description',
      message: 'module description:',
    }, {
      type: 'input',
      name: 'keywords',
      message: 'keywords:',
    }, {
      type: 'input',
      name: 'author',
      message: 'author name:',
      default: config.get('init.author.name')
    }, {
      type: 'input',
      name: 'email',
      message: 'author email:',
      default: config.get('init.author.email')
    }, {
      type: 'input',
      name: 'url',
      message: 'author url:',
      default: config.get('init.author.url')
    }, {
      type: 'input',
      name: 'github',
      message: 'author Github:',
      default: config.get('init.author.github')
    }, {
      type: 'rawlist',
      name: 'testlib',
      message: 'which test lib do you want to use:',
      choices: [{
        name: 'tape',
        value: 'tape',
        default: true
      }, {
        name: 'mocha',
        value: 'mocha'
      }, {
        name: 'mocha-phantomjs',
        value: 'mochaPantomjs'
      }, {
        name: 'none',
        value: 'none'
      }]
    }];

    prompt(prompts, function done(props) {
      props.description = dequote(props.description);

      props.keywords = JSON.stringify(props.keywords.split(',').map(function(v) {
        return dequote(v.trim());
      }).filter(function(v) {
        return v.length > 0;
      }), null, 2);

      next(null, props);
    });
  });
};
