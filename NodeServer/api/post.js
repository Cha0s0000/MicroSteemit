/**
 * post module
 * @authors cha0s0000
 * @github  https://github.com/Cha0s0000/MicroSteemit
 * @webSite https://steemit.com/@cha0s0000
 */

var express = require('express');
var router = express.Router();
var steem = require('steem');

// deal with GET request
router.get('/get_discussions_by_trending', function(req, res) {
	steem.api.getDiscussionsByTrending(JSON.parse(req.query.query), function(err, result) {
	  res.send(result).end();
	  console.log("get_discussions_by_trending:"+ req.query.query);
	});
});

router.get('/get_discussions_by_created', function(req, res) {
	steem.api.getDiscussionsByCreated(JSON.parse(req.query.query), function(err, result) {
	  res.send(result).end();
	  console.log("get_discussions_by_created:"+ req.query.query);
	});
});

router.get('/get_discussions_by_hot', function(req, res) {
	steem.api.getDiscussionsByHot(JSON.parse(req.query.query), function(err, result) {
	  res.send(result).end();
	  console.log("get_discussions_by_hot:"+ req.query.query);
	});
});

router.get('/get_discussions_by_promoted', function(req, res) {
	steem.api.getDiscussionsByPromoted(JSON.parse(req.query.query), function(err, result) {
	  res.send(result).end();
	  console.log("get_discussions_by_promoted:"+ req.query.query);
	});
});

router.get('/get_active_votes', function(req, res) {
	steem.api.getActiveVotes(req.query.author,req.query.permlink, function(err, result) {
	  res.send(result).end();
	  console.log("get_active_votes");
	});
});

router.get('/get_discussions_by_author_before_date', function(req, res) {
	steem.api.getDiscussionsByAuthorBeforeDate(req.query.author,req.query.startPermlink, req.query.beforeDate,req.query.limit,function(err, result) {
	  res.send(result).end();
	  console.log("get_discussions_by_author_before_date");
	});
});

router.get('/get_discussions_by_comments', function(req, res) {
	steem.api.getDiscussionsByComments(req.query, function(err, result) {
	  res.send(result).end();
	  console.log("get_discussions_by_comments");
	});
});

router.get('/get_content', function(req, res) {
	steem.api.getContent(req.query.author,req.query.permlink, function(err, result) {
	  res.send(result).end();
	  console.log("get_content");
	});
});

router.get('/get_content_replies', function(req, res) {
	steem.api.getContentReplies(req.query.author,req.query.permlink, function(err, result) {
	  res.send(result).end();
	  console.log("get_content_replies");
	});
});

router.get('/get_discussions_by_feed', function(req, res) {
	steem.api.getDiscussionsByFeed(req.query, function(err, result) {
	  res.send(result).end();
	  console.log("get_discussions_by_feed");
	});
});

module.exports = router;