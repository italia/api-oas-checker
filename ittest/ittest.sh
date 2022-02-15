#/bin/bash
# Test a list of openapi files to check if
#   ruleset are backward compatible.
export PATH+=:../node_modules/.bin:
operation=${1:-"test"}; shift
testcases="${1:-testcases.txt}"; shift
RULESET="../spectral-full.yml"

test(){
    local openapi="$1"
    local snapshot="$2"

    if [ ! -f "${RULESET}" ]; then
        echo "spectral-full not found"
        exit 1
    fi

    spectral lint -r "${RULESET}" -D -F warn "${openapi}" | \
        diff - "${snapshot}.snapshot"
}

snapshot(){
    local openapi="$1"
    local snapshot="$2"
    
    if [ ! -f "${RULESET}" ]; then
        echo "spectral-full not found"
        exit 1
    fi
    
    spectral lint -r "${RULESET}" -D -F warn "${openapi}" > "${snapshot}.snapshot"
}


while read openapi snapshot
do
    # skip comments
    grep -q "^#" <<< "$openapi" && continue

    if [ "${operation}" = "test" ]
    then
        test "${openapi}" "${snapshot}"
    elif [ "${operation}" = "snapshot" ]
    then
        snapshot "${openapi}" "${snapshot}"
    fi
   
done < "${testcases}"
