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
    return drawTypes[Math.floor(Math.random() * (5))];
}
function myCanvas() {
    var canvas = document.getElementById("gl-canvas"); //must be in html

    gl = WebGLUtils.setupWebGL(canvas);  
    if (!gl) {
        alert("WebGL isn't available");
    }
  

    //  Configure WebGL

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(.2, 0.9, 0.15, .7);

    //  Load shaders and initialize attribute buffers

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    var objColor = [Math.random(), Math.random(), Math.random(), 1];
    drawObject(gl, program, generateCircle(.75, 22, .5, .5), objColor, pickOne());
    drawObject(gl, program, makeSpiral(), objColor, gl.TRIANGLE_FAN);
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



function generateCircle(radius, pointCount, x, y){
    var circleVertices = [];
    var inc = 2*Math.PI / pointCount;
    
    for (var theta = 0; theta <2*Math.PI; theta += inc){
        circleVertices.push(vec2(radius*Math.cos(theta) + x, radius*Math.sin(theta) + y));
    }//generate circle
    
    return circleVertices;
};//generateCircle

function makeSpiral() {
    //x = a(cos(t) + t sin(t)), y = a(sin(t) - t cos(t))
    var vertices = [100];
    
};

function makeSquare(size) {
    //rp = ap cos(pθ)
    var vertices = [size];
    
    var inc = 2*Math.PI / size;
    var theta = .1;
    for (var theta = 0; theta < size; theta+= inc) {
        vertices.push(vec2(Math.cos(theta), size*Math.cos(theta)));
    }
}


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


