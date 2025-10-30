# APIs Checker Compliant to the Italian Interoperability Framework

[![Join the #api channel](https://img.shields.io/badge/Slack-%23api-blue.svg?logo=slack)](https://developersitalia.slack.com/messages/CDKBYTG74)
[![API on forum.italia.it](https://img.shields.io/badge/Forum-interoperabilit%C3%A0-blue.svg)](https://forum.italia.it/c/piano-triennale/interoperabilita)
[![README in Italian](https://img.shields.io/badge/Readme-Italiano-darkgreen.svg)](README.md)

💡 This repository contains an in-browser checker that verifies some of the rules for REST APIs as indicated in the Italian Interoperability Framework.

🗂️ The associated projects are indicated in the [API Starter Kit](https://github.com/teamdigitale/api-starter-kit).

👨🏻‍💻 The ready-to-use online application is available [here](https://italia.github.io/api-oas-checker/).

## 🔍 Checking APIs

The simplest way to check an API is to use this checker by entering the API content and selecting a ruleset (default: _Italian Guidelines Full_). By clicking "Check", you can examine all errors, warnings, info, and hints detected by Spectral.

📌 **For publishing an API on the PDND Catalogue**, run the OAS Checker with the **_Italian Guidelines Full_** profile and verify that the _yaml_ has **0 errors** and ideally **0 warnings**.

Alternatively, you can check APIs via IDE, CLI, and GitHub Action: please refer to the following [README](https://github.com/italia/api-oas-checker-rules/blob/main/README.md) of the [api-oas-checker-rules](https://github.com/italia/api-oas-checker-rules) repository for all the information.

## 📦 Rules

The rules used by the checker are managed in a dedicated repository: [api-oas-checker-rules](https://github.com/italia/api-oas-checker-rules).

Currently, the rulesets are:
- [spectral.yml](https://github.com/italia/api-oas-checker-rules/releases/latest/download/spectral.yml), or _Italian Guidelines Full_, the default ones
- [spectral-generic.yml](https://github.com/italia/api-oas-checker-rules/releases/latest/download/spectral-generic.yml), or _Best Practices Only_
- [spectral-security.yml](https://github.com/italia/api-oas-checker-rules/releases/latest/download/spectral-security.yml), or _Extra Security Checks_
- [spectral-full.yml](https://github.com/italia/api-oas-checker-rules/releases/latest/download/spectral-full.yml), or _Italian Guidelines Full + Extra Security Checks_

## 🚀 Running the Web App Locally

This web app is based on the React library and uses Webpack to generate the application bundle with Babel support for transpiling JavaScript code.

To start the application:

```bash
$ yarn
$ yarn start
```

Alternatively:

```bash
$ docker-compose up --build start
```

and when the build is finished, connect to http://localhost:3000

## ✍🏻 Contributions

Thanks to Paolo Falomo,
Francesco Marinucci,
Giuseppe De Marco,
Andrea Misuraca,
Simone Esposito,
Rocco Affinito
and Vincenzo Chianese for their suggestions and contributions!

⚙️ The checker is based on [Spectral](https://github.com/stoplightio/spectral).

> ### Why Spectral? 🤔
> We preferred it over other software because
it doesn't require the use of databases or server components to which you would send your OpenAPI documents (OAS Checker is a static page deployed on GitHub Pages) and because most rules are described through static files (e.g. YAML):
except in specific cases (e.g. security rulesets), it's not necessary to execute JavaScript code. Furthermore, users can always limit themselves to importing only the static rules.
>
> The alternatives we evaluated, equally valid, are:
> - [Zally](https://github.com/zalando/zally) needs a database and cannot be webpackaged;
> - [Speccy](https://github.com/wework/speccy) seems to support only JavaScript rules, while this checker mostly uses static YAML files.
