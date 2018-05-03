/*function Powerup(x, y,id) {
	this.id = id;
  this.pos = createVector(x, y);
  this.r = 60;
  this.live = true;
  this.types = ["gun","shield"];
  this.typesEmoji = ["🔫","🛡️"];
  this.type = parseInt(random(0,this.types.length));
  this.label = "powerup";

  this.hit = function(player) {
	  if(this.types[this.type] == "gun")
	  player.activePower = "gun";
	  else if(this.types[this.type] == "shield")
		  player.activePower = "shield";
  }
  this.show = function() {
    fill(0,0,255);
    ellipse(this.pos.x,this.pos.y, this.r*2, this.r*2);
	fill(0);
	textSize(52);
	textAlign(CENTER,CENTER);
	text(this.typesEmoji[this.type],this.pos.x,this.pos.y);
  }
}*/