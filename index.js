const { Spectral,  isOpenApiv2, isOpenApiv3 } = require('@stoplight/spectral');
const { getLocationForJsonPath, parseWithPointers } = require("@stoplight/yaml");



function parse(oas3){
	return new Promise((resolve, reject) => {
		const myOpenApiDocument = parseWithPointers(oas3);
		const spectral = new Spectral();
		spectral.registerFormat('oas2', isOpenApiv2);
		spectral.registerFormat('oas3', isOpenApiv3);

		spectral.loadRuleset("https://gist.githubusercontent.com/ioggstream/88087a229643dc3186290acdb5d0de1f/raw/7b5d24185e2b8debf86ba6a639ce0b9837d7a452/ruleset.yml")
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


function parse_url(url, ){
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
