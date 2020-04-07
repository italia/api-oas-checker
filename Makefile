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

dump:
	@echo $(CIRCLE_REPOSITORY_URL)
	@echo $(REPO_ORIGIN)
# Create the web pages in bundle/
bundle: bundle/js/bootstrap-italia.min.js bundle/out.js index.html spectral.yml
	cp index.html spectral.yml bundle

bundle/out.js: index.js package.json setup
	npx browserify --outfile bundle/out.js --standalone api_oas_checker index.js

gh-pages: dump bundle rules
	rm css js asset svg -fr
	git clone $(REPO_ORIGIN) $(TMPDIR) -b gh-pages
	cp bundle/index.html bundle/spectral.yml bundle/out.js $(TMPDIR)
	git -C $(TMPDIR) add index.html out.js spectral.yml
	git -C $(TMPDIR) -c user.name="gh-pages bot" -c user.email="gh-bot@example.it" \
		commit -m "Script updating gh-pages from $(shell git rev-parse --short HEAD). [ci skip]"
	git -C $(TMPDIR) push -q origin gh-pages:gh-pages-test
	rm $(TMPDIR) -fr

bundle/js/bootstrap-italia.min.js: 
	wget https://github.com/italia/bootstrap-italia/releases/download/v1.3.9/bootstrap-italia.zip -O bootstrap-italia.zip
	unzip -d bundle bootstrap-italia.zip

# Merge all rules into spectral.yml
rules: spectral.yml

spectral.yml: ./rules/
	cat ./rules/rules-template.yml > spectral.yml
	./rules/merge-yaml >> spectral.yml

clean:
	rm bundle -fr
	rm node_modules -fr
	rm *.zip -f
#
# Preparation goals
#
setup: package.json
	# XXX to make it work after link you need to run twice npm install
	npm install .

# Check RULE env var for interactive testing.
t:
	spectral lint rules/$(RULE)-test.yml -r rules/$(RULE).yml


test:
	# once you filter out "ko" strings, you should have no "  error  "s.
	@for f in $(shell ls rules/*-test.yml); do \
		spectral lint $$f -r `echo $$f | sed -e 's,-test,,'` ; \
		done \
		| grep -v ko | grep '  error  ' && exit 1 || exit 0
	
	
