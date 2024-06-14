#
# Tasks set to build ruleset, bundle js, test and deploy
#
#

RULE_FILES := spectral.yml spectral-full.yml spectral-security.yml spectral-generic.yml spectral-modi.yml
RULE_DOCS := $(RULE_FILES:.yml=.doc.html)

all: clean install rules build test-ui

# Clean artifacts from the previous build
clean:
	rm -f $(RULE_DOCS)
	rm -f $(RULE_FILES)
	rm -rf functions

# Install node dependencies
install: yarn.lock
	rm -rf node_modules
	yarn install --frozen-lockfile

# Generate spectral ruleset with documentation
rules: clean $(RULE_FILES)

rulesets-dir:
	@mkdir -p functions
	@mkdir -p rules-modi/rulesets
	@mkdir -p rules-modi/rulesets/functions

spectral.yml: ./rules-modi/rules/ rulesets-dir
	make -C rules-modi $@ && mv rules-modi/rulesets/$@ .
	node ruleset_doc_generator.mjs --file $@ --title 'Italian API Guidelines'
spectral-generic.yml: ./rules-modi/rules/ spectral.yml rulesets-dir
	make -C rules-modi $@ && mv rules-modi/rulesets/$@ .
	node ruleset_doc_generator.mjs --file $@ --title 'Best Practices Only'
spectral-security.yml: ./rules-modi/rules/ ./rules-modi/security/ rulesets-dir
	make -C rules-modi $@ && mv rules-modi/rulesets/$@ . && mv rules-modi/rulesets/functions/* functions/
	node ruleset_doc_generator.mjs --file $@ --title 'Extra Security Checks'
spectral-full.yml: spectral.yml spectral-security.yml rulesets-dir
	make -C rules-modi $@ && mv rules-modi/rulesets/$@ .
	node ruleset_doc_generator.mjs --file $@ --title 'Italian API Guidelines + Extra Security Checks'
spectral-modi.yml: rulesets-dir
	make -C rules-modi $@ && mv rules-modi/rulesets/$@ .
	node ruleset_doc_generator.mjs --file $@ --title 'ModI Guidelines'

# Build js bundle
build: install rules
	yarn build-js

# Run test suite
test-ui: install
	yarn eslint
	yarn test

# TODO: this doesn't work on MacOS!
test: install
	bash test-ruleset.sh rules-modi/rules/ all
	bash test-ruleset.sh rules-modi/security/ all

# regression test with existing files
ittest: test rules
	(cd ittest && bash ittest.sh)

deploy: all
	yarn deploy
