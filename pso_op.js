function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    origin = createVector(10, 30, -50);
    target = createVector(0, 0, 0);

    system = new ParticlesSystem(origin, target, 10);
    system.run();
}

function draw() {
    //background(51);
    system.run();
    //clear();
}

class Particle {
    constructor(position) {
        this.position = position.copy().add(random(), random(), random());
        this.pbest = this.position.copy();
        this.velocity = p5.Vector.random3D();
    }
    run() {
        this.update();
        this.display();
    }
    update() {
        this.position.add(this.velocity);
    }
    display() {
        push();
        translate(this.position);
        sphere(12);
        pop();
    }
}

class ParticlesSystem {
    constructor(position, target, n) {
        this.origin = position.copy();
        this.target = target.copy();
        this.particles = [];
        this.gbest = [];

        this.addParticle(n);

        this.update();
    }
    updateTargetParticleDistance() {
        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i][1] = this.particles[i][0].position.dist(this.target);
        }
    }
    updateNearestNeigbourAndVelocity() {
        for (let i = 0; i < this.particles.length; i++) {

            // Criando cópia da particles
            var refParticles = this.particles.slice();

            // Calculando quem é o vizinho mais próximo
            var minor = Number.POSITIVE_INFINITY;
            for (let j = refParticles.length - 1; j >= 0; j--) {
                if (i != j) {
                    // Medindo as distancias entre as partículas
                    var dist = this.particles[i][0].position.dist(refParticles[j][0].position);
                    if (dist < minor) {
                        minor = dist;
                        this.particles[i][2] = refParticles[j];
                        console.log(`Vizinho mais próximo atualizado!`);
                        console.log(refParticles[j][0]);
                    }
                }
                console.log(i, j, this.particles[i][1]);
            }

            // Depois de atualizar o vizinho mais próximo, atualiza-se a velocidade
            this.particles[i][0].velocity = this.particles[i][2][0].velocity;
        }
    }
    updateBestPosition() {
        for (let i = 0; i < this.particles.length; i++) {
            if (this.particles[i][0].pbest.x >= this.gbest.x) {
                this.particles[i][0].velocity.add(1, 1, 1);
            } else {
                this.particles[i][0].velocity.sub(1, 1, 1);
            }
        }
    }
    updateGbest() {
        var minor = Number.POSITIVE_INFINITY;
        for (let i = 0; i < this.particles.length; i++) {
            var dist = this.particles[i][1];
            if (dist < minor) {
                minor = dist;
                this.gbest = [this.particles[i][0].position, minor];
                console.log(
                    `Atualização do gbest
                    (
                        Distância: ${this.gbest[1]} | 
                        Vetor: ${this.gbest[0]})`);
            }
        }
    }
    averageDist() {
        var sum = 0;
        for (let i = 0; i < this.particles.length; i++) {
            sum += this.particles[i][1];
        }
        return sum / this.particles.length;
    }
    enviromentAjustments() {}
    addParticle(n) {
        for (let i = 0; i < n; i++) {
            /**
             *  Adciona as partículas na array, e seta como 'none'
             *  a distância do objetivo e o vizinho mais próximo.
             **/
            this.particles.push([new Particle(this.origin), null, null]);
        }
        console.log(`Lista de partículas adicionadas: ${this.particles}`);
    }
    run() {
        for (let i = 0; i < this.particles.length; i++) {
            var p = this.particles[i][0];
            p.run();
        }
        this.update();
    }
    update() {
        this.updateTargetParticleDistance();
        this.updateNearestNeigbourAndVelocity();
        this.updateBestPosition();
        this.updateGbest();
        console.log(`A média da distância é ${this.averageDist()}`);
    }
}