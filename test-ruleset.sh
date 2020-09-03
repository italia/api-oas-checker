#!/bin/bash
shopt -s extglob
export PATH="$PATH:./node_modules/.bin:"
RULES=$(cd rules; echo *.yml | sed -e 's/.yml\b//g')
RULES_REGEXP="${RULES// /|}"
echo >&2 "$RULES"

case "$1" in

    "--snapshot")
        if [ "$2" != "" ]; then
            RULE="$2"
            spectral lint rules/tests/$RULE-test.yml -r rules/$RULE.yml > rules/tests/$RULE-test.snapshot
            exit 0
        fi
        for RULE in $RULES; do
            spectral lint rules/tests/$RULE-test.yml -r rules/$RULE.yml > rules/tests/$RULE-test.snapshot
        done
        exit 0
        ;;
    all)
        for RULE in $RULES; do
            spectral lint rules/tests/$RULE-test.yml -r rules/$RULE.yml | \
                diff --color -I '^.*rules/tests/.*-test.yml$' "rules/tests/$RULE-test.snapshot" -
        done
        ;;
    @($RULES_REGEXP))
        RULE="$1"

        if [ ! -f "rules/tests/$RULE-test.snapshot" ]; then
            echo "Missing test snapshot for rule: $RULE"
            exit 1
        fi
        spectral lint rules/tests/$RULE-test.yml -r rules/$RULE.yml | \
            diff -wubBEr --color -I '^.*rules/tests/.*-test.yml$' "rules/tests/$RULE-test.snapshot" -
        TEST_OUT="$?"
        if [ "$TEST_OUT" != "0" ]; then
            echo "Unexpected test result"
            exit 1
        fi
    ;;
    *)
        echo >&2 "Please specify a rule in: $RULES"
        exit 1
    ;;
esac




