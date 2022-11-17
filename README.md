# Validatore per API conformi al Modello di Interoperabilità

[![Join the #api channel](https://img.shields.io/badge/Slack-%23api-blue.svg?logo=slack)](https://developersitalia.slack.com/messages/CDKBYTG74)
[![API on forum.italia.it](https://img.shields.io/badge/Forum-interoperabilit%C3%A0-blue.svg)](https://forum.italia.it/c/piano-triennale/interoperabilita)
[![README in English](https://img.shields.io/badge/Readme-English-darkgreen.svg)](README.en.md)

Questo repository contiene un validatore in-browser che verifica alcune delle regole per le API REST indicate nel Modello di Interoperabilità.

I progetti associati sono indicati nell' [API Starter Kit](https://github.com/teamdigitale/api-starter-kit).
E' in beta una [github-action che utilizza queste regole](https://github.com/teamdigitale/api-oas-checker-action).

L'applicazione on-line pronta all'uso è disponibile [qui](https://italia.github.io/api-oas-checker/).

Il validatore è basato su [Spectral](https://github.com/stoplightio/spectral).
Lo abbiamo preferito rispetto ad altri software perché
non richiede l'utilizzo di database o componenti server a cui inviare i tuoi documenti OpenAPI (OAS Checker è una pagina statica deployata su github pages),
e perché la maggior parte delle regole è descritta tramite file statici (e.g. YAML):
[tranne in casi specifici](security/functions/) non è necessario quindi eseguire codice javascript.
Inoltre gli utenti possono sempre limitarsi ad importare le sole regole statiche.

Le alternative valutate, ugualmente valide, sono:

- [Zally](https://github.com/zalando/zally) ha bisogno di un database e non è possibile farne un webpackage;
- [Speccy](https://github.com/wework/speccy) pare supportare solo regole in javascript, mentre questo validatore utilizza per lo più dei file YAML statici.

## Contenuto

- Una applicazione web sviluppata con React che usa Webpack + Babel per creare una single-page application
- Una directory [rules/](rules/) con le regole applicate, che vengono poi aggregate nel file [spectral.yml](https://italia.github.io/api-oas-checker/spectral.yml)
- Una directory [security/](security/) con delle ulteriori regole di sicurezza, che vengono poi aggregate nel file [spectral-security.yml](https://italia.github.io/api-oas-checker/spectral-security.yml)

## Sviluppo

## Modalità online

Il modo più semplice di controllare un'API è quello di eseguire i controlli usando
direttamente - o dopo averli scaricati - i file con le regole presenti su github.

```bash
$ spectral lint -r https://italia.github.io/api-oas-checker/spectral.yml $OAS_URL_OR_FILE
```

## Modalità CI (versioned rulesets)

Quando integrate il validatore in una CI, potreste voler usare una versione
specifica delle regole, anziché l'ultima. In questo caso potete fare riferimento
ai tag con prefisso `rules/X.Y.Z` (es. `rules/0.3.3`).

```bash
$ spectral lint -r https://raw.githubusercontent.com/italia/api-oas-checker/rules/0.3.3/spectral.yml $OAS_URL_OR_FILE
```

## Modalità IDE

Alcuni IDE supportano Spectral tramite delle estensioni.
Di seguito i passaggi per utilizzare il profilo di validazione completo
con [l'estensione ufficiale di Spectral per Visual Studio Code](https://github.com/stoplightio/vscode-spectral):

```bash
# Installa l'estensione dal marketplace di vscode
$ code --install-extension stoplight.spectral

# Scarica il profilo spectral-full.yml nella home del progetto
$ curl https://italia.github.io/api-oas-checker/spectral-full.yml > .spectral.yml

# Esegui l'IDE
$ code
```

Quando si scarica la versione online delle regole, è importante verificare periodicamente
che sia aggiornata.

### Modalità linea di comando

Se volete controllare la vostra API ci sono due modalità:

#### 1) Usando la CLI di Spectral

dopo aver clonato il repository, eseguite:

```bash
$ yarn
$ make rules
$ yarn run spectral lint -r spectral.yml $OAS_URL_OR_FILE
```

#### 2) Usando l'immagine docker di Spectral

```bash
$ docker run --rm --entrypoint=sh \
     -v $(pwd)/api:/locale stoplight/spectral:5.9.1 \
     -c "spectral lint -r https://italia.github.io/api-oas-checker/spectral.yml /locale/openapi.yaml"
```

### Modalità ui

Questa applicazione web è basata sulla libreria React e usa Webpack per generare il bundle dell'applicazione con il supporto di Babel per transpilare il codice JavaScript.

Per avviare l'applicazione

```bash
$ yarn
$ yarn start
```

In alternativa

```bash
$ docker-compose up --build start
```

e al termine della compilazione collegarsi a http://127.0.0.1:3000/

## Testing

E' possibile testare sia la corretta generazione delle regole spectral che la ui

```bash
# N.B. make test non funziona correttamente su MacOS
$ make test
$ make test-ui
```

In alternativa

```bash
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

```bash
./test-ruleset.sh rules problem
```

Quando si modifica una regola quindi, è necessario ricreare e validare il contenuto della snapshot
con

```bash
./test-ruleset.sh rules --snapshot problem
git add -p rules/problem* rules/tests/problem*
```

Vedete qui [spectral.yml](https://italia.github.io/api-oas-checker/spectral.yml) per degli esempi di regole.

Sul sito https://jsonpath.com/ si possono testare le regole online.

Jsonpath supporta le back-references,
 si veda https://github.com/json-path/JsonPath/issues/287#issuecomment-265479196

Per ulteriori informazioni sulle regole di spectral si veda https://stoplight.io/p/docs/gh/stoplightio/spectral/docs/getting-started/rulesets.md

## Contributi

Grazie a Paolo Falomo,
Francesco Marinucci,
Giuseppe De Marco
e Vincenzo Chianese per i suggerimenti ed i contributi!
