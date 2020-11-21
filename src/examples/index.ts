import * as Generator from 'yeoman-generator';
import { join } from 'path';

module.exports = class extends Generator {
  configuring() {
    this.fs.extendJSON(this.destinationPath('package.json'), {
      description: 'Blank web application built with Typescript and LESS',
    });
  }

  writing() {
    ['index.html', 'index.less', 'index.ts'].forEach(file => {
      this.fs.copy(
        this.templatePath(join('src', file + '.template')),
        this.destinationPath(join('src', file)),
      );
    });

    const { name, description } = this.fs.readJSON(
      this.destinationPath('package.json'),
    );

    const badges = this.fs
      .read(this.destinationPath('README.md'))
      .match(/\[!\[.+?\].+?\]\(.+?\)/g)
      .join('\n');

    this.fs.copyTpl(
      this.templatePath('README.md.template'),
      this.destinationPath('README.md'),
      { name, description, badges },
    );

    this.fs.delete(this.destinationPath(join('src', 'index.tests.ts')));
  }
};
