# Mac notes

`rsync` takes care of the whole job on Mac, including deletions.

To automatically schedule script on Mac:

1. Update `titsup.plist`
2. Copy `titsup.plist` into `~/Library/LaunchAgents`
3. `launchctl stop local.titsup`
4. `launchctl unload ~/Library/LaunchAgents/titsup.plist`
5. `launchctl load ~/Library/LaunchAgents/titsup.plist`

It seems that the file is only parsed when running load, so just updating the file in place doesn't cut it.

To see running process and eventual error codes, do `launctl list | grep titsup`. Some logging output can be found in Console.app filtered on "titsup".

If we don't do `open -a Terminal ...`, it will run hidden in the background.

The reason we're not using `/Volume/share` is that I could not get the mount command to work with that path, it only works from Finder. Unmounting of `/Volumes/share` is necessary in the beginning because otherwise `/tmp/share` won't mount saying it's already mounted.

# Windows notes

Using `rsync` here as well now via installed Ubuntu in WSL. We have a file `backupToNAS.bat` out in Doks on Windows, which is registered with the Task Scheduler (shows up as Aufgabeplanung in the start menu) to run on a daily schedule. This file calls:

```
wsl bash -c "bash ~/dev/titsup-node/backup-to-nas-wsl.sh"
```

Internally, it then launches `titsup.js` on a few different locations.
