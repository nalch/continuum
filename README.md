# continuum ![Build status](https://travis-ci.org/nalch/continuum.svg?branch=master)

A connect four derivative, that allows connections over the boards borders and insertions of pieces at the bottom and top falling to the middle of the board.
Based on the idea and rules of [kraiz](https://github.com/kraiz)


## Docker

The project can be run in a docker container using the provided dockerfile.
- change into project directory
- docker-compose up -d
- call http://localhost:8300

## Development

- Server: Node.js
- Client: AngularJS
- Tests: Mocha, Chai, Sinon, ESLint

### Tests

The tests are run via Mocha and Chai and reside in the test subfolder.
To run the tests with a local npm, run the mongodb service and call `npm test` and `npm run-script lint`.

Otherwise start the services, enter the nodejs service and call
```
  docker-compose exec nodejs /bin/bash
  npm test
  npm run-script lint
```

### Codestyle

The codestyle is enforced via eslint. The stylebundle is eslint:recommended, proceeded with google.
Custom rulechanges:
  - modified linelength of 120.
The imports should follow the listed example and be ordered alphabetically inside their blocks:
```
var npmModule = require('npm-package');

var npmModuleClass = require('npm-package').Class;

var ownModule = require('../own/module');

var npmModuleClass = require('../own/module').Class;
```
