require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const smolUrls = [];
const urlMatcher = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', function (req, res) {
  if (!urlMatcher.test(req.body.url)) {
    res.json({'error': 'invalid url'})
  } else {
    let shortUrl = smolUrls.indexOf(`${req.body.url}`);
    if(shortUrl === -1) {
      shortUrl = smolUrls.length;
      smolUrls.push(`${req.body.url}`)
    }
    res.json({ original_url : req.body.url, short_url : shortUrl});
  }
});

app.get('/api/shorturl/:short_url', function(req, res) {
  res.writeHead(307,
    {Location: `${smolUrls[req.params.short_url]}`}
  );
  res.end();
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
