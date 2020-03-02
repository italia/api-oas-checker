# Validatore per API conformi al Modello di Interoperabilità

[![Join the #api channel](https://img.shields.io/badge/Slack-%23api-blue.svg?logo=slack)](https://developersitalia.slack.com/messages/CDKBYTG74)
[![Get invited](https://slack.developers.italia.it/badge.svg)](https://slack.developers.italia.it/)
[![API on forum.italia.it](https://img.shields.io/badge/Forum-interoperabilit%C3%A0-blue.svg)](https://forum.italia.it/c/piano-triennale/interoperabilita)

Questo repository contiene un validatore in-browser che verifica
alcune delle regole per le API REST indicate
nel Modello di Interoperabilità.

I progetti associati sono indicati nell' [API Starter Kit](https://github.com/teamdigitale/api-starter-kit)

L'applicazione on-line pronta all'uso è disponibile  
[qui](teamdigitale.github.io/api-oas-linter).

Rispetto ad altri validatori altrettanto buoni
- eg. [Zally](https://github.com/zalando/zally) -
Spectral può essere eseguito direttamente sul client (browser)
 e non richiede necessariamente l'utilizzo di un database.

## Contenuto

- Un progetto nodejs che usa webpack per creare una single-page application
- Una directory [rules/](rules/) con le regole applicate, che vengono
  poi aggregate nel file [.spectral.yml](.spectral.yml).
  
## Istruzioni

Il modo più semplice per eseguire l'applicazione 
è tramite docker-compose:

```
$ docker-compose up -d run
$ xdg-open localhost:8000
```

## Compilazione

Questa applicazione usa Browserify,
che pacchettizza ricorsivamente tutte le dipendenze
 nodejs in un javascript eseguibile dal browser.

L'applicazione è in [index.js](index.js) ed utilizza 
Spectral, un software opensource che valida un file OpenAPI
  in funzione di una serie di regole.

## Scrivere regole

Spectral itera le specifiche OAS usando le espressioni jsonpath
indicate nelle [regole](rules/)
ed esegue le callback indicate sulle righe corrispondenti.

Vedete qui [.spectral.yml](.spectral.yml) per degli esempi di regole.

Sul sito http://jsonpath.com/ si possono testare le regole online.

Jsonpath supporta le back-references,
 si veda https://github.com/json-path/JsonPath/issues/287#issuecomment-265479196

Per ulteriori informazioni sulle regole di spectra si veda https://stoplight.io/p/docs/gh/stoplightio/spectral/docs/getting-started/rulesets.md
