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


const aesDecrypt = function(data, secretKey, iv) {
    const cipherEncoding = 'hex'
    const clearEncoding = 'utf8'
    const cipher = crypto.createDecipheriv('aes-128-cbc',secretKey, iv)
    return  cipher.update(data,cipherEncoding,clearEncoding) + cipher.final(clearEncoding)
 }

module.exports = router;