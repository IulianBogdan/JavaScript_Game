var players = [];
var powerups = [];
var player;
var minWidth,maxWidth,minHeight,maxHeight;
var zoom = 1;
var socket;
var img;
var username= "asd";
function startGame(element)
{
	var usern = $(element).parent().parent().find('input').val();;
	$('.wow').hide();
	username = usern;
	player.live = true;
	socket.emit("startGame",usern);
}

function setup() {
	socket=io.connect("http://10.140.72.41:3000");
	minWidth=-3000;maxWidth=3000;minHeight=-1500;maxHeight=1500;
	createCanvas(windowWidth, windowHeight);
	img=loadImage('img/pic.png');
	socket.on('update',function (data) {
		players = data;
		});
	socket.on('scoreboard',function (data) {
		$('.topscores').html('');
		for(var i = 0; i<data.length;i++)
		{
			$('.topscores').append('<li><h3>' + data[i].username + ' - ' + data[i].score + '</h3></li>');
		}
	});
	socket.on('playerHit',function (data) {
	if(socket.id == data)
		if(player.activePower == "shield")
			player.health -=5;
		else
			player.health -=10;
	});
	socket.on('playerDead',function (data) {
	if(socket.id == data.enemy)
	{
		player.live = false;
		$('.dead').html('<h2>YOU LOSE</h2><br><h2>Your score was <b>' + data.score + '</b> points</h2>');
		$('.wowdead').show();
		$('.dead').show();
	}
	});
	
	socket.on('powerup',function (data) {
		powerups=data;
	});
	
	socket.on('powerupHit',function (data) {
	if(socket.id == data.player)
	{
		if(data.type == "gun")
		{
		player.activePower = "gun";
		player.speed = 5;
		}
	  else if(data.type == "shield")
	  {
		  player.activePower = "shield";
		  player.speed = 5;
	  }
	  else if(data.type == "regen")
	  {
		  if(player.health + 50 > 100)
			  player.health =100;
		  else
			  player.health += 50;
		  player.speed = 5;
		  player.activePower = '';
	  }
	  else if(data.type=="speed")
	  {
		  player.activePower = '';
		  if(player.speed < 50)
			player.speed += 5;
	  }
		  
	}
	else
	{
		if(player.activePower == data.type)
			player.activePower = '';
	}
	});
	player=new Player(random(minWidth/2,maxWidth),random(minHeight/2,maxHeight),60);
  angleMode(RADIANS);
}

function draw() {
	player.username = username;
  noFill();
  translate(width/2, height/2);
  var newzoom = 40 / player.r;
  zoom = lerp(zoom, newzoom, 0.1);
  scale(zoom);
  translate(-player.pos.x, -player.pos.y);
  
  image(img,minWidth/2-500,minHeight/2-300);
	stroke(0,255,0);
  rect(minWidth/2,minHeight/2,maxWidth,maxHeight);
  stroke(0,0,0);
	for(var i = powerups.length-1; i>=0; i--)
	{
		if(powerups[i].live == true)
		{
			fill(0,0,255);
			ellipse(powerups[i].x,powerups[i].y, powerups[i].r*2,powerups[i].r*2);
			fill(0);
			textSize(52);
			textAlign(CENTER,CENTER);
			text(powerups[i].typesEmoji[powerups[i].type],powerups[i].x,powerups[i].y);
		}
	}
	if(player.live)
	{
		player.show();
		player.update();
	}
	for(var i = 0; i<player.bullets.length;i++)
		{
			for(var c = 0; c<players.length; c++){
				hits(players[c],player.bullets[i]);
			}
		}
		for(var i= 0 ; i<powerups.length;i++)
		{
			
			hits(player,powerups[i]);
		}
  var bulletAr = [];
  for (var i = 0; i<player.bullets.length; i++)
  { 
	  bulletAr.push({x:player.bullets[i].pos.x,y:player.bullets[i].pos.y,label:player.bullets[i].label,r:player.bullets[i].r,live:player.bullets[i].live});

  }
  
	var data={
		x: player.pos.x,
		y:player.pos.y,
		bullets:bulletAr,
		live: player.live,
		activePower:player.activePower,
		textAngle:player.textAngle
	};
	socket.emit('update',data);
	for(var i = players.length-1; i>=0; i--)
	{
		if(players[i].live == true)
		{
			for(var c = players[i].bullets.length-1; c>=0; c--)
			{
				if(players[i].bullets[c].live == true){
				fill(255,0,0);
				ellipse(players[i].bullets[c].x,players[i].bullets[c].y, 12*2, 12*2);
				}
			}
			strokeWeight(10);
			if(players[i].activePower == "gun")
				stroke(255,0,0);
			else if(players[i].activePower == "shield")
				stroke(0,0,255);
			var greenAmnt = map(players[i].health,0,100,0,255);
		
			var redAmnt = map(players[i].health,0,100,255,0);
			fill(redAmnt,greenAmnt,0);
			ellipse(players[i].x, players[i].y, 60*2, 60*2);
			noStroke();
			/*fill(0,200,0);
			rect(players[i].x-60, players[i].y+60, map(players[i].health,0,100,0,60*2), 25);
			fill(255,0,0);
			rect(players[i].x-60 + map(players[i].health,0,100,0,60*2), players[i].y+60, map(players[i].health,100,0,0,60*2), 25);*/
			fill(0);
			textAlign(CENTER,CENTER);
			push();
			translate(players[i].x,players[i].y);
			textSize(map(players[i].username.length,1,20,40,10));		
			textStyle(BOLD);
			stroke(255);
			text(players[i].username,0,90);
			noStroke();
			textStyle(NORMAL);
			strokeWeight(0);
			textSize(100);
			rotate(players[i].textAngle);
			text('>',0,0);
			pop();
		}
	}
	
	
}


function hits(_player, element)
{
  if(element.live == true && _player.live == true)
  {
	  if(element.pos != undefined)
		var d = p5.Vector.dist(createVector(_player.x,_player.y),element.pos);
	else
		var d = p5.Vector.dist(createVector(_player.pos.x,_player.pos.y),createVector(element.x,element.y));
	  if(d< _player.r + element.r)
	  {
		  element.live = false;
		  
			if(element.label == "bullet")
				hit(_player);
			else if(element.label == "powerup")
			{
				element.live = false;
				var data = {
				id: element.id,
				player: socket.id
				}
				socket.emit('hitPowerup',data);
			}
	  }
  }
  return false;
}

function hit(_player)
{
	var data = {
		enemy:_player.id
	}
	socket.emit('hitPlayer',data);

}
function mouseClicked()
{
	
	player.shoot();
}




	/*for(var i = players.length-1; i>=0; i--)
	{
	for(var c = players.length-1; c>=0; c--)
	{
		for(var i = players[c].bullets.length-1; i>=0; i--)
		{
			for(var x = players.length-1; x>=0; x--)
			{
				if(x != c)
					players[x].hits(players[c].bullets[i]);
			}
		}
		for(var i = powerups.length-1; i>=0; i--)
		{
			if(players[c].hits(powerups[i]))
			{
				for(var x = players.length-1; x>=0; x--)
				{
					if(x != c && players[x].activePower == powerups[i].types[powerups[i].type])
						players[x].activePower = "";
				}
			}
		}
	}
	}*/