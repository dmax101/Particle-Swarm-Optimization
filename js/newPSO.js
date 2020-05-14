function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    sizeParticle = 5;
    velRandom = 5;
    totParticles = 100;
    position = createVector(0, 0, 0);
    target = createVector(0, 0, 0);
    iterations = 0;
    
    try {
        system = new ParticlesSystem(position, target, totParticles);
        system.run();
    } catch (error) {
        console.log(`> [setup] Erro: ${error}`);
    }

    console.log("> [setup] configuration done!");
    console.log(`> [setup] initial setup: size particle: ${sizeParticle} | velRandom: -${velRandom} and ${velRandom}`);
}
function draw() {
    try {
        background(51);
        countBox();
        targetRef();

        
        if (iterations <= 10000) {
            system.run();
            console.log(`> [runner] interation #${iterations}`);
            iterations++;
        } else {
            console.log("> [runner] interation limit reached! Restarting!");
            system = new ParticlesSystem(position, target, totParticles);
            system.run();
        }
        orbitControl();
        normalMaterial();
    } catch (error) {
        console.log(`> [runner] Erro: ${error}`);
    }

}
function countBox() {
    push();
    translate(width / 2 - 100, -height / 2 + 50, 0); //moves our drawing origin to the top left corner
    rotateX(frameCount * 0.01);
    rotateY(frameCount * 0.01);
    rotateZ(frameCount * 0.01);
    box(10, 10, 10, 1, 1);
    pop();
}
function targetRef() {
    push();
    translate(target); //moves our drawing origin to the top left corner
    rotateX(frameCount * 0.01);
    rotateY(frameCount * 0.01);
    rotateZ(frameCount * 0.01);
    torus(10, 5);
    pop();
}
class Particle {
    constructor(position) {
        //this.position = position.copy().add(createVector(random(-windowWidth / 2, windowWidth / 2), random(-windowHeight / 2, windowHeight / 2), 0));
        this.position = createVector(random(-windowWidth / 2, windowWidth / 2), random(-windowHeight / 2, windowHeight / 2), random(-windowWidth / 2, windowWidth / 2));
        this.velocity = createVector(random(-velRandom, velRandom), random(-velRandom, velRandom), random(-velRandom, velRandom));
        //this.pbest = this.position.copy();
        console.log("> [particle] particle created!");
    }
    run() {
        this.update();
        this.display();
        //console.log("> [particle] running particle!");
    }
    update() {
        this.position.add(this.velocity);
        //console.log("> [particle] updating position based in velocity!");
    }
    display() {
        if (!(
                (this.position.x <= -windowWidth) ||
                (this.position.x >= windowWidth) ||
                (this.position.y <= -windowWidth) ||
                (this.position.y >= windowWidth) ||
                (this.position.z <= -windowWidth * 2) ||
                (this.position.z >= windowWidth * 2)
            )) {
            push();
            translate(this.position);
            rotateX(frameCount * this.velocity.x);
            rotateY(frameCount * this.velocity.y);
            rotateZ(frameCount * this.velocity.z);
            sphere(sizeParticle);
            pop();
            console.log("> [particle] rendering particle!");
        }
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

        console.log("> [particles] system particle created!");
    }
    run() {
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i][0];
            p.run();
        }
        this.update();
    }
    update() {
        this.updateGbest();
        this.updatePBest();
        this.updateVelocity();
        this.averageDist();
        this.updateSystem();
    }
    updateGbest() {
        console.log("> [particle] updating gbest...");
        
        let minor = Number.POSITIVE_INFINITY;
        for (let i = 0; i < this.particles.length; i++) {
            let dist = this.particles[i][1];
            if (dist < minor) {
                minor = dist;
                // [distancia, posição]
                this.gbest = [minor, this.particles[i][0].position.copy()];

                console.log(`> [particles] new gbest updated: particle #${i} (${this.gbest[1].x}, ${this.gbest[1].y}, ${this.gbest[1].y}) | distance: ${this.gbest[0]}`);
            }
        }
    }
    updatePBest() {
        console.log("> [particle] updating pbest...");

        for (let i = 0; i < this.particles.length; i++) {
            let pbest = this.particles[i][2];
            let particle = this.particles[i];
            if(particle[1] < pbest[0]) {
                pbest[0] = particle[1];
                pbest[1] = particle[0].position.copy();

                console.log(`> [particles] new pbest updated: particle #${i} (${pbest[1].x}, ${pbest[1].y}, ${pbest[1].y}) | distance: ${pbest[0]}`);
            }
        }
    }
    updateVelocity() {
        for (let i = 0; i < this.particles.length; i++) {
            let pbest = this.particles[i][2];
            let gbest = this.gbest;
            let particle = this.particles[i][0];
            
            //let adjust = random(-0.2, 0.2);
            let adjust = 0.2;
            
            // Comparando a posição atual com pbest
            if (particle.position.x <= pbest[1].x) {
                particle.velocity.x += adjust;
            } else {
                particle.velocity.x -= adjust;
            }
            if (particle.position.y <= pbest[1].y) {
                particle.velocity.y += adjust;
            } else {
                particle.velocity.y -= adjust;
            }
            if (particle.position.z <= pbest[1].z) {
                particle.velocity.z += adjust;
            } else {
                particle.velocity.z -= adjust;
            }
            
            // Comparando a posição atual com gbest
            if (particle.position.x <= gbest[1].x) {
                particle.velocity.x += adjust;
            } else {
                particle.velocity.x -= adjust;
            }
            if (particle.position.y <= gbest[1].y) {
                particle.velocity.y += adjust;
            } else {
                particle.velocity.y -= adjust;
            }
            if (particle.position.z <= gbest[1].z) {
                particle.velocity.z += adjust;
            } else {
                particle.velocity.z -= adjust;
            }
        }
    }
    updateSystem() {
        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i][1] = this.particles[i][0].position.dist(this.target);
        }
    }
    averageDist() {
        var sum = 0;
        for (let i = 0; i < this.particles.length; i++) {
            sum += this.particles[i][1];
        }
        console.log(`> [particles] population average: ${sum / this.particles.length}`);
    }
    addParticle(n) {
        for (let i = 0; i < n; i++) {
            /**
             * - Adciona as partículas na array;
             * - Calcula a distância atual entre a particula e o alvo;
             * - Adiciona a melhor posição pbest
             **/

            // [partícula, distância atual, pbest]
            this.particles.push([new Particle(this.origin), null, null]);
            this.particles[i][1] = this.particles[i][0].position.dist(this.target);
            this.particles[i][2] = [this.particles[i][0].position.dist(this.target), this.particles[i][0].position.copy()];
            
            console.log(`> [particles] particle ${i} on position(${this.particles[i][0].position.x}, ${this.particles[i][0].position.y}, ${this.particles[i][0].position.z}) created!`);
        }
    }
}