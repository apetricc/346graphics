/**
 * 
 * @author:  Edward Angel
 * Modified by Marietta E. Cameron
 * Last Modified: 1-12-2016
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
    // Four Vertices
    
    //Declare an array

    var vertices = [
        vec2(-0.5, -0.5), //constructor for 2d vectors (points)
        vec2(-0.5, 0.5),
        vec2(0.5, 0.5),
        vec2(.5, -.5)
    ];

    //  Configure WebGL

    gl.viewport(0, 0, canvas.width, canvas.height);
    //sets the background
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    //  Load shaders and initialize attribute buffers

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    drawScene();
};

function drawScene() {
    
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, 4);
    //other constants to try 
    //    gl.TRIANGLE_FAN
    //   gl.POINTS
    //   gl.LINES
    //   gl.LINE_STRIP
    //   gl.LINE_LOOP
    //   gl.TRIANGLE_FAN
}//drawScene


