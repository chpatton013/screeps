#!/usr/bin/env bash

find $@ -name '*.js' | xargs --max-args=1 node --check
