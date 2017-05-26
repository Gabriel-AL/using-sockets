const express = require('express');
//var Session = require('express-session');
//var SessionStore = require('session-file-store')(Session);
const app = express();
var http = require('http');
var players = [];

/*var session = Session({
	store: new SessionStore({path: __dirname+'/tmp/sessions'}),
	secret:'$2y$10$LJ/d/Wf4/NPbR/jTXxkTmuy3ZXYLrNjnZZ1N0TbkY8hrIQgqoFFmq',
	resave: true,
	saveUninitialized: true	
});*/

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');

var router = express.Router();
var routes = require('./routes/index');

app.use('/', routes);
//app.use(session);


var server = http.createServer(app).listen(app.get('port'),
  function(){
    console.log("Express server listening on port " + app.get('port'));
});

var io = require('socket.io').listen(server);
//var ios = require('socket.io-express-session');

//io.use(ios(session));
io.on('connection', function(socket){
	/*if(players.indexOf(0)==-1){
		players[socket.handshake.session.id] = 0;	
	}else{
		players[players.indexOf(0)]=socket.handshake.session.id;
		
		
	}*/
	
	socket.emit('who are you');
	socket.on('check in', function(incoming){
		console.log(socket.id);
		players[socket.id] = 0;
	});
	
	socket.on('victory', function(message){
		socket.broadcast.emit('message', message);
	});
});

module.exports = app;

