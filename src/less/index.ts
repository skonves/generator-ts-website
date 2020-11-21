import * as Generator from 'yeoman-generator';
import { join } from 'path';

module.exports = class extends Generator {
  configuring() {
    this.fs.extendJSON(this.destinationPath('.eslintrc.json'), {
      rules: {
        'import/no-unassigned-import': ['error', { allow: ['**/*.less'] }],
      },
    });
  }

  writing() {
    this.fs.copy(
      this.templatePath(join('src', 'less.d.ts.template')),
      this.destinationPath(join('src', 'less.d.ts')),
    );
  }

  install() {
    this.npmInstall('less', { 'save-dev': true });
  }
};
