const fs = require('fs');
const path = require('path');

(function bundleCss(sDir, dDir) {
  const outputFile = 'bundle.css';
  const sourceDir = path.join(__dirname, sDir);
  const destinationDir = path.join(__dirname, dDir);
  let totalContent = '';

  fs.readdir(sourceDir, (err, files) => {
    if (err) {
      throw new Error(err);
    }

    files.forEach(file => {
        const filePath = path.join(sourceDir, file);
        const currFile = path.parse(filePath);
        fs.stat(filePath, (err, stats) => {
          if (err) throw new Error(err);

          if (stats.isFile() && currFile.ext === '.css') {
            fs.readFile(filePath, 'utf8', (err, data) => {
              if (err) {
                throw new Error(err);
              }
      
              totalContent += data;
      
              fs.writeFile(path.join(destinationDir, outputFile), totalContent, (err) => {
                if (err) {
                  throw new Error(err);
                }
              });
            });
          }
        });
    });
  });  
})('styles', 'project-dist');