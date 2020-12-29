#
# Tasks set to build ruleset, bundle js, test and deploy
#
#

RULE_FILES := spectral.yml spectral-full.yml spectral-security.yml spectral-generic.yml

all: clean install rules build test-ui

# Clean artifacts from the previous build
clean:
	rm -f $(RULE_FILES)

# Install node dependencies
install: yarn.lock
	rm -rf node_modules
	yarn install --frozen-lockfile

# Generate spectral ruleset
rules: clean $(RULE_FILES)
spectral.yml: ./rules/
	cat ./rules/rules-template.yml.template > $@
	./rules/merge-yaml rules/*.yml >> $@
spectral-generic.yml: ./rules/  spectral.yml
	./rules/merge-yaml spectral.yml rules/skip-italian.yml.template > $@
spectral-security.yml: ./rules/  ./security/
	cat ./rules/rules-template.yml.template > $@
	./rules/merge-yaml security/*.yml >> $@
spectral-full.yml: spectral.yml spectral-security.yml
	./rules/merge-yaml spectral.yml spectral-security.yml > $@

# Build js bundle
build: install rules
	yarn build-js

# Run test suite
test-ui: install
	yarn eslint
	yarn test
test:
	bash test-ruleset.sh rules/ all
	bash test-ruleset.sh security/ all

deploy: all
	yarn deploy