#
# Generate a browser bundle
#
#
TMPDIR := $(shell mktemp  -u /tmp/fooXXXXXX)
RULE_FILES := spectral.yml spectral-full.yml spectral-security.yml spectral-generic.yml

ifndef CIRCLE_REPOSITORY_URL
	REPO_ORIGIN := "."
else
	REPO_ORIGIN := $(CIRCLE_REPOSITORY_URL)
endif

# Clean artifacts from the previous build
# Install node dependencies
# Generate spectral ruleset
# Build js bundle
# Run test suite
all: clean install rules build test-ui

clean:
	rm -f $(RULE_FILES)

install: yarn.lock
	rm -rf node_modules
	yarn install --frozen-lockfile

# Generate ruleset
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

build: install rules
	yarn build-js

test-ui: install
	yarn eslint
	yarn test

test:
	bash test-ruleset.sh rules/ all
	bash test-ruleset.sh security/ all

# TODO remove and use https://www.npmjs.com/package/gh-pages
gh-pages: rules build
	rm dist -fr
	git clone $(REPO_ORIGIN) $(TMPDIR) -b gh-pages
	cp -r dist/* $(TMPDIR)
	git -C $(TMPDIR) add .
	git -C $(TMPDIR) -c user.name="gh-pages bot" -c user.email="gh-bot@example.it" \
		commit -m "Script updating gh-pages from $(shell git rev-parse --short HEAD). [ci skip]"
	git -C $(TMPDIR) push -q origin gh-pages
	rm $(TMPDIR) -fr