#!/bin/bash

rm -rf dist \
  && npx tsc \
  && npx uglifyjs --compress --mangle --output dist/index.js dist/index.js \
  && npx uglifyjs --compress --mangle --output dist/utils/index.js dist/utils/index.js \
  && npx uglifyjs --compress --mangle --output dist/constants/index.js dist/constants/index.js