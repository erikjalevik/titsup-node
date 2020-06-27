#!/bin/bash

# Do NOT enclose in quotes or command won't work
NODE_BINARY=~/.nvm/versions/node/v12.18.1/bin/node
TITSUP_PATH=~/dev/titsup-node/titsup.js
NAS_SHARE=admin@192.168.0.14:/volume1/share/Backup

$NODE_BINARY "$TITSUP_PATH" /mnt/d/Doks "${NAS_SHARE}/Win/Doks"
