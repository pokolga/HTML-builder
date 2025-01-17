const fs = require('fs');
const path = require('path');

function bundleCss(sDir = 'styles', dDir = 'project-dist') {
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
                console.log('Содержимое записано в', outputFile);
              });
            });
          }
        });
    });
  });  
}
bundleCss();
/*

(function bundleCss(sourceDir = 'styles', destinationDir = 'project-dist') {
  const fullNameSourceDir = path.join(__dirname, sourceDir);
  
  const fullNameDestinationFile = path.join(__dirname, destinationDir, 'bundle.css');
//  console.log(fullNameDestinationFile);
  fs.open(fullNameDestinationFile, 'a', (err) => {
    if (err) throw new Error(err);
    const dataArr = [];
    fs.readdir(fullNameSourceDir, (err, files) => {
      if (err) throw new Error(err);

      for (const file of files) {
        const currFile = path.parse(path.join(fullNameSourceDir, file));
        fs.stat(path.join(fullNameSourceDir, file), (err, stats) => {
          if (err) throw new Error(err);
          if (stats.isFile() && currFile.ext === '.css') {
            let data = '';
            const stream = fs.createReadStream(path.join(fullNameSourceDir, file), 'utf-8');
            
            stream.on('data', chunk => data += chunk);
            console.log(data);
            stream.on('end', () => {
              dataArr.push(data);
              fs.writeFile(fullNameDestinationFile, dataArr.reduce((acc, elem) => acc + '\n' + elem, ''), (err) => {
                if (err) throw new Error(err);
              });
            });
            stream.on('error', error => console.log('Error', error.message));
          }
        });
      }
    });
  });
})();*/