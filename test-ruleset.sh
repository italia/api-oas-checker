#!/bin/bash
shopt -s extglob
export PATH="$PATH:$PWD/node_modules/.bin:"

BASEDIR="${1?Missing base directory}"; shift

do_or_die(){
	local TEST_OUT=$1
        if [ "$TEST_OUT" != "0" ]; then
            echo "X-(        TEST ERROR      X-("
            echo "X-( Unexpected test result X-("
            exit 1
        fi
}

cd "$BASEDIR" || {
  echo "missing directory $BASEDIR"
  exit 1
}

RULES=$(echo *.yml | sed -e 's/.yml\b//g')
RULES_REGEXP="${RULES// /|}"

case "$1" in

    "--snapshot")
        if [ "$2" != "" ]; then
            RULE="$2"
            echo -n "Snapshotting rule $RULE.."
            spectral lint tests/$RULE-test.yml -r $RULE.yml > tests/$RULE-test.snapshot
            exit 0
        fi
        for RULE in $RULES; do
            echo -n "Snapshotting rule $RULE.."
            spectral lint tests/$RULE-test.yml -r $RULE.yml > tests/$RULE-test.snapshot
        done
        exit 0
        ;;
    all)
        for RULE in $RULES; do
            echo -n "Executing rule $RULE.."
            spectral lint tests/$RULE-test.yml -r $RULE.yml | \
                diff --color -I '^.*tests/.*-test.yml$' "tests/$RULE-test.snapshot" - && echo "OK"
            do_or_die "$?"
        done
        ;;
    @($RULES_REGEXP))
        RULE="$1"

        if [ ! -f "tests/$RULE-test.snapshot" ]; then
            echo "Missing test snapshot for rule: $RULE"
            exit 1
        fi
        spectral lint tests/$RULE-test.yml -r $RULE.yml | \
            diff -wubBEr --color -I '^.*tests/.*-test.yml$' "tests/$RULE-test.snapshot" -
        TEST_OUT="$?"
    	do_or_die $TEST_OUT
        echo "Ok"
        exit 0
    ;;
    *)
        echo >&2 "Please specify a rule in: $RULES"
        exit 1
    ;;
esac




