/**
 * 
 * @author:  Edward Angel
 * Modified by Marietta E. Cameron
 * Last Modified: 1-26-2016
 * 
 * Draws a square on screen
 */

var gl;
var points;
function pickOne() {
    var drawTypes = [
    gl.LINES,
    gl.POINTS,
    gl.LINE_STRIP,
    gl.LINE_LOOP,
    gl.TRIANGLE_FAN
    
    ];
    return drawTypes[Math.floor(Math.random() * (6))];
}

//return between min and max inclusive:
// return Math.floor(Math.random() * (max - min + 1)) + min
/**
if (returnNum > 7) {
        drawObject(gl, program, generateCog(0.5,26), objColor, gl.LINE_STRIP);       
    } else drawObject(gl, program, generateStar(0.5, 52), objColor, gl.LINE_STRIP);
**/

function returnNum() {
    return (Math.floor(Math.random() * 15));
}

function returnRange() {
    return (Math.round(Math.random() * 2));
}
function myCanvas() {
    var canvas = document.getElementById("gl-canvas"); //must be in html

    gl = WebGLUtils.setupWebGL(canvas);  
    if (!gl) {
        alert("WebGL isn't available");
    }
  
// use an if statement instead of a loop-- if below a certain range call one method
    // if ablove that range call the other method
    //  Configure WebGL

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(Math.random(), Math.random(), Math.random(), Math.random());

    //  Load shaders and initialize attribute buffers

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);
    gl.clear(gl.COLOR_BUFFER_BIT);
    var objColor1 = [Math.random(), Math.random(), Math.random(), 1];
    //var objColor2 = [Math.random(), Math.random(), Math.random(), 1];
    var objColor2 = [1,0,0,1];
    //drawObject(gl, program, generateCircle(.5, returnNum(), 0, returnRange()), objColor1, pickOne());
    //drawObject(gl, program, generateCircle(.5, returnNum(), 0, returnRange()), objColor2, pickOne());
    drawObject(gl, program, makeSpiral(0.05,100), objColor2, gl.LINE_STRIP);
console.log(pickOne());
    objColor = [Math.random(), Math.random(), Math.random(), 1];
    
    
    
    /**
    drawObject(gl, program, generateCog(0.5,26), objColor, gl.LINE_STRIP);
    drawObject(gl, program, generateStar(0.5, 52), objColor, gl.LINE_STRIP);
    **/
    //   gl.POINTS
    //   gl.LINES
    //   gl.LINE_STRIP
    //   gl.LINE_LOOP
    //   gl.TRIANGLE_FAN
};//CanvasMain

function makeSpiral(a, pointCount) {
    //x = a(cos(t) + t sin(t)), y = a(sin(t) - t cos(t))
    var b=pickOne();
    var vertices = [];
    var inc = b*Math.PI / pointCount;
    for (var theta = 0; theta < b*Math.PI; theta += inc) {
        vertices.push(vec2(a*(Math.cos(theta) + theta*Math.sin(theta)), (a*(Math.sin(theta) - theta*Math.cos(theta)))));
    }//makeSpiral
    console.log(vertices);
    return vertices;
};

function generateCircle(radius, pointCount, x, y){
    var circleVertices = [];
    var inc = 2*Math.PI / pointCount;
    
    for (var theta = 0; theta <2*Math.PI; theta += inc){
        circleVertices.push(vec2(radius*Math.cos(theta) + x, radius*Math.sin(theta) + y));
    }//generate circle
    
    return circleVertices;
};//generateCircle



function makeSquare(size) {
    //rp = ap cos(pθ)
    var vertices = [size];
    
    var inc = 2*Math.PI / size;
    var theta = .1;
    for (var theta = 0; theta < size; theta+= inc) {
        vertices.push(vec2(Math.cos(theta), size*Math.cos(theta)));
    }
};




function generateCog(base, pointCount){
    var vertices = [];
    var inc = 2*Math.PI / pointCount;
    var radius;
    
    for (var theta = 0; theta <2*Math.PI; theta += inc){
        if ((vertices.length % 2) === 0)
            radius = 2*base;
        else
            radius = base;
        vertices.push(vec2(radius*Math.cos(theta), radius*Math.sin(theta)));
    }//generate cog vertices
    
    return vertices;
};//generateCog

function generateStar(base, pointCount){
    var vertices = [];
    var inc = 2*Math.PI / pointCount;
    var radius;
    
    for (var theta = 0; theta <2*Math.PI; theta += inc){
        radius = Math.random()*base;
        vertices.push(vec2(radius*Math.cos(theta), radius*Math.sin(theta)));
        vertices.push(vec2(0,0));
    }//generate Star
    
    return vertices;
};//generateStar

function drawObject(gl, program, vertices, color, glType) {
    var colorLocation = gl.getUniformLocation(program, "uColor"); 
    
  
    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);   
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
    
    
    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    
   
    
    // set uniform color.
    gl.uniform4f(colorLocation, color[0], color[1], color[2], color[3]);
    
    gl.drawArrays(glType, 0, vertices.length);
   
   
}//drawObject


