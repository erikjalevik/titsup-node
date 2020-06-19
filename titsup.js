// Run like so:
//   node titsup.js sourceDir targetDir [--dry-run]
// Neither dir should have trailing slash.

const fs = require('fs');
const spawn = require('child_process').spawn;
const os = require("os");

const rimraf = require('rimraf');

function traverseDir(dir, operateOnFile, operateOnDir) {
	const files = fs.readdirSync(dir);
	files.forEach((f) => {
		const path = `${dir}/${f}`;
		const stat = fs.lstatSync(path);
		if (stat.isFile()) {
			operateOnFile(path);
		}
		else if (stat.isDirectory()) {
			operateOnDir(path);
			if (fs.existsSync(path)) {
				traverseDir(path, operateOnFile, operateOnDir);
			}
		}
	});
}

function syncDeleter(srcDir, targetDir, deleteFn, dryRun) {
	return (targetPath) => {
		const pathWithoutTargetDir = targetPath.slice(targetDir.length);
		const pathInSrcDir = srcDir + pathWithoutTargetDir;

		const srcRemoved = !fs.existsSync(pathInSrcDir);
		if (srcRemoved) {
			console.log(targetPath);
			if (!dryRun) {
				try {
					deleteFn(targetPath);
				} catch (er) {
					console.log(`ERROR - Deletion failed: ${er}`);
				}
			}
		}
	}
}

// Main

args = process.argv.splice(2);

if (args.length < 2) {
	console.log("Please provide source and target directories.");
} else {
	const srcDir = args[0];
	const targetDir = args[1];
	const dryRun = args.length > 2 && args[2] === '--dry-run';

  let proc;
  if (os.platform() === 'win32') {
    // Delete files and folders on target that have been deleted from source
    console.log(`--- Deleting from ${targetDir}${dryRun ? ' - DRY RUN' : ''} ---`);

    const syncDeletedFiles = syncDeleter(srcDir, targetDir, fs.unlinkSync, dryRun);

    const rmrf = (path) => { rimraf.sync(path, {disableGlob: true}); };
    const syncDeletedDirs = syncDeleter(srcDir, targetDir, rmrf, dryRun);

    traverseDir(targetDir, syncDeletedFiles, syncDeletedDirs);

    // Copy files and folders from source that don't exist in target
    console.log(`--- Copying from ${srcDir} to ${targetDir} ---`);

    // /D - only with newer date
    // /E - dirs and subdirs
    // /C - continue after errors
    // /I - assumes that destination is a dir
    // /Q - quiet
    // /F - displays filenames
    // /L - displays files that would be copied
    // /R - overwrite read-onlys
    // /Y - suppresses overwrite prompt
    const xcopyArgs = [`"${srcDir}"`, `"${targetDir}"`, '/D', '/E', '/C', '/I', '/R', '/Y'];
    proc = spawn('xcopy', xcopyArgs, {shell: true});
  } else {
    const rsyncArgs = [
      '--archive', // equivalent to -rlptgoD, i.e. --recursive, --links, --perms, --times,
                   // --group, --owner, --devices, --specials

      '--delete-before', // delete target files before syncing
      '--delete-excluded', // deletes dirs in source that are excluded with --exclude
      '--ignore-errors', // deleting gets skipped on any file reading IO error without this
      '--progress', // progress output during transfer
      '--stats', // summary stats at the end
      '--human-readable',
      '--iconv=utf-8-mac,utf-8', // use correct character encodings

      '--exclude',
      '.Trash/',
      '--exclude',
      'node_modules/',
      '--exclude',
      '.cocoapods/',
      '--exclude',
      '.nvm/',
      '--exclude',
      '.npm/',
      '--exclude',
      '.node-gyp/',
      '--exclude',
      '.rbenv/',
      '--exclude',
      'Library/Developer',
      '--exclude',
      'Firefox/Profiles',
      '--exclude',
      'Chrome/Default',

      '--exclude',
      'Caches/',
      '--exclude',
      'Cache/',
      '--exclude',
      '.cache/',
      '--exclude',
      'CacheStorage/',
      '--exclude',
      '.awcache/',

      `"${srcDir}/"`, // trailing slash important
      `"${targetDir}"`
    ];
    if (dryRun) {
      rsyncArgs.unshift('--dry-run');
    }
    proc = spawn('rsync', rsyncArgs, {shell: true});
  }

	proc.stdout.on('data', (data) => {
		process.stdout.write(data.toString());
	});

	proc.stderr.on('data', function (data) {
		process.stdout.write(data.toString());
	});
}
