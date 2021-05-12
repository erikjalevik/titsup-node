#!/bin/bash

# Do NOT enclose in quotes or command won't work
NODE_BINARY=~/.nvm/versions/node/v12.18.1/bin/node
TITSUP_PATH=~/dev/titsup-node/titsup.js
NAS_PATH=erik@192.168.0.14:/volume1

$NODE_BINARY "$TITSUP_PATH" /mnt/d/Musik "${NAS_PATH}/share/music"
$NODE_BINARY "$TITSUP_PATH" /mnt/d/Video "${NAS_PATH}/share/video"

$NODE_BINARY "$TITSUP_PATH" /mnt/d/Doks "${NAS_PATH}/share/Backup/Win/Doks"
$NODE_BINARY "$TITSUP_PATH" /mnt/c/Users/Erik/dev "${NAS_PATH}/share/Backup/Win/dev"
