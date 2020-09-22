# APIs validator compliant to the Italian Interoperability Framework

[![Join the #api channel](https://img.shields.io/badge/Slack-%23api-blue.svg?logo=slack)](https://developersitalia.slack.com/messages/CDKBYTG74)
[![API on forum.italia.it](https://img.shields.io/badge/Forum-interoperabilit%C3%A0-blue.svg)](https://forum.italia.it/c/piano-triennale/interoperabilita)

This repository contains an in-browser validator that verifies
some of the rules for the REST APIs, as indicated in the Interoperability Model.

The associated projects are indicated in the [API Starter Kit](https://github.com/teamdigitale/api-starter-kit).
There's a Beta [github-action that uses these rules](https://github.com/teamdigitale/api-oas-checker-action).

The ready-to-use online application is available [here](https://teamdigitale.github.io/api-oas-checker).

Compared to other equally good validators
- eg. [Zally](https://github.com/zalando/zally)
Spectral can run directly on the client (browser) and does not necessarily require the use of a database.

## Content

- A nodejs project that uses webpack to create a single-page application
- A [rules/](rules/) directory with the rules applied, which come
  then aggregate in the [spectral.yml](spectral.yml) file.
  
## Usage

The easiest way to run the application
is via docker-compose:
```
$ git clone git@github.com:teamdigitale/api-oas-validator.git
$ cd api-oas-validator
$ docker-compose up -d run
$ xdg-open localhost:8000
```

Alternatively, simply perform:
```
$ npm run build
$ npm start
```

If you want to control your API using the CLI
of Spectral, just launch from the directory `api-oas-validator`

```
api-oas-validator $ spectral lint -r spectral.yml $OAS_URL_OR_FILE
```

## Setup
This application uses Browserify,
which recursively packages all dependencies
 nodejs in a javascript executable from the browser.
 
The application is in [index.js](index.js) and uses
Spectral, an open source software that validates an OpenAPI file
  according to a series of rules.
  
## Testing

To test with docker just execute:
```
docker-compose up test
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
