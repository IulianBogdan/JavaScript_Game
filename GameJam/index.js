var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var players=[];
var powerups=[];
app.use('/js', express.static('js'));
app.use('/img',express.static('img'));
app.use('/libraries', express.static('libraries'));
function Player(x, y, r,id,username) {
	this.id=id;
	this.x=x;
	this.y=y;
	this.r = r;
	this.bullets = [];
	this.health = 100;
	this.live = true;
	this.activePower = '';
	this.textAngle = 0;
	this.username = username;
	this.score = 0;
}
function Powerup(x, y, id) {
	this.id = id;
	this.x=x;
	this.y=y;
	this.r = 40;
	this.live = true;
	this.types = ["gun","shield","regen","speed"];
	this.typesEmoji = ["🔫","🛡️","❣️","🚴"];
	this.type = parseInt(random(0,this.types.length-1));
	this.label = "powerup";
}
function vDist(x1,y1,x2,y2){
	var a=x1-x2;
	var b=y1-y2;
	var c=Math.sqrt(a*a+b*b);
	return c;
}
var powId = 0;
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

//setInterval(heartbeat,20);
setInterval(generatePowerup,random(1000,3000));

setInterval(sendTopScore,1500);


function sendTopScore()
{
	var playersAr = [];
	for(var index in players){
			playersAr.push({score:players[index].score,username:players[index].username});
	}
	playersAr.sort(compare);
	if(playersAr.length > 10)
		playersAr.splice(8);
	io.emit('scoreboard',playersAr);
}

function compare(a,b) {
  if (a.score < b.score)
    return 1;
  if (a.score > b.score)
    return -1;
  return 0;
}
function random(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}
function generatePowerup()
{
	var powerupCount = 0;
	for(var index in powerups){
			if(powerups[index].live == true)
				powerupCount++;
	}
	if(powerupCount < 30)
	{
		powerups[powId] = new Powerup(random(-3000/2,3000/2),random(-1500/2,1500/2),powId++);
		emitPowerup();
	}
}

function emitPowerup()
{
	var powerupAr = [];
	for(var index in powerups){
		if(powerups[index].live == true)
			powerupAr.push(powerups[index]);
	}
	io.emit('powerup',powerupAr);
}

function heartbeat(socket) {
	var playersAr = [];
	
	for(var index in players){
		if(index != socket.id)
			playersAr.push(players[index]);
	}
	socket.emit('update',playersAr);
}
io.on('connection', function(socket){
	socket.join(socket.id);
	
	setInterval(function(){heartbeat(socket);},30);
	socket.on('startGame',function(data){
	var newPlayer=new Player(random(-3000/2,3000/2),random(-1500/2,1500/2),60,socket.id,data);
	players[socket.id] = newPlayer;
	emitPowerup();
  });
  
	socket.on('update',function(data){
		if(players[socket.id]!=undefined){
			if(data.live==true){
				players[socket.id].x=data.x;
				players[socket.id].y=data.y;
				players[socket.id].bullets=data.bullets;
				players[socket.id].activePower=data.activePower;
				players[socket.id].textAngle=data.textAngle;
			}
		}
	});
	
	socket.on('hitPlayer',function(data){
		if(players[data.enemy] != undefined)
		{
			if(players[data.enemy].live == true)
			{
			  if(players[data.enemy].health - 10 > 0)
			  {
				  if(players[data.enemy].activePower == "shield")
					  players[data.enemy].health -=5;
				else
					players[data.enemy].health -=10;
				  io.emit('playerHit',data.enemy);
			  }
			  else
			  {
				  players[data.enemy].live = false;
				  var data = {
					  enemy:data.enemy,
					  score:players[data.enemy].score
				  }
				  io.emit('playerDead',data);
			  }
			  players[socket.id].score += 10;
			}
		}
	  });
	
	socket.on('hitPowerup',function(data){
	if(powerups[data.id] != undefined && players[data.player] != undefined)
		{
			var type = powerups[data.id].types[powerups[data.id].type];
			players[data.player].activePower = type;
			if(type == "regen")
			{
				if(players[data.player].health + 50 > 100)
					players[data.player].health = 100;
				else
					players[data.player].health += 50;
			}
			powerups[data.id].live = false;
			emitPowerup();
			//powerups.splice(data.id);
			var dataToSend = {
				player:data.player,
				type:type
			}
			io.emit('powerupHit',dataToSend);
		}
	  });
	
	socket.on('disconnect',function(){
		delete players[socket.id];
		console.log('Player disconnected');
  });

	});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

/*
socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });*/