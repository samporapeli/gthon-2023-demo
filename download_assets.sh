#!/usr/bin/env bash

set -e

ASSET_DIR="./src/assets"

rm -fr "$ASSET_DIR"
mkdir "$ASSET_DIR"
cd "$ASSET_DIR"

wget https://github.com/processing/p5.js/releases/download/v1.7.0/p5.js

wget https://unpkg.com/tone@14.7.77/build/Tone.js
wget https://unpkg.com/tone@14.7.77/build/Tone.js.map

wget https://github.com/google/fonts/raw/25eaecbae770620f7df306d61f3e400b0caf0562/ofl/pressstart2p/PressStart2P-Regular.ttf

echo "Done!"
