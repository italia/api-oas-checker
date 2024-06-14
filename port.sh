#!/bin/bash

# Verifica se l'utente ha fornito un numero di porta
if [ -z "$1" ]; then
  echo "Uso: $0 <porta>"
  exit 1
fi

PORT=$1

# Trova il PID dei processi che utilizzano la porta
PIDS=$(lsof -t -i :$PORT)

# Termina i processi
if [ -n "$PIDS" ]; then
  echo "Terminazione dei processi sulla porta $PORT..."
  kill -9 $PIDS
  echo "Porta $PORT liberata."
else
  echo "Nessun processo trovato sulla porta $PORT."
fi