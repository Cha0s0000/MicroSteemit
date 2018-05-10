/**
 * route distribution module
 * @authors cha0s0000
 * @github  https://github.com/Cha0s0000/MicroSteemit
 * @webSite https://steemit.com/@cha0s0000
 */

module.exports = function(app){
	// distribute to post module
	var post = require('../api/post');
	app.use('/post',post);
	// app.use('/get_discussions_by_trending',post);
	// app.use('/get_discussions_by_created',post);
	// app.use('/get_discussions_by_hot',post);
	// app.use('/get_discussions_by_promoted',post);
	// app.use('/get_active_votes',post);
	// app.use('/get_discussions_by_author_before_date',post);
	// app.use('/get_discussions_by_comments',post);
	// app.use('/get_content',post);
	// app.use('/get_content_replies',post);
	// app.use('/get_discussions_by_feed',post);

	// // distribute to tag module
	var tag = require('../api/tag');
	app.use('/tag',tag);
	// app.use('/get_trending_tags',tag);

	// // distribute to account module
	var account = require('../api/account');
	app.use('/account',account);
	// app.use('/get_followers',account);
	// app.use('/get_following',account);
	// app.use('/get_follow_count',account);
	// app.use('/get_account_votes',account);

	// // distribute to general module
	var general = require('../api/general');
	app.use('/general',general);
	// app.use('/get_state',general);
	// app.use('/get_dynamic_global_properties',general);
	
	var operation = require('../api/operation');
	app.use('/operation',operation);



	var transmit = require('../api/transmit');
	app.use('/transmit',transmit);

	// TO-DEAL api 
	// https://api.steemjs.com/get_state?path=/@' + author + '/recent-replies 
	// https://uploadbeta.com/api/steemit/transfer-history/?id=' + account
	// https://min-api.cryptocompare.com/data/histo' + that.data.currentTimeIndex+'?fsym=STEEM&tsym=SBD&limit=20',
	// https://steemit.com/@' + author + '.json

};