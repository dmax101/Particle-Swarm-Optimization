function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    translate(createVector(0,0,0));
    console.log(windowHeight);
}
var x = -1 * 1024/2;
var y = -1 * 328/2;
var z = 0;

function draw() {
    background(51);
    push();
    translate(createVector(x,y,z));
    sphere(80);
    pop();
    console.log(x,y,z);
    
    x += 0.2;
    y += 0.2;
    z += 0;

    push();
    translate(createVector(0,0,0));
    rotateX(x/10);
    rotateY(y/10);
    rotateZ(x/10);
    box(80);
    pop();
}