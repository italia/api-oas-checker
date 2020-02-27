#
# Generate a browser bundle
#
#
bundle.js: link index.js
	npm install .
	npm install .
	sleep 1
	npm run b
	npx browserify --outfile bundle.js --standalone browserify_hello_world index.js

all: link bundle.js

gh-pages: bundle.js
	rm css js asset svg -fr
	git checkout gh-pages
	git checkout master -- index.html
	cp bundle.js out.js

	

link: 
	npm link
	npm link browserify-hello-world

js/bootstrap-italia.min.js: 
	wget https://github.com/italia/bootstrap-italia/releases/download/v1.3.9/bootstrap-italia.zip
	unzip bootstrap-italia.zip


