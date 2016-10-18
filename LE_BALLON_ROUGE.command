#!/bin/bash

cd "`dirname "$0"`"
npm install
./node_modules/electron/cli.js .
