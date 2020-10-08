#!/bin/bash

dir="$(dirname "${BASH_SOURCE[0]}")/.."

rm -rf $dir/dist \
  && npx tsc \
  && npx uglifyjs --compress --mangle --output $dir/dist/index.js $dir/dist/index.js \
  && npx uglifyjs --compress --mangle --output $dir/dist/utils/index.js $dir/dist/utils/index.js \
  && npx uglifyjs --compress --mangle --output $dir/dist/constants/index.js $dir/dist/constants/index.js