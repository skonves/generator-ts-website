# Typescript and LESS Website Generator

The Galaxy's OKest Typescript and LESS Website Generator for [Yeoman](https://yeoman.io)

- Typescript
- LESS
- Webpack + Dev Server
- Hot Module Reloading

## How To:

### Create a new Website

1.  Globally install this generator: `npm install -g generator-ts-website`
1.  From the root of your new project, run `yo ts-website` (NOTE: run `yo ts-website --help` for options)

This generator is powered by [generator-ts-console](https://www.npmjs.com/package/generator-ts-console). You can use all of that generator's pompts, options, and arguments; however, note that `eslint` is preselected as the linter and cannot be changed.

### Bundle Typescript and LESS files

The generated project includes a Webpack config that handles the transpilation and bundling steps. From within your generated project:

1. `npm run build`

Typescript files will be transpiled and bundled in `main.[hash].js`, LESS files imported by .ts files will be bundled in `main.[hash].css`, and both of those files will be reference by `index.html`. (The build output can be found in `./dist`)

### Run the Dev Server with Hot Module Reloading (HMR)

From within your generated project:

1. `npm start`

### Run unit tests

The `test` script will run any file ending with `.tests.ts`. From within your generated project:

1. `npm test`

Code coverage may be viewed in `./coverage/lcov-report/index.html`.
