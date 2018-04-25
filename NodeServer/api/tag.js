/**
 * tag module
 * @authors cha0s0000
 * @github  https://github.com/Cha0s0000/MicroSteemit
 * @webSite https://steemit.com/@cha0s0000
 */

var express = require('express');
var router = express.Router();
var steem = require('steem');

// deal with GET request
router.get('/get_trending_tags', function(req, res) {
	steem.api.getTrendingTags(req.query.afterTag,req.query.limit, function(err, result) {
	  res.send(result).end();
	  console.log("get_trending_tags");
	});
});

module.exports = router;