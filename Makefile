#
# Generate a browser bundle
#
#
bundle/bundle.js: index.js
	npm install .
	npm install .
	sleep 1
	npx browserify --outfile bundle/bundle.js --standalone browserify_hello_world index.js

all: link bundle.js

gh-pages: bundle.js
	rm css js asset svg -fr
	git checkout gh-pages
	git checkout master -- index.html
	cp bundle.js out.js

link: 
	npm link
	npm link browserify-hello-world

bundle/js/bootstrap-italia.min.js: 
	wget https://github.com/italia/bootstrap-italia/releases/download/v1.3.9/bootstrap-italia.zip
	unzip -d bundle bootstrap-italia.zip

bundle: bundle/js/bootstrap-italia.min.js bundle.js
	mkdir -p bundle
	cp index.html  out.js bundle
