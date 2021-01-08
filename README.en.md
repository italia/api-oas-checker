# APIs validator compliant to the Italian Interoperability Framework

[![Join the #api channel](https://img.shields.io/badge/Slack-%23api-blue.svg?logo=slack)](https://developersitalia.slack.com/messages/CDKBYTG74)
[![API on forum.italia.it](https://img.shields.io/badge/Forum-interoperabilit%C3%A0-blue.svg)](https://forum.italia.it/c/piano-triennale/interoperabilita)

This repository contains an in-browser validator that verifies some of the rules for the REST APIs, as indicated in the Interoperability Model.

The associated projects are indicated in the [API Starter Kit](https://github.com/teamdigitale/api-starter-kit).
There's a Beta [github-action that uses these rules](https://github.com/teamdigitale/api-oas-checker-action).

The ready-to-use online application is available [here](https://teamdigitale.github.io/api-oas-checker).

The validator is based on [Spectral](https://github.com/stoplightio/spectral) which we preferred over other good validators:

- [Zally](https://github.com/zalando/zally) requires a database and cannot be webpackaged in a browser application;
- [Speccy](https://github.com/wework/speccy) seem to support only javascript rules, while our rules are described using static yaml files. 

## Content

- A web application developed with React that uses Webpack + Babel to create a single-page application
- A [rules/](rules/) directory with the rules applied, which come then aggregate in the spectral.yml file.
  
## Development

### CLI mode
If you want to control your API using the CLI of Spectral, after cloning the repo, just launch

```
$ yarn
$ make rules
$ yarn run spectral lint -r spectral.yml $OAS_URL_OR_FILE
```

### UI mode
This web application is based on React library and uses Webpack as a bundler and Babel to transpile JavaScript code

To launch the application
```
$ yarn
$ yarn start
```
or alternatively
```
$ docker-compose up --build start
```
and then when the build is finished, connect to http://127.0.0.1:3000/
  
## Testing

It is possible to test boht the correct spectral rules generation and the ui

```
# N.B. make test doens't work correctly on MacOS
$ make test
$ make test-ui
```

or alternatively
```
$ ddocker-compose up --build test
```

## Write rules

Spectral iterates the OAS specifications using jsonpath expressions
indicated in the [rules](rules/)
and executes the callbacks indicated on the corresponding lines.
It is possible to test every single rule (e.g. `problem`) by verifying
that the spectral output corresponds to that indicated in the associated `.snapshot` file

```
./test-ruleset.sh problem
```

Therefore, when editing a rule, it is necessary to recreate and validate the contents of the snapshot
with

```
./test-ruleset.sh --snapshot problem
git add -p rules/problem* 
```

See here [spectral.yml](spectral.yml) for examples of rules.

On the site http://jsonpath.com/ you can test the rules online.

Jsonpath supports back-references,
 see https://github.com/json-path/JsonPath/issues/287#issuecomment-265479196
 
For more information on spectral rules see https://stoplight.io/p/docs/gh/stoplightio/spectral/docs/getting-started/rulesets.md

## Thanks to

- Paolo Falomo
- Vincenzo Chianese
- Giuseppe De Marco
