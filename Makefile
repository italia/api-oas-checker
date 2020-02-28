#
# Generate a browser bundle
#
#
all: setup bundle

# Create the web pages in bundle/
bundle: bundle/js/bootstrap-italia.min.js bundle/out.js index.html
	cp index.html bundle

bundle/out.js: index.js package.json
	npx browserify --outfile bundle/out.js --standalone browserify_hello_world index.js

gh-pages: bundle
	rm css js asset svg -fr
	git clone . /tmp/antani -b gh-pages
	cp bundle/index.html  bundle/out.js /tmp/antani
	git -C /tmp/antani add index.html out.js
	git -C /tmp/antani -c user.name="gh-pages bot" -c user.email="gh-bot@example.it" commit -m "Script updating gh-pages from $(shell git rev-parse short HEAD). [ci skip]"


bundle/js/bootstrap-italia.min.js: 
	wget https://github.com/italia/bootstrap-italia/releases/download/v1.3.9/bootstrap-italia.zip -O bootstrap-italia.zip
	unzip -d bundle bootstrap-italia.zip


clean:
	rm bundle -fr
	rm node_modules -fr
#
# Preparation goals
#
/usr/local/lib/node_modules/browserify-hello-world: package.json
	npm link
	npm link browserify-hello-world

setup: /usr/local/lib/node_modules/browserify-hello-world package.json
	# XXX to make it work after link you need to run twice npm install
	npm install .
	npm install .
