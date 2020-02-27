# In-browser API validator

Validate in-browser OAS3 specification using Italian API Guidelines.

## Build

This application uses browserify to pack a node application
using Spectral

Browser usage:

....
make
npm run b
....

Browserify recursively packs up all Node.js dependencies into the browser version of the JavaScript.

Tested on Chromium 78, Ubuntu 19.10.

## Writing rules

Spectral rules search the OAS spec using jsonpath rules
and run a callback on the identified lines.

You can test jsonpath rules online on http://jsonpath.com/.

Jsonpath supports back-references, see https://github.com/json-path/JsonPath/issues/287#issuecomment-265479196

For further info on spectral rules, see https://stoplight.io/p/docs/gh/stoplightio/spectral/docs/getting-started/rulesets.md
