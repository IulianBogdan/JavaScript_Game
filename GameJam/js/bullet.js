function Bullet(x, y,vel) {
	this.x = x;
	this.y = y;
  this.pos = createVector(x, y);
  this.r = 12;
  this.vel = vel;
  this.speed=10;
  this.mousePos = createVector(mouseX-width/2,mouseY-height/2).add(this.vel);
  this.currentTime = new Date().getTime();
  this.timeToLive = 1200;
  this.live = true;
  this.label = "bullet";
  
  this.update = function() {
	if(new Date().getTime() > this.currentTime + this.timeToLive && this.live == true)
		this.live = false;
	else if(this.live)
	{
		this.mousePos.setMag(this.speed);
		this.pos.add(this.mousePos); 
		this.x = this.pos.x;
		this.y = this.pos.y;		
	}
  }

  this.show = function() {
    fill(255,0,0);
    ellipse(this.pos.x,this.pos.y, this.r*2, this.r*2);
  }
}