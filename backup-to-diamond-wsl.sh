#!/bin/bash

# Do NOT enclose in quotes or command won't work
NODE_BINARY=~/.nvm/versions/node/v12.18.1/bin/node
TITSUP_PATH=~/dev/titsup-node/titsup.js

$NODE_BINARY "$TITSUP_PATH" /mnt/d/Musik /mnt/f/backup/Musik
$NODE_BINARY "$TITSUP_PATH" /mnt/d/Doks /mnt/f/backup/Doks
$NODE_BINARY "$TITSUP_PATH" /mnt/c/Users/Erik/dev /mnt/f/backup/dev
