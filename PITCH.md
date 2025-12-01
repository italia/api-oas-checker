# Introducing OAS Checker

To improve API interoperability between more than 10,000 Italian public agencies,
the Digital Administration Code provides an [Interoperability Framework (Modello di Interoperabilità)](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs)
featuring comprehensive API guidelines.
These rules are not specific to the public sector—they can be adopted by private companies to produce high-quality, interoperable APIs.

At the Digital Transformation Department,
we recognize that guidelines are most effective when supported by automated tooling.
That's why we created an [in-browser checker for OpenAPI 3+ specifications](https://italia.github.io/api-oas-checker)
that validates *a subset* of the Interoperability Framework guidelines.

**Important**: This checker is not a certification tool. It verifies compliance with specific technical rules defined in the OpenAPI specification, but full compliance with the Interoperability Framework requires broader considerations beyond what can be automatically validated.

## How It Works

The [api-oas-checker repository](https://github.com/italia/api-oas-checker) contains the source code for the in-browser checker,
published as a single-page web application at [italia.github.io/api-oas-checker](https://italia.github.io/api-oas-checker).

The validation rules themselves are maintained separately in the [api-oas-checker-rules repository](https://github.com/italia/api-oas-checker-rules),
which provides:

- Multiple rulesets for different validation profiles (Italian Guidelines Full, Best Practices Only, Extra Security Checks)
- Downloadable rule files via [GitHub releases](https://github.com/italia/api-oas-checker-rules/releases/latest)
- Integration options for IDE, CLI, and CI/CD pipelines
- [GitHub Action configuration](https://github.com/italia/api-oas-checker-rules/blob/main/docs/resources/github-action.yml) for automated validation

## What It Validates

While the checker cannot certify full compliance with the Interoperability Framework,
it helps organizations quickly identify and fix common issues in OpenAPI specifications:

- Missing required OpenAPI 3+ properties or headers
- Poorly defined, unused, or inconsistent schemas
- Invalid or missing examples
- Use of unencrypted HTTP protocol
- Design anti-patterns (e.g., outdated Swagger 2 format, incorrect media types with PATCH method)

## Why Spectral?

The validator is based on [Spectral](https://github.com/stoplightio/spectral), which we selected for several key advantages:

- **Privacy-first**: No database or server components required—OAS Checker runs entirely in your browser without sending your API specifications anywhere
- **Rule transparency**: Most rules are defined in declarative YAML files, not opaque JavaScript code
- **Selective adoption**: Users can import only the static rule files they need
- **Industry adoption**: Spectral is the default OAS validator in [GitHub Super-Linter](https://github.com/github/super-linter)

We evaluated other excellent validators:
- [Zally](https://github.com/zalando/zally) - requires a database and cannot be packaged for browser use
- [openapi-cli](https://github.com/Redocly/openapi-cli) - rules are [written in JavaScript](https://github.com/Redocly/openapi-cli/tree/master/src/rules), making them less transparent and harder to audit

## Getting Started

**Web Interface**: Visit [italia.github.io/api-oas-checker](https://italia.github.io/api-oas-checker) to validate your OpenAPI specifications immediately.

**CI/CD Integration**: Add automated validation to your pipeline using the GitHub Action. See the [example configuration](https://github.com/italia/api-oas-checker-rules/blob/main/docs/resources/github-action.yml).

**CLI/IDE**: For local development workflows, refer to the [api-oas-checker-rules documentation](https://github.com/italia/api-oas-checker-rules).

## Publishing to PDND Catalogue

To publish an API on the PDND (Piattaforma Digitale Nazionale Dati) Catalogue:
1. Run the OAS Checker with the **Italian Guidelines Full** profile
2. Ensure your specification has **0 errors** and ideally **0 warnings**

## Contributing

We welcome contributions! Use the checker to validate your specifications, share feedback, and help us improve the tool.

For rule suggestions or issues, visit:
- [api-oas-checker repository](https://github.com/italia/api-oas-checker) - for the web interface
- [api-oas-checker-rules repository](https://github.com/italia/api-oas-checker-rules) - for validation rules
