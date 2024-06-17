# Validatore per API conformi al Modello di Interoperabilità

[![Join the #api channel](https://img.shields.io/badge/Slack-%23api-blue.svg?logo=slack)](https://developersitalia.slack.com/messages/CDKBYTG74)
[![API on forum.italia.it](https://img.shields.io/badge/Forum-interoperabilit%C3%A0-blue.svg)](https://forum.italia.it/c/piano-triennale/interoperabilita)
[![README in English](https://img.shields.io/badge/Readme-English-darkgreen.svg)](README.en.md)

💡 Questo repository contiene un validatore in-browser che verifica alcune delle regole per le API REST indicate nel Modello di Interoperabilità.

🗂️ I progetti associati sono indicati nell'[API Starter Kit](https://github.com/teamdigitale/api-starter-kit).

👨🏻‍💻 L'applicazione on-line pronta all'uso è disponibile [qui](https://italia.github.io/api-oas-checker/).

⚙️ Il validatore è basato su [Spectral](https://github.com/stoplightio/spectral).

> ### Perché Spectral? 🤔
> Lo abbiamo preferito rispetto ad altri software perché
non richiede l'utilizzo di database o componenti server a cui inviare i tuoi documenti OpenAPI (OAS Checker è una pagina statica deployata su GitHub Pages) e perché la maggior parte delle regole è descritta tramite file statici (e.g. YAML):
[tranne in casi specifici](rules-modi/security/functions/) non è necessario quindi eseguire codice JavaScript. Inoltre, gli utenti possono sempre limitarsi ad importare le sole regole statiche.
>
> Le alternative valutate, ugualmente valide, sono:
> - [Zally](https://github.com/zalando/zally) ha bisogno di un database e non è possibile farne un webpackage;
> - [Speccy](https://github.com/wework/speccy) pare supportare solo regole in JavaScript, mentre questo validatore utilizza per lo più dei file YAML statici.

## 📦 Contenuto

- Una web app sviluppata con React che usa Webpack + Babel per creare una single-page application
- Due directory [rules-modi/rules](rules-modi/rules) e [rules-modi/security/](rules-modi/security/), che puntano a un altro repository, contenenti le regole applicate, che vengono poi aggregate nei seguenti file:
     - [spectral-modi.yml](https://github.com/italia/api-oas-checker-rules/releases/latest/download/spectral-modi.yml), o _Italian Guidelines_
     - [spectral.yml](https://github.com/italia/api-oas-checker-rules/releases/latest/download/spectral.yml), o _Italian Guidelines Extended_
     - [spectral-generic.yml](https://github.com/italia/api-oas-checker-rules/releases/latest/download/spectral-generic.yml), o _Best Practices Only_
     - [spectral-security.yml](https://github.com/italia/api-oas-checker-rules/releases/latest/download/spectral-security.yml), o _Extra Security Checks_
     - [spectral-full.yml](https://github.com/italia/api-oas-checker-rules/releases/latest/download/spectral-full.yml), o _Italian Guidelines Extended + Extra Security Checks_

La gestione delle regole è esterna: la cartella `rules-modi` punta, infatti, al repo [api-oas-checker-rules](https://github.com/italia/api-oas-checker-rules).

## 🔍 Validare le API

Il modo più semplice per controllare un'API è di utilizzare la versione web di questo validatore, inserendo il contenuto dell'API e selezionando un set di regole. Sarà, quindi, possibile esaminare tutti gli errori, warning, info e hint rilevati da Spectral.

In alternativa, è possibile validare le API tramite IDE, CLI e GitHub Action: si rimanda al seguente [README](https://github.com/italia/api-oas-checker-rules/blob/main/README.md) del repo [api-oas-checker-rules](https://github.com/italia/api-oas-checker-rules) per tutte le informazioni.

## 🚀 Avviare la web app in locale

Questa web app è basata sulla libreria React e usa Webpack per generare il bundle dell'applicazione con il supporto di Babel per transpilare il codice JavaScript.

Per avviare l'applicazione:

```bash
$ yarn
$ yarn start
```

In alternativa:

```bash
$ docker-compose up --build start
```

e al termine della compilazione collegarsi a http://localhost:3000


## 📝 Come scrivere le regole

Spectral itera le specifiche OAS usando le espressioni JSONPath indicate nelle regole di default presenti nelle directory [rules-modi/rules](rules-modi/rules) e [rules-modi/security/](rules-modi/security/) ed esegue le callback indicate sulle righe corrispondenti. È possibile testare ogni singolo file di regole (ad esempio, problem.yml) verificando che l’output di Spectral corrisponda a quello indicato nel file .snapshot associato.

Questo comando testa le regole presenti nel file `problem.yml` contenuto nella directory `rules-modi/rules`:

```bash
./test-ruleset.sh rules-modi/rules problem
```

Quando si modifica una regola, è necessario ricreare e validare il contenuto della snapshot con:

```bash
./test-ruleset.sh rules-modi/rules --snapshot problem
```

Per ulteriori informazioni sulle regole di Spectral si veda [la documentazione ufficiale](https://stoplight.io/p/docs/gh/stoplightio/spectral/docs/getting-started/rulesets.md).

### JSONPath

Sul sito [jsonpath.com](https://jsonpath.com/) si possono testare le regole online.

JSONPath supporta le back-references; si veda [questo commento](https://github.com/json-path/JsonPath/issues/287#issuecomment-265479196) per maggiori dettagli.

## 🪖 Testing

Per testare le regole generate nel repo [api-oas-checker-rules](https://github.com/italia/api-oas-checker-rules) e la UI, è possibile usare i seguenti comandi:

```bash
# N.B. make test non funziona correttamente su MacOS
$ make test
$ make test-ui
```

In alternativa:

```bash
$ docker-compose up --build test
```

## ✍🏻 Contributi

Grazie a Paolo Falomo,
Francesco Marinucci,
Giuseppe De Marco
e Vincenzo Chianese per i suggerimenti ed i contributi!