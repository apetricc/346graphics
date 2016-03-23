/**
 * 
 * @author:  Edward Angel
 * Modified by Andrew Petriccione
 * Partner: Dahquan Williams 
 * Last Modified: 2-5-2016
 * 
 * Draws a shapes on the screen
 */

var gl;

function pickDrawType() {
    var drawTypes = [
    gl.LINES,
    gl.POINTS,
    gl.LINE_STRIP,
    gl.LINE_LOOP    
    ];
    return drawTypes[Math.floor(Math.random() * (5))];
}

function pickDrawType2() {
    var drawTypes = [
    gl.LINES,
    gl.POINTS,
    gl.LINE_STRIP,
    gl.LINE_LOOP,
    gl.TRIANGLE_FAN    
    ];
    return drawTypes[Math.floor(Math.random() * (6))];
}

function returnNum() {
    return (Math.floor(Math.random() * 15));
}

function returnRange() {
    return (Math.round(Math.random() * (100) + 1));
}
function myCanvas() {
    var canvas = document.getElementById("gl-canvas"); //must be in html

    gl = WebGLUtils.setupWebGL(canvas);  
    if (!gl) {
        alert("WebGL isn't available");
    }
    
    //  Configure WebGL

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(Math.random(), Math.random(), Math.random(), Math.random());

    //  Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);
    gl.clear(gl.COLOR_BUFFER_BIT);
    var objColor = [1, 0, 1, 1];
    var objColor1 = [Math.random(), Math.random(), Math.random(), 1];
    var objColor2 = [Math.random(), Math.random(), Math.random(), 1];
    
    if (objColor == objColor1 || objColor == objColor2) {
        objColor = [.2,0,.1,.3];
        objColor1 = [0,.7,.4,.6];
        objColor2 = [1,0,0,1];    
    }
    // draw the various objects
    drawObject(gl, program, makeSpiral(0.05,200), objColor2, pickDrawType2());
    drawObject(gl, program, generateCircle(.5, returnRange(), Math.random(), -.2), objColor, pickDrawType());
    drawObject(gl, program, generateCircle(.5, returnNum(), Math.random() * (-1), Math.random() * (-1)), objColor1, pickDrawType());
    drawObject(gl, program, generateCircle(.5, returnRange(), -.2, Math.random()), objColor, pickDrawType());
    drawObject(gl, program, generateCircle(.5, returnNum(), Math.random() * (-1), Math.random() * (-1)), objColor, pickDrawType());
    drawObject(gl, program, generateCircle(.5, returnRange(), Math.random() * (-1), Math.random() * (-1)), objColor2, pickDrawType());
    drawObject(gl, program, makeSpiral(0.05,returnRange), objColor2, gl.LINE_STRIP);
    drawObject(gl, program, makeMutantSpiral(0.05,200), objColor2, gl.LINE_STRIP);
};//CanvasMain

function makeSpiral(a, pointCount) {
    //x = a(cos(t) + t sin(t)), y = a(sin(t) - t cos(t))
    var b = returnNum();
    var vertices = [];
    var inc = b*Math.PI / pointCount;
    for (var theta = 0; theta < b*Math.PI; theta += inc) {
        vertices.push(vec2(a*(Math.cos(theta) + theta*Math.sin(theta)), (a*(Math.sin(theta) - theta*Math.cos(theta)))));
    }
    return vertices;
};//makeSpiral

function makeMutantSpiral(a, pointCount) {
    //x = a(cos(t) + t sin(t)) + random, y = a(sin(t) - t cos(t)) + random
    var b = returnNum();
    var vertices = [];
    var inc = b*Math.PI / pointCount;
    for (var theta = 0; theta < b*Math.PI; theta += inc) {
        vertices.push(vec2(a*(Math.cos(theta) + theta*Math.sin(theta))+Math.random(), (a*(Math.sin(theta) - theta*Math.cos(theta))+Math.random())));
    }
    return vertices;
};//makeMutantSpiral

function generateCircle(radius, pointCount, x, y){
    var circleVertices = [];
    var inc = 2*Math.PI / pointCount;
    
    for (var theta = 0; theta <2*Math.PI; theta += inc){
        circleVertices.push(vec2(radius*Math.cos(theta) + x, radius*Math.sin(theta) + y));
    }//generate circle
    
    return circleVertices;
};//generateCircle

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


