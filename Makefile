#
# Generate a browser bundle
#
#
all:
	npm link
	npm link browserify-hello-world
	npm install .
	npm run b

