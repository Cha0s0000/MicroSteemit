/**
 * general module
 * @authors cha0s0000
 * @github  https://github.com/Cha0s0000/MicroSteemit
 * @webSite https://steemit.com/@cha0s0000
 */

var express = require('express');
var router = express.Router();
var steem = require('steem');

// deal with GET request
router.get('/get_state', function(req, res) {
	steem.api.getState(req.query.path, function(err, result) {
	  res.send(result).end();
	  console.log("get_state");
	});
});

router.get('/get_dynamic_global_properties', function(req, res) {
	steem.api.getDynamicGlobalProperties(function(err, result) {
	  res.send(result).end();
	  console.log("get_dynamic_global_properties");
	});
});
module.exports = router;