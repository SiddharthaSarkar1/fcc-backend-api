require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require('dotenv').config();
const crypto = require('crypto');
const validUrl = require('valid-url');
const dns = require('dns');
const urlparser = require('url')


const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

//MongoDB connection

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//Schema

const urlSchema = new mongoose.Schema({
  longUrl: String,
  shortCode: String,
});

const Url = mongoose.model('Url', urlSchema);

const generateShortCode = (longUrl) => {
  const hash = crypto.createHash('md5').update(longUrl).digest('hex');

  const shortCode = hash.substring(0, 8);

  return shortCode;
}


app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/shorturl', async (req, res) => {
  try {
    const { url } = req.body;
    const dnslookup = dns.lookup(urlparser.parse(url).hostname, async (err, address) => {
      if (!address) {
        res.json({ error: "Invalid URL" })
      } else {
        // Validate URL format (regex)
        const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
        if (!urlRegex.test(url)) {
          return res.status(400).json({ error: 'invalid url' });
        }

        const shortCode = generateShortCode(url);
        const newUrl = new Url({ longUrl: url, shortCode });
        await newUrl.save();

        const shortUrl = `https://3000-freecodecam-boilerplate-6kpsv5y07qt.ws-us108.gitpod.io/api/shorturl/${shortCode}`;
        res.json({ original_url: url, short_url: shortCode });
      }
    })
  } catch (error) {
    console.log(error);
  }
});

//URL Redirection

app.get('/api/shorturl/:shortCode', async (req, res) => {
  try {
    const { shortCode } = req.params;

    const url = await Url.findOne({ shortCode });

    if (!url) {
      return res.status(400).json({ error: 'invalid url' });
    }

    //Redirect user 
    res.redirect(url.longUrl);

  } catch (error) {
    console.log(error);
  }
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
