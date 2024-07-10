all: install build

# Install node dependencies
install: yarn.lock
	rm -rf node_modules
	yarn install --frozen-lockfile

# Build js bundle
build: install
	yarn build-js

deploy: all
	yarn deploy