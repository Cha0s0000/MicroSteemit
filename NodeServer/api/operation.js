/**
 * operation module
 * @authors cha0s0000
 * @github  https://github.com/Cha0s0000/MicroSteemit
 * @webSite https://steemit.com/@cha0s0000
 */

var express = require('express');
var router = express.Router();
var steem = require('steem');
const crypto = require('crypto')

var bodyParser = require('body-parser');

// parse the post data
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

// length of key is 16 of 128 bit. JUST for test the Decrypt
const key = '3454345434543454'
// Hexadecimal number as the secret key offset. JUST for test the Decrypt
const iv = '6666666666666666'

// deal with GET request
router.get('/wif_is_valid', function(req, res) {
	var name = req.query.account;
	var privWif = aesDecrypt(req.query.key,key,iv);
	steem.api.getAccounts([name], function(err, result) {
		var pubWif;
		try{
		 	pubWif= result[0].posting.key_auths[0][0];
		}
		catch(e){
			pubWif = "none";
		}
		var isvalid;
		try{ 
			isvalid = steem.auth.wifIsValid(privWif, pubWif,'posting'); 
		}
		catch(e){ 
			isvalid = 'false'; 
		}
		if(isvalid == true){
			console.log(name+' Welcome.');
			res.json({message:'success'});
		}else{
			console.log('Wrong! Check your Private key.');
			res.json({message:'fail'});
		}
	});
});

router.get('/vote',function(req,res){
	var voter= req.query.voter;
	var author= req.query.author;
	var permlink= req.query.permlink;
	var weight= +(req.query.weight);
	var wif = aesDecrypt(req.query.key,key,iv);
	steem.broadcast.vote(wif, voter, author, permlink, weight, function(err, result) {
	  if(!err){
	  	res.json({message:'success'});
	  	console.log('vote success');
	  }else{
	  	res.json({message:'fail'});
	  	console.log('vote fail');
	  }
	});



});

router.post('/comment',function(req,res){
	console.log("submit a comment");
	console.log(req.body);
	var account= req.body.account;
	var wif = aesDecrypt(req.body.key,key,iv);
	var author= req.body.author;
	var permlink= req.body.permlink;
	var content= req.body.content;
	var jsonMetadata ={};
	var comment_permlink = new Date().toISOString().replace(/[^a-zA-Z0-9]+/g, '').toLowerCase();
	steem.broadcast.comment(wif, author, permlink, account, comment_permlink , '', content, jsonMetadata, function(err, result) {
        if(!err){
		  	res.json({message:'success'});
		  	console.log('comment success');
		  }else{
		  	res.json({message:'fail'});
		  	console.log('comment fail');
		  }
    });
});


const aesDecrypt = function(data, secretKey, iv) {
    const cipherEncoding = 'hex'
    const clearEncoding = 'utf8'
    const cipher = crypto.createDecipheriv('aes-128-cbc',secretKey, iv)
    return  cipher.update(data,cipherEncoding,clearEncoding) + cipher.final(clearEncoding)
 }

module.exports = router;