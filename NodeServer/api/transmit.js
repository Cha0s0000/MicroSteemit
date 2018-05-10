/**
 * redirect module
 * @authors cha0s0000
 * @github  https://github.com/Cha0s0000/MicroSteemit
 * @webSite https://steemit.com/@cha0s0000
 */

var express = require('express');
var router = express.Router();
var steem = require('steem');
const http = require('http');
const https = require('https');
const request = require('request')

// deal with GET request
router.use(function(req, res, next) {
    res.set({
        'Access-Control-Allow-Origin': '*'
    })
    next();
})

const readAPI = uri => {
  let promise = new Promise((resolve, reject) => {
    let client = http;
    if (/^https:\/\//.test(uri)) {
      client = https;
    } else if (!/^http:\/\//.test(uri)){
      reject('proxy not supported')
      return promise;
    }
    console.log('in readAPI');
    request({
        url: uri,
        gzip: true
      }, (err, response, data) => {
        if (!err && response.statusCode === 200) {
          resolve(data);
        } else {
          reject('could not get response');
      }
    });
  });
  return promise;
}

const redirAPI = (req, res) => {
  let uri = req.query.uri;
  console.log(uri);
  readAPI(uri)
    .then(data => {
      console.log(data);
      res.send(data).end();
    })
    .catch(err => err);
}

router.get('/redir', redirAPI);

module.exports = router;