#
# Generate a browser bundle
#
#
TMPDIR := $(shell mktemp  -u /tmp/fooXXXXXX)
# $(shell git config --get remote.origin.url)

ifndef CIRCLE_REPOSITORY_URL
	REPO_ORIGIN := "."
else
	REPO_ORIGIN := $(CIRCLE_REPOSITORY_URL)
endif

all: setup bundle

# Create the web pages in bundle/
bundle: bundle/js/bootstrap-italia.min.js copy_public bundle/out.js index.html spectral.yml

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
	cp index.html spectral.yml bundle

# Merge all rules into spectral.yml
rules: spectral.yml

spectral.yml: ./rules/
	cat ./rules/rules-template.yml > spectral.yml
	./rules/merge-yaml >> spectral.yml

clean:
	# removing compiled bundle and node_modules
	rm -rf bundle node_modules

#
# Preparation goals
#
setup: package.json
	mkdir -p bundle
	npm install .


test:
	# once you filter out "ko" strings, you should have no "  error  "s.
	bash test-rules.sh all	
	
