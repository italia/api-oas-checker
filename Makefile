#
# Generate a browser bundle
#
#
all: link
	npm install .
	npm run b

link: bootstrap
	npm link
	npm link browserify-hello-world

bootstrap: js/bootstrap-italia.min.js
	wget https://github.com/italia/bootstrap-italia/releases/download/v1.3.9/bootstrap-italia.zip
	unzip bootstrap-italia.zip


