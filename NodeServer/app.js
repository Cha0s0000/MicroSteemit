/**
 * app.js
 * @authors cha0s0000
 * @github  https://github.com/Cha0s0000/MicroSteemit
 * @webSite https://steemit.com/@cha0s0000
 */

var app = require('express')();

// set request port
app.set('port',(process.env.PORT || 3000));

// set file /routes/index as the route controller
// file routes/index take charge of distributing the route
var routes = require('./routes/index');
routes(app);

// monitor the port when start the server
app.listen(app.get('port'),function(){
	console.log('Server listening on port:',app.get('port'));
});
