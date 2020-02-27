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
