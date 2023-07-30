#!/usr/bin/env bash

timeout 30s python3 -m http.server -d 'src' 3000 &
xdg-open 'http://localhost:3000'
