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

all: setup bundle

# Create the web pages in bundle/
bundle: bundle/js/bootstrap-italia.min.js rules index.html copy_public bundle/out.js

bundle/out.js: setup public/js/bundle.js package.json
	npx browserify --outfile bundle/out.js --standalone api_oas_checker public/js/bundle.js

gh-pages: bundle rules
	rm css js asset svg -fr
	git clone $(REPO_ORIGIN) $(TMPDIR) -b gh-pages
	cp -r bundle/* $(TMPDIR)
	git -C $(TMPDIR) add .
	git -C $(TMPDIR) -c user.name="gh-pages bot" -c user.email="gh-bot@example.it" \
		commit -m "Script updating gh-pages from $(shell git rev-parse --short HEAD). [ci skip]"
	git -C $(TMPDIR) push -q origin gh-pages
	rm $(TMPDIR) -fr

bundle/js/bootstrap-italia.min.js: setup
	cp -r node_modules/bootstrap-italia/dist/* bundle/

copy_public:
	cp public/js/* bundle/js/
	cp public/css/* bundle/css/
	cp -r public/icons bundle/icons/
	cp -t bundle index.html $(RULE_FILES)

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
	rm -rf bundle node_modules $(RULE_FILES)

#
# Preparation goals
#
setup: package-lock.json
	mkdir -p bundle
	npm ci

test:
	bash test-ruleset.sh rules/ all
	bash test-ruleset.sh security/ all

