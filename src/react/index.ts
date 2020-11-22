import * as Generator from 'yeoman-generator';
import { join } from 'path';
import { load } from 'cheerio';
import { format } from 'prettier';
import { parse } from 'acorn';
import * as walk from 'acorn-walk';

module.exports = class extends Generator {
  configuring() {
    this.fs.extendJSON(this.destinationPath('tsconfig.json'), {
      compilerOptions: {
        jsx: 'react',
        esModuleInterop: true,
      },
    });
  }

  writing() {
    this.fs.delete(this.destinationPath(join('src', 'index.ts')));

    ['app.tsx', 'index.tsx'].forEach(file => {
      this.fs.copy(
        this.templatePath(join('src', file + '.template')),
        this.destinationPath(join('src', file)),
      );
    });

    const indexHtml = this.fs.read(
      this.destinationPath(join('src', 'index.html')),
    );

    const prettierConfig = this.fs.readJSON(
      this.destinationPath(join('.prettierrc')),
    );

    const document = load(indexHtml);
    document('body').html('<div id="app-root"></div>');

    this.fs.write(
      this.destinationPath(join('src', 'index.html')),
      format(document.html(), { ...prettierConfig, parser: 'html' }),
    );

    const webpackConfig = updateForReact(
      this.fs.read(this.destinationPath('webpack.common.js')),
    );

    this.fs.write(
      this.destinationPath('webpack.common.js'),
      format(webpackConfig, prettierConfig),
    );
  }

  install() {
    this.npmInstall(['react', 'react-dom']);
    this.npmInstall(['@types/react', '@types/react-dom'], { 'save-dev': true });
  }
};

type Mutation = {
  offset: number;
  length: number;
  content: string;
};

function getEntryMutation(program: acorn.Node): Mutation {
  const config = getConfigObject(program);
  const entry = config.properties.find(prop => prop.key.name === 'entry');

  return {
    offset: entry.value.start,
    length: entry.value.end - entry.value.start,
    content: "'./src/index.tsx'",
  };
}

function getRuleMutation(program: acorn.Node): Mutation {
  const config = getConfigObject(program);
  const module = config.properties.find(prop => prop.key.name === 'module');
  const rulesObj = module.value.properties.find(
    prop => prop.key.name === 'rules',
  );
  const rules = rulesObj.value.elements;

  const rule = rules.find(r =>
    r.properties.some(
      p => p.key.name === 'use' && p.value.value === 'ts-loader',
    ),
  );
  const test = rule.properties.find(p => p.key.name === 'test');

  return {
    offset: test.value.start,
    length: test.value.end - test.start,
    content: '/\\.tsx?$/,',
  };
}

function getExtensionsMutation(program: acorn.Node): Mutation {
  const config = getConfigObject(program);
  const resolve = config.properties.find(prop => prop.key.name === 'resolve');

  if (resolve) {
    const extensions = resolve.properties.find(
      prop => prop.key.name === 'extensions',
    );

    if (extensions) {
      return {
        offset: extensions.value.start,
        length: extensions.value.end - extensions.value.start,
        content: "['.js', '.ts', '.tsx']",
      };
    } else {
      const last = resolve.properties[resolve.properties.length - 1];
      return {
        offset: last.end,
        length: 0,
        content: "extensions: ['.js', '.ts', '.tsx'],",
      };
    }
  } else {
    const last = config.properties[config.properties.length - 1];
    return {
      offset: last.end,
      length: 0,
      content: ",resolve: {\nextensions: ['.js', '.ts', '.tsx']\n}",
    };
  }
}

function updateForReact(file: string) {
  const program = parse(file, { ecmaVersion: 'latest' });

  const mutations = [
    getEntryMutation(program),
    getRuleMutation(program),
    getExtensionsMutation(program),
  ].sort((a, b) => b.offset - a.offset);

  return mutations.reduce(
    (output, mutation) =>
      output.substr(0, mutation.offset) +
      mutation.content +
      output.substr(mutation.offset + mutation.length),
    file,
  );
}

function getConfigObject(program: acorn.Node): any {
  let config = null;
  walk.fullAncestor(program, (node: any, ancestors) => {
    if (
      node.type === 'AssignmentExpression' &&
      node.left.type === 'MemberExpression' &&
      node.left.object.name === 'module' &&
      node.left.property.name === 'exports'
    ) {
      config = node.right;
    }
  });
  return config;
}
