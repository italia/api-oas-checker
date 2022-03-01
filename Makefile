#
# Tasks set to build ruleset, bundle js, test and deploy
#
#

RULE_FILES := spectral.yml spectral-full.yml spectral-security.yml spectral-generic.yml
RULE_DOCS := $(RULE_FILES:.yml=.doc.html)

all: clean install rules build test-ui

# Clean artifacts from the previous build
clean:
	rm -f $(RULE_DOCS)
	rm -f $(RULE_FILES)

# Install node dependencies
install: yarn.lock
	rm -rf node_modules
	yarn install --frozen-lockfile


# Generate spectral ruleset with documentation
rules: clean $(RULE_FILES)
spectral.yml: ./rules/
	cat ./rules/rules-template.yml.template > $@
	./rules/merge-yaml rules/*.yml >> $@
	node ruleset_doc_generator.mjs --file $@ --title 'Italian API Guidelines'
spectral-generic.yml: ./rules/  spectral.yml
	./rules/merge-yaml spectral.yml rules/skip-italian.yml.template > $@
	node ruleset_doc_generator.mjs --file $@ --title 'Best Practices Only'
spectral-security.yml: ./rules/  ./security/
	cat ./rules/rules-template.yml.template > $@
	./rules/merge-yaml security/*.yml >> $@
	mkdir -p ./functions
	cp ./security/functions/* ./functions/
	node ruleset_doc_generator.mjs --file $@ --title 'Extra Security Checks'
spectral-full.yml: spectral.yml spectral-security.yml
	./rules/merge-yaml spectral.yml spectral-security.yml > $@
	node ruleset_doc_generator.mjs --file $@ --title 'Italian API Guidelines + Extra Security Checks'

# Build js bundle
build: install rules
	yarn build-js

# Run test suite
test-ui: install
	yarn eslint
	yarn test

# TODO: this doesn't work on MacOS!
test: install
	bash test-ruleset.sh rules/ all
	bash test-ruleset.sh security/ all

# regression test with existing files
ittest: test rules
	(cd ittest && bash ittest.sh)

deploy: all
	yarn deploy
