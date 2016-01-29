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

function canvasMain() {
    var canvas = document.getElementById("gl-canvas"); //must be in html

    gl = WebGLUtils.setupWebGL(canvas);  
    if (!gl) {
        alert("WebGL isn't available");
    }
  

    //  Configure WebGL

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 0.0, 0.0, 1.0);

    //  Load shaders and initialize attribute buffers

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    var objColor = [Math.random(), Math.random(), Math.random(), 1];
    drawObject(gl, program, generateCircle(1, 50), objColor, gl.TRIANGLE_FAN);
    objColor = [Math.random(), Math.random(), Math.random(), 1];
    drawObject(gl, program, generateCog(0.5,26), objColor, gl.LINE_STRIP);
    drawObject(gl, program, generateStar(0.5, 52), objColor, gl.LINE_STRIP);
    //   gl.POINTS
    //   gl.LINES
    //   gl.LINE_STRIP
    //   gl.LINE_LOOP
    //   gl.TRIANGLE_FAN
};//CanvasMain



function generateCircle(radius, pointCount){
    var circleVertices = [];
    var inc = 2*Math.PI / pointCount;
    
    for (var theta = 0; theta <2*Math.PI; theta += inc){
        circleVertices.push(vec2(radius*Math.cos(theta), radius*Math.sin(theta)));
    }//generate circle
    
    return circleVertices;
};//generateCircle


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


