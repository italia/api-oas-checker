#!/bin/bash
#
# Run bash -x test-ruleset.sh RULESET_DIR [RULE_NAME|all] [short]
#
shopt -s extglob
export PATH="$PATH:$PWD/node_modules/.bin:"
DIFF_OPTS='-wubBEr --color'
BASEDIR="${1?Missing base directory}"; shift

spectral_diff(){
    local rule="${1?Missing rule parameter}"

    spectral lint tests/$rule-{,[0-9]-}test.yml -r $rule.yml | \
        diff $DIFF_OPTS -I '^.*tests/.*-test.yml$' "tests/$rule-test.snapshot" -
}

spectral_diff_display(){
    local rule="${1?Missing rule parameter}"
    local SED_IGNORE_LINES='s/^\s\+[0-9:]\+//g'

    spectral lint tests/$rule-{,[0-9]-}test.yml -r $rule.yml | \
    sed -e "$SED_IGNORE_LINES" | \
    diff $DIFF_OPTS -I '^.*tests/.*-test.yml$' \
        <(sed -e "$SED_IGNORE_LINES"  "tests/$rule-test.snapshot") -

    echo "You are watching a simplified diff."
}


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
            spectral lint tests/$RULE-{,[0-9]-}test.yml -r $RULE.yml > tests/$RULE-test.snapshot
            exit 0
        fi
        for RULE in $RULES; do
            echo -n "Snapshotting rule $RULE.."
            spectral lint tests/$RULE-{,[0-9]-}test.yml -r $RULE.yml > tests/$RULE-test.snapshot
        done
        exit 0
        ;;
    all)
        for RULE in $RULES; do
            echo -n "Executing rule $RULE.."
            spectral_diff $RULE && echo "Ok"
            do_or_die "$?"
        done
        ;;
    @($RULES_REGEXP))
        RULE="$1"
        SHORT="$2"

        if [ ! -f "tests/$RULE-test.snapshot" ]; then
            echo "Missing test snapshot for rule: $RULE"
            exit 1
        fi

        if [ -n "$SHORT" ]; then
            spectral_diff_display $RULE
        else
            spectral_diff $RULE
        fi
        spectral_diff $RULE >& /dev/null && echo "Ok"

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




