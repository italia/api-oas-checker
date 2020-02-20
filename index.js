const uniq = require('uniq');

function myfunc() {
  return uniq([1, 2, 2, 3]).join(' ');
}
exports.myfunc = myfunc;

const { Spectral } = require('@stoplight/spectral');
const { getLocationForJsonPath, parseWithPointers } = require("@stoplight/yaml");


function parse(oas3){
return new Promise((resolve, reject) => {
	const myOpenApiDocument = parseWithPointers(oas3);
	const spectral = new Spectral();
	spectral
	  .run({
	    parsed: myOpenApiDocument,
	    getLocationForJsonPath,
	  })
	  .then((out) => {
		console.log(out);
		resolve(out);
	});
})	
}
exports.parse = parse;


async function parse_url(url, ){
	fetch(url).then(function(r){
                r.text().then(function(oas){
			console.log("url: " + url); 
			console.log("oas: " + oas); 
			lint = browserify_hello_world.parse(oas); 
			console.log(lint); 
		});
	});
};
exports.parse_url = parse_url;
