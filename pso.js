function setup() {
    createCanvas (windowWidth, windowHeight, WEBGL);
    origin = createVector(10, 30, -50);
    target = createVector(500, 500, 0);

    system = new ParticlesSystem(origin, target, 100);
    system.run();
}

function draw() {
    //background(51);
    system.run();
}

class Particle {
    constructor(position) {
        this.position = position.copy();
        this.position.add(p5.Vector.random3D()).mult(5);
        this.pbest = this.position.copy();
        this.velocity = p5.Vector.random3D().mult(5);
    }
    run() {
        this.update();
        this.display();
    }
    update() {
        //this.velocity = this.nearest_neighbor.copy();
        this.position.add(this.velocity);
    }
    display() {
        translate(this.position);
        push();
        sphere(12);
        pop();
    }
}

class ParticlesSystem {
    constructor(position, target, n) {
        this.origin = position.copy();
        this.target = target.copy();
        this.particles = [];
        this.addParticle(n);
        this.gbest = [];
    }
    addParticle(n) {
        for (let i = 0; i < n; i++) {
            /**
             *  Adciona as partículas na array, e seta como 'none'
             *  a distância do objetivo e o vizinho mais próximo.
             **/
            this.particles.push([new Particle(this.origin), null, null]);
        }
        this.update();
        console.log(this.particles);
    }
    update() {
        for(let i = this.particles.length - 1; i >= 0; i--) {
            // Calculando a distância entre a partícula e o objetivo
            this.particles[i][1] = p5.Vector.dist(this.particles[i][0].position, this.target);
            
            // Atualizando o gbest
            minor = Number.POSITIVE_INFINITY;


            
            // Calculando quem é o vizinho mais próximo
            var minor = Number.POSITIVE_INFINITY;
            for (let j = this.particles.length - 1; j >= 0; j--) {
                //console.log(i, j, this.particles[i][1]);
                if(i != j) {
                    // Medindo as distancias entre todas as partículas
                    var aux = this.particles[i][0].position.dist(this.particles[j][0].position);
                    if(aux < minor) {
                        minor = aux;
                        this.particles[i][2] = this.particles[j];
                    }
                }
            }
            this.particles[i][0].velocity = this.particles[i][2][0].velocity;
        }
        this.gbest = this.bestPosition();
    }
    run() {
        for(let i = this.particles.length -1; i>= 0; i--) {
            let p = this.particles[i][0];
            console.log(p);
            p.run();
        }
        this.update();
    }
}