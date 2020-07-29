#!/bin/bash
shopt -s extglob

export PATH="$PATH:./node_modules/.bin:"
RULES=$(ls rules/*-test.yml | sed -e 's/-test.yml//' | awk -F'[/]' '{print $2}')
RULES_L=$(echo $RULES)
# Use the extglob syntax to enable multiple pattern matching. See "Pattern Matching" in man bash.
RULES_REGEXP=@(${RULES_L// /|})
echo >&2 "$RULES_L"

case "$1" in

    "--snapshot")
        if [ "$2" != "" ]; then
            RULE="$2"
            spectral lint rules/$RULE-test.yml -r rules/$RULE.yml > rules/$RULE-test.snapshot
            exit 0
        fi
        for RULE in $RULES; do
            spectral lint rules/$RULE-test.yml -r rules/$RULE.yml > rules/$RULE-test.snapshot
        done
        exit 0
        ;;
    all)
        for RULE in $RULES; do
            spectral lint rules/$RULE-test.yml -r rules/$RULE.yml | \
                diff --color -I '^.*rules/.*-test.yml$' "rules/$RULE-test.snapshot" -
        done
        ;;
    # Requires shopt -s extglob to work.
    $RULES_REGEXP)
        RULE="$1"

        if [ ! -f "rules/$RULE-test.snapshot" ]; then
            echo "Missing test snapshot for rule: $RULE"
            exit 1
        fi
        spectral lint rules/$RULE-test.yml -r rules/$RULE.yml | \
            diff -wubBEr --color -I '^.*rules/.*-test.yml$' "rules/$RULE-test.snapshot" -
        TEST_OUT="$?"
        if [ "$TEST_OUT" != "0" ]; then
            echo "Unexpected test result"
            exit 1
        fi
    ;;
    *)
        echo >&2 "Please specify a rule in $RULES_L"
        exit 1
    ;;
esac




