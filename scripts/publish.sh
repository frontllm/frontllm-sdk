#!/bin/bash

cd "$(dirname "${BASH_SOURCE[0]}")"

cd ../sdk
yarn build
npm publish
