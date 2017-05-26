const express = require('express');
const app = express();
var http = require('http');
var players = [];
var nbRooms = 0;


app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');

var router = express.Router();
var routes = require('./routes/index');

app.use('/', routes);

var server = http.createServer(app).listen(app.get('port'),
  function(){
    console.log("Express server listening on port " + app.get('port'));
});

var io = require('socket.io').listen(server);

io.on('connection', function(socket){
	console.log("new connexion");
	socket.emit('who are you');
	socket.on('check in', function(incoming){
		if(typeof players[nbRooms]==="undefined" || players[nbRooms][1]!=0){
			players[nbRooms] = [socket.id, 0];
			socket.join(''+nbRooms+'');

		}else{
			players[nbRooms] = [players[nbRooms][0], socket.id];
			socket.join(''+nbRooms+'');
			var p1 = players[nbRooms][0];
			var p2 = players[nbRooms][1];
			io.to(''+nbRooms+'').emit('createGame',{"idRoom":nbRooms, "p1": p1});
			nbRooms++;
			
				
		}
		console.log(players);
	});
	
	socket.on('played', function(tabData){
	io.to(''+tabData['idRoom']).emit('hasPlayed', tabData);
	});
	
	socket.on('victory', function(idRoom){
		io.to(""+idRoom).emit('message', 'You loose');
	});
	
	socket.on('disconnect', function(){
		var containSO = false;
		var cpt = 0;
		while(!containSO && cpt<players.length){
			if( ( typeof players[cpt] !== 'undefined' ) && (players[cpt].indexOf(socket.id) != -1 )){
				containSO = true;
				players.splice(cpt, 1);
			}else{
				cpt++;
			}
		}
		io.to(""+cpt).emit('BrutalEnd');	
	});
});

module.exports = app;

