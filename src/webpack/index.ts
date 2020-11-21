import * as Generator from 'yeoman-generator';

module.exports = class extends Generator {
  configuring() {
    ['webpack.common.js', 'webpack.dev.js', 'webpack.prod.js'].forEach(file => {
      this.fs.copy(
        this.templatePath(file + '.template'),
        this.destinationPath(file),
      );
    });

    this.fs.extendJSON(this.destinationPath('tsconfig.json'), {
      compilerOptions: { lib: ['es6', 'dom'], outDir: 'dist', target: 'es5' },
    });

    this.fs.extendJSON(this.destinationPath('package.json'), {
      scripts: {
        build: 'webpack --config webpack.prod.js',
        start: 'webpack serve --config webpack.dev.js',
      },
    });
  }

  install() {
    this.npmInstall(
      [
        'css-hot-loader',
        'css-loader',
        'html-webpack-plugin',
        'less-loader',
        'mini-css-extract-plugin',
        'ts-loader',
        'webpack',
        'webpack-cli',
        'webpack-dev-server',
        'webpack-merge',
      ],
      { 'save-dev': true },
    );
  }
};
