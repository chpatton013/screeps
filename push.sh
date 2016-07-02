#!/usr/bin/env bash

set -euo pipefail

root="$(builtin cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

"$root/lint.sh" "$root/src"
"$root/grunt" screeps
