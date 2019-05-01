# Typescript and LESS Website Generator

The Galaxy's OKest Typescript and LESS Website Generator for [Yeoman](https://yeoman.io)

- Typescript 3
- LESS
- Webpack 4 (with Dev Server and HMR)
- Code formatting with Prettier and TSLint
- Unit testing with Mocha and Chai
- Code coverage with NYC

## How To:

### Create a new Website

1.  Globally install this generator: `npm install -g generator-ts-website`
1.  From the root of your new project, run `yo ts-website` (NOTE: run `yo ts-website --help` for options)

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
