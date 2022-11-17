# APIs validator compliant to the Italian Interoperability Framework

[![Join the #api channel](https://img.shields.io/badge/Slack-%23api-blue.svg?logo=slack)](https://developersitalia.slack.com/messages/CDKBYTG74)
[![API on forum.italia.it](https://img.shields.io/badge/Forum-interoperabilit%C3%A0-blue.svg)](https://forum.italia.it/c/piano-triennale/interoperabilita)

This repository contains an in-browser validator that verifies some of the rules for the REST APIs, as indicated in the Interoperability Model.

The associated projects are indicated in the [API Starter Kit](https://github.com/teamdigitale/api-starter-kit).
There's a Beta [github-action that uses these rules](https://github.com/teamdigitale/api-oas-checker-action).

The ready-to-use online application is available [here](https://teamdigitale.github.io/api-oas-checker).

The validator is based on [Spectral](https://github.com/stoplightio/spectral).

We preferred it because
it does not require databases or server components to process your OpenAPI documents (OAS Checker is a github pages static application),
and because the vast majority of ruleset can be described via static files (e.g. YAML):
[except for very specific cases](security/functions/) you don't need to execute javascript code.
Moreover, uses that do not trust sourcing javascript code, can just limit themself to static rules.

Other good validators we evaluated are:

- [Zally](https://github.com/zalando/zally) requires a database and cannot be webpackaged in a browser application;
- [Speccy](https://github.com/wework/speccy) seem to support only javascript rules, while our rules are usually described using static YAML files.

## Content

- A web application developed with React using Webpack + Babel to create a single-page application
- A directory [rules/](rules/) with the applied rules, which are then aggregated in the file [spectral.yml](https://italia.github.io/api-oas-checker/spectral.yml)
- A directory [security/](security/) with additional security rules, which are then aggregated into the file [spectral-security.yml](https://italia.github.io/api-oas-checker/spectral-security.yml)

## Development

## Online mode

The simplest way to check an API is to run the checks using
directly - or after downloading them - the rule files on github.

```bash
$ spectral lint -r https://italia.github.io/api-oas-checker/spectral.yml $OAS_URL_OR_FILE
```

## CI Mode (versioned rulesets)

When embedding the validator in a CI, you may want to use a specific version of the rules instead of the latest one.
version of the rules instead of the latest one. In this case, you can refer to
tags prefixed with `rules/X.Y.Z` (e.g. `rules/0.3.3`).

```bash
$ spectral lint -r https://raw.githubusercontent.com/italia/api-oas-checker/rules/0.3.3/spectral.yml $OAS_URL_OR_FILE
```

## IDE mode

Some IDEs support Spectral via extensions.
Here are the steps to use the complete validation profile
with [the official Spectral extension for Visual Studio Code](https://github.com/stoplightio/vscode-spectral):

```bash
# Install the extension from the vscode marketplace
$ code --install-extension stoplight.spectral

# Download the profile spectral-full.yml to your project home
$ curl https://italia.github.io/api-oas-checker/spectral-full.yml > .spectral.yml

# Run the IDE
$ code
```

When downloading the online version of the rules, it is important to periodically check that it is up-to-date.

### Command line mode

If you want to control your API there are two ways:

#### 1) Using the Spectral CLI

If you want to control your API using the CLI of Spectral, after cloning the repo, just launch

```bash
$ yarn
$ make rules
$ yarn run spectral lint -r spectral.yml $OAS_URL_OR_FILE
```

#### 2) Using Spectral docker image

```bash
$ docker run --rm --entrypoint=sh \
    -v $(pwd)/api:/locale stoplight/spectral:5.9.1 \
    -c "spectral lint -r https://italia.github.io/api-oas-checker/spectral.yml /locale/openapi.yaml"
```

### UI mode

This web application is based on React library and uses Webpack as a bundler and Babel to transpile JavaScript code

To launch the application

```bash
$ yarn
$ yarn start
```
or alternatively

```bash
$ docker-compose up --build start
```

and then when the build is finished, connect to http://127.0.0.1:3000/

## Testing

It is possible to test boht the correct spectral rules generation and the ui

```bash
# N.B. make test doens't work correctly on MacOS
$ make test
$ make test-ui
```

or alternatively

```bash
$ docker-compose up --build test
```

## Write rules

Spectral iterates the OAS specifications using jsonpath expressions
indicated in the [rules](rules/)
and executes the callbacks indicated on the corresponding lines.
It is possible to test every single rule (e.g. `problem`) by verifying
that the spectral output corresponds to that indicated in the associated `.snapshot` file

```bash
./test-ruleset.sh rules problem
```

Therefore, when editing a rule, it is necessary to recreate and validate the contents of the snapshot
with

```bash
./test-ruleset.sh rules --snapshot problem
git add -p rules/problem*
```

See here [spectral.yml](spectral.yml) for examples of rules.

You can test the rules online here: http://jsonpath.com/ .

Jsonpath supports back-references,
see https://github.com/json-path/JsonPath/issues/287#issuecomment-265479196

For more information on spectral rules see https://stoplight.io/p/docs/gh/stoplightio/spectral/docs/getting-started/rulesets.md

## Acknowledgements

Thanks to the following contributors for their code and ideas:
Paolo Falomo,
Giuseppe De Marco,
Francesco Marinucci
and Vincenzo Chianese.
