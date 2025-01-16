const { stdout, stdin, stderr } = process;
const fs = require('fs');
const path = require('path');

stdout.write('Enter your message:\n');
fs.open(path.join(__dirname, 'text.txt'), 'a', (err) => {
  if (err) throw new Error(err);
});

stdin.on('data', data => {
  let dataStr = data.toString();
  if (dataStr.replace(/\s+$/, '') === 'exit') process.exit();
  fs.appendFile(path.join(__dirname, 'text.txt'), data, (err) => {
    if (err) throw new Error(err);
  });
});

process.on('SIGINT', () => { process.exit(); });

process.on('exit', (code) => {
  if (code === 0) {
    stdout.write('Bye-bye! Let`s come again!\n');
  } else {
    stderr.write(`Something is wrong. Error code: ${code}\n`);
  }
});