# Checker per API conformi al Modello di Interoperabilità

[![Join the #api channel](https://img.shields.io/badge/Slack-%23api-blue.svg?logo=slack)](https://developersitalia.slack.com/messages/CDKBYTG74)
[![API on forum.italia.it](https://img.shields.io/badge/Forum-interoperabilit%C3%A0-blue.svg)](https://forum.italia.it/c/piano-triennale/interoperabilita)
[![README in English](https://img.shields.io/badge/Readme-English-darkgreen.svg)](README.en.md)

💡 Questo repository contiene un checker in-browser che verifica alcune delle regole per le API REST indicate nel Modello di Interoperabilità.

🗂️ I progetti associati sono indicati nell'[API Starter Kit](https://github.com/teamdigitale/api-starter-kit).

👨🏻‍💻 L'applicazione on-line pronta all'uso è disponibile [qui](https://italia.github.io/api-oas-checker/).

## 🔍 Eseguire il check delle API

Il modo più semplice per controllare un'API è di utilizzare questo checker, inserendo il contenuto dell'API e selezionando un set di regole (di default: _Italian Guidelines Full_). Cliccando su "Check" sarà possibile esaminare tutti gli errori, warning, info e hint rilevati da Spectral.

📌 **Per la pubblicazione di una API sul Catalogo PDND**, eseguire l'OAS Checker con il profilo **_Italian Guidelines Full_** e verificare che lo _yaml_ presenti **0 errori** ed auspicabilmente **0 warnings**.

In alternativa, è possibile fare il check delle API tramite IDE, CLI e GitHub Action: si rimanda al seguente [README](https://github.com/italia/api-oas-checker-rules/blob/main/README.md) del repo [api-oas-checker-rules](https://github.com/italia/api-oas-checker-rules) per tutte le informazioni.

## 📦 Regole

Le regole che il checker utilizzata sono gestite in un repository dedicato: [api-oas-checker-rules](https://github.com/italia/api-oas-checker-rules).

Al momento, i ruleset sono:
- [spectral.yml](https://github.com/italia/api-oas-checker-rules/releases/latest/download/spectral.yml), o _Italian Guidelines Full_, quelle di default
- [spectral-generic.yml](https://github.com/italia/api-oas-checker-rules/releases/latest/download/spectral-generic.yml), o _Best Practices Only_
- [spectral-security.yml](https://github.com/italia/api-oas-checker-rules/releases/latest/download/spectral-security.yml), o _Extra Security Checks_
- [spectral-full.yml](https://github.com/italia/api-oas-checker-rules/releases/latest/download/spectral-full.yml), o _Italian Guidelines Full + Extra Security Checks_

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

## ✍🏻 Contributi

Grazie a Paolo Falomo,
Francesco Marinucci,
Giuseppe De Marco,
Andrea Misuraca,
Simone Esposito,
Rocco Affinito
e Vincenzo Chianese per i suggerimenti ed i contributi!

⚙️ Il checker è basato su [Spectral](https://github.com/stoplightio/spectral).

> ### Perché Spectral? 🤔
> Lo abbiamo preferito rispetto ad altri software perché
non richiede l'utilizzo di database o componenti server a cui inviare i tuoi documenti OpenAPI (OAS Checker è una pagina statica deployata su GitHub Pages) e perché la maggior parte delle regole è descritta tramite file statici (e.g. YAML):
tranne in casi specifici (es. set di regole per la security), non è necessario quindi eseguire codice JavaScript. Inoltre, gli utenti possono sempre limitarsi ad importare le sole regole statiche.
>
> Le alternative valutate, ugualmente valide, sono:
> - [Zally](https://github.com/zalando/zally) ha bisogno di un database e non è possibile farne un webpackage;
> - [Speccy](https://github.com/wework/speccy) pare supportare solo regole in JavaScript, mentre questo checker utilizza per lo più dei file YAML statici.
