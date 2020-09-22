# Validatore per API conformi al Modello di Interoperabilità

[![Join the #api channel](https://img.shields.io/badge/Slack-%23api-blue.svg?logo=slack)](https://developersitalia.slack.com/messages/CDKBYTG74)
[![API on forum.italia.it](https://img.shields.io/badge/Forum-interoperabilit%C3%A0-blue.svg)](https://forum.italia.it/c/piano-triennale/interoperabilita)

Questo repository contiene un validatore in-browser che verifica
alcune delle regole per le API REST indicate
nel Modello di Interoperabilità.

I progetti associati sono indicati nell' [API Starter Kit](https://github.com/teamdigitale/api-starter-kit).
E' in beta una [github-action che utilizza queste regole](https://github.com/teamdigitale/api-oas-checker-action).

L'applicazione on-line pronta all'uso è disponibile  
[qui](https://teamdigitale.github.io/api-oas-checker).

Rispetto ad altri validatori altrettanto buoni
- eg. [Zally](https://github.com/zalando/zally) -
Spectral può essere eseguito direttamente sul client (browser)
 e non richiede necessariamente l'utilizzo di un database.

## Contenuto

- Un progetto nodejs che usa webpack per creare una single-page application
- Una directory [rules/](rules/) con le regole applicate, che vengono
  poi aggregate nel file [spectral.yml](spectral.yml).
  
## Istruzioni

Il modo più semplice per eseguire l'applicazione 
è tramite docker-compose:

```
$ git clone git@github.com:teamdigitale/api-oas-validator.git
$ cd api-oas-validator
$ docker-compose up -d run
$ xdg-open localhost:8000
```

In alternativa sarà sufficiente eseguire:
```
$ npm run build
$ npm start
```

Se volete controllare la vostra API usando la CLI
di Spectral, vi basta lanciare dalla directory `api-oas-validator`

```
api-oas-validator $ spectral lint -r spectral.yml $OAS_URL_OR_FILE
```

## Compilazione

Questa applicazione usa Browserify,
che pacchettizza ricorsivamente tutte le dipendenze
 nodejs in un javascript eseguibile dal browser.

L'applicazione è in [index.js](index.js) ed utilizza 
Spectral, un software opensource che valida un file OpenAPI
  in funzione di una serie di regole.

## Testing

Per testare con docker basta lanciare

```
docker-compose up test
```

## Scrivere regole

Spectral itera le specifiche OAS usando le espressioni jsonpath
indicate nelle [regole](rules/)
ed esegue le callback indicate sulle righe corrispondenti.
E' possibile testare ogni singola regola (eg. `problem` ) verificando
che l'output di spectral corrisponda a quello indicato nell file `.snapshot` associato

```
./test-ruleset.sh problem
```

Quando si modifica una regola quindi, è necessario ricreare e validare il contenuto della snapshot
con

```
./test-ruleset.sh --snapshot problem
git add -p rules/problem* 
```

Vedete qui [spectral.yml](spectral.yml) per degli esempi di regole.

Sul sito http://jsonpath.com/ si possono testare le regole online.

Jsonpath supporta le back-references,
 si veda https://github.com/json-path/JsonPath/issues/287#issuecomment-265479196

Per ulteriori informazioni sulle regole di spectral si veda https://stoplight.io/p/docs/gh/stoplightio/spectral/docs/getting-started/rulesets.md

## Contributi

Grazie a Paolo Falomo
e a Vincenzo Chianese per i suggerimenti ed i contributi!

