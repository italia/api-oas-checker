# Validatore per API conformi al Modello di Interoperabilità

[![Join the #api channel](https://img.shields.io/badge/Slack-%23api-blue.svg?logo=slack)](https://developersitalia.slack.com/messages/CDKBYTG74)
[![API on forum.italia.it](https://img.shields.io/badge/Forum-interoperabilit%C3%A0-blue.svg)](https://forum.italia.it/c/piano-triennale/interoperabilita)
[![README in English](https://img.shields.io/badge/Readme-English-darkgreen.svg)](README.en.md)

Questo repository contiene un validatore in-browser che verifica alcune delle regole per le API REST indicate nel Modello di Interoperabilità.

I progetti associati sono indicati nell' [API Starter Kit](https://github.com/teamdigitale/api-starter-kit).
E' in beta una [github-action che utilizza queste regole](https://github.com/teamdigitale/api-oas-checker-action).

L'applicazione on-line pronta all'uso è disponibile [qui](https://italia.github.io/api-oas-checker/).

Il validatore è basato su [Spectral](https://github.com/stoplightio/spectral) che abbiamo preferito rispetto ad altri software:

- [Zally](https://github.com/zalando/zally) ha bisogno di un database e non è possibile farne un webpackage;
- [Speccy](https://github.com/wework/speccy) pare supportare solo regole in javascript, mentre questo validatore utilizza dei file yaml statici.

## Contenuto

- Una applicazione web sviluppata con React che usa Webpack + Babel per creare una single-page application
- Una directory [rules/](rules/) con le regole applicate, che vengono poi aggregate nel file [spectral.yml](https://italia.github.io/api-oas-checker/spectral.yml)
- Una directory [security/](security/) con delle ulteriori regole di sicurezza, che vengono poi aggregate nel file [spectral-security.yml](https://italia.github.io/api-oas-checker/spectral-security.yml)

## Sviluppo

## Modalità online
Il modo più semplice di controllare un'API è quello di eseguire i controlli usando
direttamente - o dopo averli scaricati - i file con le regole presenti su github.

```
$ spectral lint -r https://italia.github.io/api-oas-checker/spectral.yml $OAS_URL_OR_FILE
```

## Modalità IDE
Alcuni IDE supportano Spectral tramite delle estensioni.
Di seguito i passaggi per utilizzare il profilo di validazione completo
con [l'estensione ufficiale di Spectral per Visual Studio Code](https://github.com/stoplightio/vscode-spectral):

```
# Installa l'estensione dal marketplace di vscode
$ code --install-extension stoplight.spectral

# Scarica il profilo spectral-full.yml nella home del progetto
$ curl https://italia.github.io/api-oas-checker/spectral-full.yml > .spectral.yml

# Esegui l'IDE
$ code
```

Quando si usa la versione online delle regole, è importante verificare periodicamente
che sia aggiornata.

### Modalità linea di comando
Se volete controllare la vostra API ci sono due modalità:

#### 1) Usando la CLI di Spectral
dopo aver clonato il repository, eseguite:
```
$ yarn
$ make rules
$ yarn run spectral lint -r spectral.yml $OAS_URL_OR_FILE
```

#### 2) Usando il docker
```
$ docker run --rm --entrypoint=sh -v $(pwd)/api:/locale stoplight/spectral:5.9.1 -c "spectral lint -r https://italia.github.io/api-oas-checker/spectral.yml /locale/openapi.yaml"
```

### Modalità ui
Questa applicazione web è basata sulla libreria React e usa Webpack per generare il bundle dell'applicazione con il supporto di Babel per transpilare il codice JavaScript.

Per avviare l'applicazione
```
$ yarn
$ yarn start
```
In alternativa
```
$ docker-compose up --build start
```
e al termine della compilazione collegarsi a http://127.0.0.1:3000/

## Testing

E' possibile testare sia la corretta generazione delle regole spectral che la ui

```
# N.B. make test non funziona correttamente su MacOS
$ make test
$ make test-ui
```

In alternativa
```
$ docker-compose up --build test
```

## Scrivere regole

Spectral itera le specifiche OAS usando le espressioni jsonpath
indicate nelle regole di default presenti nella directory [rules](rules/)
o in quelle di sicurezza presenti nella directory [security](security/) 
ed esegue le callback indicate sulle righe corrispondenti.
E' possibile testare ogni singola regola (eg. `problem` ) verificando
che l'output di spectral corrisponda a quello indicato nel file `.snapshot` associato

Questo comando testa le regole presenti nel file `problem.yml` contenuto nella directory `rules`.

```
./test-ruleset.sh rules problem
```

Quando si modifica una regola quindi, è necessario ricreare e validare il contenuto della snapshot
con

```
./test-ruleset.sh rules --snapshot problem
git add -p rules/problem* 
```

Vedete qui [spectral.yml](https://italia.github.io/api-oas-checker/spectral.yml) per degli esempi di regole.

Sul sito http://jsonpath.com/ si possono testare le regole online.

Jsonpath supporta le back-references,
 si veda https://github.com/json-path/JsonPath/issues/287#issuecomment-265479196

Per ulteriori informazioni sulle regole di spectral si veda https://stoplight.io/p/docs/gh/stoplightio/spectral/docs/getting-started/rulesets.md

## Contributi

Grazie a Paolo Falomo
e a Vincenzo Chianese per i suggerimenti ed i contributi!

