/**
 * 
 * @author:  Edward Angel
 * Modified by Andrew Petriccione
 * Last Modified: 1-29-2016
 * 
 * Draws a square on screen
 */

var gl;
var points;


function myCanvas() {
    var canvas = document.getElementById("gl-canvas"); //must be in html

    gl = WebGLUtils.setupWebGL(canvas);  
    if (!gl) {
        alert("WebGL isn't available");
    }
  

    //  Configure WebGL

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 0.5, 0.2, 1.0);

    //  Load shaders and initialize attribute buffers

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);
    gl.clear(gl.COLOR_BUFFER_BIT);
    //try drawing points etc like I did before
    
    
    
        
    var objColor = [Math.random(), Math.random(), Math.random(), 1];
    drawObject(gl, program, generateCircle(1, 50), objColor, gl.TRIANGLE_FAN);
    objColor = [Math.random(), Math.random(), Math.random(), 1];
    drawObject(gl, program, generateCircleDots(1, 50), objColor, gl.POINTS);
    drawObject(gl, program, generateCog(0.5,26), objColor, gl.LINE_STRIP);
    drawObject(gl, program, generateShape(0.5, 52), objColor, gl.LINES);
    drawObject(gl, program, generateOtherShape(0.5, 52), objColor, gl.TRIANGLE_FAN);
    /**
    var objColor = [Math.random(), Math.random(), Math.random(), 1];
    drawObject(gl, program, generateShape(1,50), objColor, gl.TRIANGLE_FAN);
    drawObject(gl, program, generateCircleDots(1, 50), objColor, g.POINTS);
    drawObject(gl, program, generateCircleDots(1, 50), objColor, gl.POINTS);
    drawObject(gl, program, generateCircle(1, 50), objColor, gl.LINE_LOOP);
    objColor = [Math.random(), Math.random(), Math.random(), .5];
    drawObject(gl, program, generateCog(0.7,11), objColor, gl.LINES);
    drawObject(gl, program, generateShape(Math.random(), 52), objColor, gl.TRIANGLE_FAN);
    drawObject(gl, program, generateOtherShape(Math.random()*(50-2)+2, 52), objColor, gl.LINE_LOOP);
    **/
    //   gl.POINTS
    //   gl.LINES
    //   gl.LINE_STRIP
    //   gl.LINE_LOOP
    //   gl.TRIANGLE_FAN
};//CanvasMain


function generateCircleDots(radius, pointCount){
    var circleVertices = [];
    var inc = 2*Math.PI / pointCount;
    
    for (var theta = 0; theta <2*Math.PI; theta += inc){
        circleVertices.push(vec2((radius/2)*Math.cos(theta), radius*Math.sin(theta)));
        circleVertices.push(vec2(radius*Math.cos(theta), (radius/2)*Math.sin(theta)));
        circleVertices.push(vec2(radius*Math.cos(theta), radius*Math.sin(theta)));
    }//generate circle
   // console.log("This is what I want to add as my drawing method:  " );
    return circleVertices;
};//generateCircle


function generateCircle(radius, pointCount){
    var circleVertices = [];
    var inc = 2*Math.PI / pointCount;
    
    for (var theta = 0; theta <2*Math.PI; theta += inc){
        circleVertices.push(vec2(radius*Math.cos(theta), radius*Math.sin(theta)));
    }//generate circle
    console.log("generate circle used this in it's loop:  " + inc);
    return circleVertices;
};//generateCircle


function generateCog(base, pointCount){
    var vertices = [];
    var inc = Math.random()*Math.PI / pointCount;
    var radius;
    
    for (var theta = 0; theta <2*Math.PI; theta += inc){
        if ((vertices.length % 2) === 0)
            radius = 2*base;
        else
            radius = base;
        vertices.push(vec2(radius*Math.cos(theta), radius*Math.sin(theta)));
    }//generate cog vertices
    console.log("generate cog used this in it's loop:  " + inc);
    return vertices;
};//generateCog
/**

!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


**/
function generateShape(base, pointCount){
    var vertices = [];
    var inc =2*Math.PI / pointCount;
    var radius;
    
    for (var theta = 0; theta <2*Math.PI; theta += inc){
        radius = Math.random()*base;
        vertices.push(vec2(radius*Math.cos(theta), (Math.random())*radius*Math.sin(theta)));
        vertices.push(vec2(0,0));
    }//generate Star
    console.log("generate shape used this in it's loop:  " + inc);
    return vertices;
};//generateShape

function generateOtherShape(base, pointCount){
    var vertices = [];
    var inc =2*Math.PI / pointCount;
    var radius;
    
    for (var theta = 0; theta <2*Math.PI; theta += inc){
        radius = Math.random()*base;
        vertices.push(vec2(radius*Math.cos(theta), (Math.random())*radius*Math.sin(theta)));
        vertices.push(vec2(0,0));
    }//generate Star
    console.log("generate other shape used this in it's loop:  " + inc);
    return vertices;
};//generateOtherShape

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
    gl.uniform4f(colorLocation, color[.5], color[1], color[2], color[3]);
    
    gl.drawArrays(glType, 0, vertices.length);
   
   
}//drawObject


