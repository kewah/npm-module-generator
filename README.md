# npm-module-generator

NPM module generator.  
Inspired by Yeoman.

## Install

With [npm](http://npmjs.org) do:

```bash
$ npm install npm-module-generator -g
```

## Usage

In order to have default values, you need to define few settings in your `.npmrc`:

```bash
$ npm config set init.author.name "Your Name"
$ npm config set init.author.url "http://your-website.com"
$ npm config set init.author.email "your@email.com"
$ npm config set init.author.github "your-github-username"
```

To generate the module skeleton:

```bash
$ mkdir your-project && cd your-project
$ npm-module
```

## License

MIT
