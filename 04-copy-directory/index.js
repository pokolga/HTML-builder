const fs = require('fs');
const path = require('path');

(function copyDir(fromDir = 'files', dirCopy = 'files-copy') {

  const fullNameSourceDir = path.join(__dirname, fromDir);
  const fullNameDestinationDir = path.join(__dirname, dirCopy);

  fs.stat(fullNameDestinationDir, function (err, stats) {
    if (err || stats.isFile()) {
      fs.mkdir(fullNameDestinationDir, err => {
        if (err) throw new Error(err); 
        delAll(fullNameSourceDir, fullNameDestinationDir);
      });
    } else {
      delAll(fullNameSourceDir, fullNameDestinationDir);
    }
  });

})();

function delAll(source, destination) {
  fs.readdir(destination, (err, files) => {
    if (err) throw new Error(err);
    if (files.length === 0) {
      copyMyFiles(source, destination);
      return;
    }
    for (let file of files) {
      fs.unlink(path.join(destination, file), err => {
        if (err) throw new Error(err); 
        copyMyFiles(source, destination);
      });
    }
  });
}

function copyMyFiles(fromDir, toDir) {
  fs.readdir(fromDir, (err, files) => {
    if (err) throw new Error(err);
    for (let file of files) {
      fs.copyFile(path.join(fromDir, file), path.join(toDir, file), (err) => {
        if (err) throw new Error(err);
      });
    }
  });
}
