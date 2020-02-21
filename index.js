const { Spectral,  isOpenApiv2, isOpenApiv3 } = require('@stoplight/spectral');
const { getLocationForJsonPath, parseWithPointers } = require("@stoplight/yaml");



function parse(oas3, ruleset){
	ruleset = ruleset || "https://raw.githubusercontent.com/ioggstream/oas-spectral-validator/master/.spectral.yml"

	return new Promise((resolve, reject) => {
		const myOpenApiDocument = parseWithPointers(oas3);
		const spectral = new Spectral();
		spectral.registerFormat('oas2', isOpenApiv2);
		spectral.registerFormat('oas3', isOpenApiv3);
		spectral.loadRuleset(ruleset)
		  .then(() => spectral
			  .run({
				parsed: myOpenApiDocument,
				getLocationForJsonPath,
			  })
			  .then((out) => {
				console.log(out);
				resolve(out);
			}));
	});
}
exports.parse = parse;


function parse_url(url){
	fetch(url).then(function(r){
                r.text().then(function(oas){
			console.log("url: " + url); 
			console.log("oas: " + oas); 
			lint = browserify_hello_world.parse(oas, null); 
			console.log(lint); 
		});
	});
};
exports.parse_url = parse_url;
