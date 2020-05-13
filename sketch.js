function setup() {
createCanvas (windowWidth, windowHeight);
//system = new ParticleSystem(createVector(width / 2, height / 2));
}

function draw() {
  background(51);
  //system.addParticle();
  //system.run();
}

class Particle {
  constructor(position) {
    this.acceleration = createVector(0, -0.05);
    this.velocity = createVector(random(-1, 1), random(-1, 0));
    this.position = position.copy();
    this.lifespan = 100;
  }
  run() {
    this.update();
    this.display();
  }
  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.lifespan -= 2;
  }
  display() {
    stroke(200, this.lifespan);
    strokeWeight(2);
    fill(127, this.lifespan);
    ellipse(this.position.x, this.position.y, 12, 12);
  }
  isDead() {
    return this.lifespan < 0;
  }
}

class ParticleSystem {
  constructor(position) {
    this.origin = position.copy();
    this.particles = [];
  }
  addParticle() {
    this.particles.push(new Particle(this.origin));
  }
  run() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      let p = this.particles[i];
      p.run();
      if (p.isDead()) {
        this.particles.splice(i, 1);
      }
    }
  }
}


