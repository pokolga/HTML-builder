const { stdout } = process;
const fs = require('fs');
const path = require('path');

fs.readdir(path.join(__dirname, 'secret-folder'), (err, files) => {
  if (err) throw new Error(err); 
  files.forEach((file) => {
    const currFile = path.parse(path.join(__dirname, 'secret-folder', file));
    fs.stat(path.join(__dirname, 'secret-folder', file), (err, stats) => {
      if (err) throw new Error(err);

      if (stats.isFile()) {
        let name = currFile.name[0] === '.' ? '' : currFile.name;
        let ext = (currFile.name[0] === '.' ? currFile.name : currFile.ext).slice(1);
        stdout.write(`${name} - ${ext} - ${stats.size / 1000}kb\n`);
      }
    });
  });
});