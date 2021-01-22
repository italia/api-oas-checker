# Introducing OAS Checker

To improve API interoperability between more than 10'000 Italian agencies,
the Digital Administration Code provides an   [Interoperability Framework (Modello di Interoperabilità)](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs
featuring API guidelines.
Those rules are not specific to the public sector.
Instead, they can be used even by private companies to produce high quality APIs.

At the Digital Transformation Department
we know that rules can be hard to follow without support tools.
So we created a [checker for OpenAPI 3+ specifications](https://italia.github.io/api-oas-checker)
that verifies *a subset* of the above guidelines (currently it is not possible to certify the compliance of an API
only analyzing the OAS document).

The [repository](https://github.com/italia/api-oas-checker) contains the source for the in-browser checker,
which is published [here](https://italia.github.io/api-oas-checker) as a single-page web application.
In the same website, you can download a yaml file containing a formal description of the supported 
[rules](https://italia.github.io/api-oas-checker/spectral.yml). 

We are now working to improve:

- the coverage of the API guidelines (see [rules](https://github.com/italia/api-oas-checker/tree/master/rules);

- a set of further security checks (see [rules](https://github.com/italia/api-oas-checker/tree/master/security).

It is important to note that
the checker **is not a certification tool** - your API can pass the checks and still not be fully compliant with the guidelines - 
but it *helps* your organization to increase the quality of your APIs and quickly fix the major issues in your specs, such as:

- missing OpenAPI3+ properties or headers;
- bad, unused, underdefined schemas or inconsistent examples;
- use of the unencrypted "http" protocol;
- design pitfalls, like using the old Swagger 2 specifications, or general-purpose media-types together with the PATCH method.

The validator is based on the opensource project [Spectral](https://github.com/stoplightio/spectral), which we preferred over other good validators:

*  [Zally](https://github.com/zalando/zally) - Spectral can be web-packed and run in your (browser) without using a database;
*  [openapi-cli](https://github.com/Redocly/openapi-cli) - because while slower, Spectral allows to  describe rules YAML files, while openapi-cli rules are [written in javascript](https://github.com/Redocly/openapi-cli/tree/master/src/rules)

Moreover Spectral is the default OAS validator in the [github super-linter](https://github.com/github/super-linter) 
thus you can easily add it to  your current Continuous Integration pipeline.

To help the integration in your CI, we are working to a github action based on the spectral one;
you can have a [look at the preview here](https://github.com/teamdigitale/api-oas-checker-action)

So, use it to validate your OpenAPI specifications,  have your say and contribute to the project!
