#!/bin/sh

umount /Volumes/share
mkdir /tmp/share
mount -t afp afp://admin:p0wersh0werNAS@192.168.0.14/share /tmp/share
~/.nvm/versions/node/v12.5.0/bin/node ~/dev/titsup-node/titsup.js ~ /tmp/share/Backup/Mac/ejal
umount /tmp/share
rmdir /tmp/share
