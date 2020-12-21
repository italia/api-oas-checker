#
# Generate a browser bundle
#
#
TMPDIR := $(shell mktemp  -u /tmp/fooXXXXXX)
RULE_FILES := spectral.yml spectral-full.yml spectral-security.yml spectral-generic.yml
# $(shell git config --get remote.origin.url)

ifndef CIRCLE_REPOSITORY_URL
	REPO_ORIGIN := "."
else
	REPO_ORIGIN := $(CIRCLE_REPOSITORY_URL)
endif

all: setup test

# Create the web pages in bundle/
bundle: rules dist 

gh-pages: bundle rules
	rm dist -fr
	git clone $(REPO_ORIGIN) $(TMPDIR) -b gh-pages
	cp -r dist/* $(TMPDIR)
	git -C $(TMPDIR) add .
	git -C $(TMPDIR) -c user.name="gh-pages bot" -c user.email="gh-bot@example.it" \
		commit -m "Script updating gh-pages from $(shell git rev-parse --short HEAD). [ci skip]"
	git -C $(TMPDIR) push -q origin gh-pages
	rm $(TMPDIR) -fr

# Merge all rules into spectral.yml
rules: setup $(RULE_FILES)

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

clean:
	# Removing compiled bundle, node_modules and various rule profiles.
	rm -rf dist node_modules $(RULE_FILES)

#
# Preparation goals
#
setup: package.json yarn.lock
	yarn
	yarn build


test: setup
	bash test-ruleset.sh rules/ all
	bash test-ruleset.sh security/ all
	yarn test

