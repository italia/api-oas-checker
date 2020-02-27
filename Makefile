#
# Generate a browser bundle
#
#
bundle/out.js: index.js
	npm install .
	npm install .
	sleep 1
	npx browserify --outfile bundle/out.js --standalone browserify_hello_world index.js

all: link bundle/out.js bundle/index.html

gh-pages: bundle/out.js bundle/index.html
	rm css js asset svg -fr
	git checkout gh-pages
	git checkout master -- index.html
	cp bundle/out.js bundle/index.html .

link: 
	npm link
	npm link browserify-hello-world

bundle/js/bootstrap-italia.min.js: 
	wget https://github.com/italia/bootstrap-italia/releases/download/v1.3.9/bootstrap-italia.zip
	unzip -d bundle bootstrap-italia.zip

bundle: bundle/js/bootstrap-italia.min.js
	mkdir -p bundle
	cp index.html bundle
