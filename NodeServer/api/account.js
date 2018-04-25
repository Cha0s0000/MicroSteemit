/**
 * account module
 * @authors cha0s0000
 * @github  https://github.com/Cha0s0000/MicroSteemit
 * @webSite https://steemit.com/@cha0s0000
 */

var express = require('express');
var router = express.Router();
var steem = require('steem');

// deal with GET request
router.get('/get_followers', function(req, res) {
	steem.api.getFollowers(req.query.following,req.query.startFollower,req.query.followType,req.query.limit, function(err, result) {
	  res.send(result).end();
	  console.log("get_followers");
	});
});

router.get('/get_following', function(req, res) {
	steem.api.getFollowing(req.query.follower,req.query.startFollowing,req.query.followType,req.query.limit, function(err, result) {
	  res.send(result).end();
	  console.log("get_following");
	});
});

router.get('/get_follow_count', function(req, res) {
	steem.api.getFollowCount(req.query.account, function(err, result) {
	  res.send(result).end();
	  console.log("get_follow_count");
	});
});

router.get('/get_account_votes', function(req, res) {
	steem.api.getAccountVotes(req.query.voter, function(err, result) {
	  res.send(result).end();
	  console.log("get_account_votes");
	});
});
module.exports = router;