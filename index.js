var path = require('path')
  , fs = require('fs')
  , superagent = require('superagent')
  , cheerio = require('cheerio')
  , http = require('http')
  , process = require('process');

function Meizitu(options) {
  this.downloadedPages = 0;
  this.pageId = '';
  this.allImages = [];

  this.init.call(this, options);
  return this;
}

Meizitu.prototype = {
  constructor: Meizitu,
  init(options) {
    this.baseUrl = options.baseUrl;
    this.dir = options.dir || path.join(__dirname, '/images');
    this.targetNum = options.num || process.argv[2] || 20;
    this.selector = options.selector;
  },
  start() {
    let currFiles = fs.readdirSync(__dirname);
    if (currFiles.indexOf('images') === -1) {
      fs.mkdirSync('./images');
    }
    this.allImages = fs.readdirSync('./images/');
    this.getPage();
  },
  getPage() {
    let self = this;

    superagent
      .get(self.baseUrl)
      .end((err, res) => {
        if (err) throw err;

        let imgUrls = []
          , $ = cheerio.load(res.text);

        self.pageId = $('.comments .cp-pagenavi > span').eq(0).text().split('').slice(1, -1).join('');

        $(this.selector).each((idx, ele) => {
          imgUrls.push(ele.attribs.src);
        })
        this.downloadImages(imgUrls, 0);
      })
  },
  downloadImages(resources, index) {
    let self = this
      , src = resources[index];

    if (index >= resources.length - 1) {
      self.parseBaseUrl();
      self.getPage();
      return;
    }
    
    if (self.downloadedPages >= self.targetNum) {
      console.log('Complete Downloading');
      return;
    }
    
    if (!src.match(/\w+.jpg/)) {
      self.downloadedPages++;
      self.downloadImages(resources, ++index);
      return;
    }
    
    let filename = src.match(/\w+.jpg/)[0];
    
    if (self.allImages.indexOf(filename) > -1) {
      console.log('Repeated Image: ' + (self.downloadedPages + 1));
      self.downloadedPages++;
      self.downloadImages(resources, ++index);
      return;
    }
    self.allImages.push(filename);

    let writeStream = fs.createWriteStream(path.join(self.dir, filename));

    http.get('http:' + src, res => {
      res.pipe(writeStream);
    })

    writeStream.on('finish', () => {
      console.log('Downloaded images: ' + ++self.downloadedPages + ', filename: ' + filename);
      self.downloadImages(resources, ++index);
    })
  },
  parseBaseUrl() {
    let self = this;
    self.pageId = parseInt(self.pageId) - 1;
    self.baseUrl = `http://jandan.net/ooxx/page-${self.pageId}#comments`;
  }
}

var meizi = new Meizitu({
  baseUrl: 'http://jandan.net/ooxx/',
  selector: 'ol.commentlist li .text > p img'
})

meizi.start();
