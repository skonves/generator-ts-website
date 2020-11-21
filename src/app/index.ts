import * as Generator from 'yeoman-generator';

module.exports = class extends Generator {
  constructor(args: string | string[], options: {}) {
    super(args, options);
    this.composeWith(require.resolve('generator-ts-console/generators/app'), {
      ...options,
      arguments: args,
      linter: 'eslint',
    });
    this.composeWith(require.resolve('../less'), {});
    this.composeWith(require.resolve('../webpack'), {});
    this.composeWith(require.resolve('../examples'), {});
  }

  initializing() {
    // Nothing to do
  }
};
