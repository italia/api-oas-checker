const {
  Spectral,
  isOpenApiv2,
  isOpenApiv3,
  isOpenApiv3_1,
  isJSONSchema,
  isJSONSchemaDraft2019_09
} = require('@stoplight/spectral');
const { getLocationForJsonPath, parseWithPointers } = require("@stoplight/yaml");
const { Resolver } = require('@stoplight/json-ref-resolver');
const { resolveFile, resolveHttp } = require('@stoplight/json-ref-readers');


const httpAndFileResolver = new Resolver({
  resolvers: {
    https: { resolve: resolveHttp },
    http: { resolve: resolveHttp },
    file: { resolve: resolveFile },
  },
});


/**
 * Parse an OAS file resolving yaml anchors and merging keys.
 */
function parse_and_resolve_yaml_anchors(oas3) {
  return parseWithPointers(oas3, { mergeKeys: true })
}


function parse(oas3, ruleset, skip) {
  ruleset = ruleset || "https://raw.githubusercontent.com/teamdigitale/api-oas-checker/master/spectral.yml";
  skip = skip || ["has-x-summary"];
  return new Promise((resolve, reject) => {
    const myOpenApiDocument = parse_and_resolve_yaml_anchors(oas3);
    console.log(myOpenApiDocument);
    const spectral = new Spectral({ resolver: httpAndFileResolver });
    spectral.registerFormat('oas2', isOpenApiv2);
    spectral.registerFormat('oas3', isOpenApiv3);
    spectral.registerFormat('json-schema', isJSONSchema);
    spectral.registerFormat('json-schema-2019-09', isJSONSchemaDraft2019_09);
    spectral.loadRuleset(ruleset)
      .then(() => {
        /** Skip rules. */
        skip.forEach((s) => {
          delete spectral.rules[s];
        });
        console.log("rules", spectral.rules);
        spectral
          .run({
            parsed: myOpenApiDocument,
            getLocationForJsonPath,
          })
          .then((out) => {
            console.log(out);
            resolve(out);
          })
      });
  });
}
exports.parse = parse;