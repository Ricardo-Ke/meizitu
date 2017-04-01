var fs = require('fs')
  , p = require('path');

readFiles('./images/');

function readFileList(path) {
  let files = fs.readdirSync(path);
  files.forEach(file => {
    var stats = fs.statSync(p.join(path, file));
    if (stats.isDirectory()) {
      readFileList(p.join(path, file));
    }else {
      console.log(p.join(path, file));
    }
  })
}

function readFiles(path) {
  let files = fs.readdirSync(path);
  files.forEach(file => {
    let stats = fs.statSync(p.join(path, file));
    if (stats.isDirectory()) {
      readFiles(p.join(path, file));
    }else {
      console.log(p.join(path, file));
    }
  })
}
