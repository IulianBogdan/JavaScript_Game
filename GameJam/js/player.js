function Player(x, y, r) {
  this.pos = createVector(x, y);
  this.r = r;
  this.vel = createVector(0,0);
  this.speed=5;
  this.bullets = [];
  this.health = 100;
  this.live = false;
  this.activePower = '';
  this.textAngle = 0;
  this.username = '';
  
  this.update = function() {
    var newvel = createVector(0,0);
	if(keyIsDown(87)){
		newvel.y=-this.speed;
	}
	else if(keyIsDown(83)){
		newvel.y=this.speed;
	}
	if(keyIsDown(65)){
		newvel.x=-this.speed;
	}
	else if(keyIsDown(68)){
		newvel.x=this.speed;
	}
    this.vel.lerp(newvel, 0.2);
    this.pos.add(this.vel);  
	if(this.pos.x + this.r >1500){
		this.pos.x=1500-this.r;
	}
	else if(this.pos.x - this.r <-1500){
		this.pos.x=-1500+this.r;
	}
	if(this.pos.y+ this.r >750){
		this.pos.y=750-this.r;
	}
	else if(this.pos.y - this.r <-750){
		this.pos.y=-750+this.r;
	}
	for(var i = this.bullets.length-1; i>=0; i--)
	{
		this.bullets[i].update();
	if(this.bullets[i].live == false)
		this.bullets.splice(i,1);
	}
  }

  this.eats = function(other) {
    var d = p5.Vector.dist(this.pos, other.pos);
    if (d < this.r + other.r) {
      var sum = PI * this.r * this.r + PI * other.r * other.r;
      this.r = sqrt(sum / PI);
      //this.r += other.r;
      return true;
    } else {
      return false;
    }
  }
  
  
  this.shoot = function(){	
	if(this.activePower == "gun")
	{
		var angle = atan2(mouseY-height/2,mouseX-width/2);
	  var bullet = new Bullet(this.pos.x,this.pos.y,this.vel);
	  this.bullets.push(bullet);
	}
  }

  this.show = function() {
		  for(var i = this.bullets.length-1; i>=0; i--)
		{
			this.bullets[i].show();
		}
		fill(255);
		strokeWeight(10);
		if(this.activePower == "gun")
			stroke(255,0,0);
		else if(this.activePower == "shield")
			stroke(0,0,255);
		var greenAmnt = map(this.health,0,100,0,255);
		
		var redAmnt = map(this.health,0,100,255,0);
		fill(redAmnt,greenAmnt,0);
		ellipse(this.pos.x, this.pos.y, this.r*2, this.r*2);
		noStroke();
		/*fill(0,200,0);
		rect(this.pos.x-this.r, this.pos.y+this.r, map(this.health,0,100,0,this.r*2), 25);
		fill(255,0,0);
		rect(this.pos.x-this.r + map(this.health,0,100,0,this.r*2), this.pos.y+this.r, map(this.health,100,0,0,this.r*2), 25);*/
		fill(0);
		textAlign(CENTER,CENTER);
		this.textAngle = atan2(mouseY-height/2,mouseX-width/2);
		push();
		translate(this.pos.x,this.pos.y);
		textSize(map(this.username.length,1,20,40,10));		
		textStyle(BOLD);
		stroke(255);
		text(this.username,0,90);
		noStroke();
		textStyle(NORMAL);
		strokeWeight(0);
		textSize(100);
		rotate(this.textAngle);
		text('>',0,0);
		pop();
  }
}