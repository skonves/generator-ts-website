import * as Generator from 'yeoman-generator';
import { join } from 'path';

module.exports = class extends Generator {
  initializing() {
    this.pkg = this.fs.readJSON(this.destinationPath('package.json'), {});

    if (this.pkg && Object.keys(this.pkg).length) {
      console.log('Found existing package.json:');
      console.log(this.pkg);
    }
  }

  writing() {
    [
      // Root
      '.gitignore',
      '.nycrc',
      '.prettierrc',
      'tsconfig.json',
      'tslint.json',
      'webpack.config.js',

      // Source
      join('src', 'custom.d.ts'),
      join('src', 'index.html'),
      join('src', 'index.less'),
      join('src', 'index.ts'),
    ].forEach(file => {
      this.fs.copy(
        this.templatePath(file + '.template'),
        this.destinationPath(file),
      );
    });

    ['package.json', 'README.md'].forEach(file => {
      this.fs.copyTpl(
        this.templatePath(file + '.template'),
        this.destinationPath(file),
        {
          name: this.pkg.name || 'ts-website',
          version: this.pkg.version || '0.0.1',
          description:
            this.pkg.description ||
            'Blank web application built with Typescript and LESS',
          author: this.pkg.author || '',
          license: this.pkg.license || 'ISC',
        },
      );
    });
  }

  install() {
    this.npmInstall(
      [
        '@types/chai',
        '@types/mocha',
        '@types/node',
        'chai',
        'css-hot-loader',
        'css-loader',
        'html-webpack-plugin',
        'less',
        'less-loader',
        'mini-css-extract-plugin',
        'mocha',
        'nyc',
        'prettier',
        'source-map-support',
        'ts-loader',
        'ts-node',
        'tslint',
        'typescript@3',
        'webpack@4',
        'webpack-cli',
        'webpack-dev-server',
        'webpack-merge',
      ],
      { 'save-dev': true },
    );
  }

  private pkg: {
    name: string;
    version: string;
    description: string;
    author: string;
    license: string;
  };
};
