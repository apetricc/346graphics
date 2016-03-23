/**
 * 
 * @author:  Edward Angel
 * Modified by Marietta E. Cameron, David Cable
 * Last Modified: 2-22-2016
 * 
 * Draws a Color polyhedron on the screen
 */

var gl;

var xAxis = 0; 
var yAxis = 1;
var zAxis = 2;

var axis = 0;
var theta = [0, 0, 0];

var thetaLoc;
var elementCount; //number of indices

function canvasMain() {
    //load webGL
    var canvas = document.getElementById("gl-canvas"); //must be in html
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }


    //  Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");

    var cube = generateCube();

    gl.viewport(0, 0, canvas.width, canvas.height);
   
    
  
    //event listeners for buttons    
    document.getElementById( "xButton" ).onclick = function () {
        axis = xAxis; 
        theta = [0,0,0];
    };
    document.getElementById( "yButton" ).onclick = function () {
        axis = yAxis;
        theta = [0,0,0];
    };
    document.getElementById( "zButton" ).onclick = function () {
        axis = zAxis;   
        theta = [0,0,0];
    };


    drawObject(gl, program, cube, axis);
}//CanvasMain
 

 

/**
 * Generate Cube creates the geometry for the cube object (setup vertices, colors, and indices)
 * @returns {generateCube.cube}
 */
function generateCube() {

    var vertices = [
        vec4(0, 0, 0.5, 1),           //0
        vec4(-0.3, -0.4, 0.2, 1),     //1
        vec4(0.3, -0.4, 0.2, 1),      //2
        vec4(0.5, 0.2, 0.2,  1),      //3
        vec4(0, 0.5, 0.2, 1),         //4
        vec4(-0.5, 0.2, 0.2, 1),      //5
        vec4(0, 0, -0.5, 1),          //6
        vec4(-0.3, -0.4, -0.2, 1),    //7
        vec4(0.3, -0.4, -0.2, 1),     //8
        vec4(0.5, 0.2, -0.2,  1),     //9
        vec4(0, 0.5, -0.2, 1),        //10
        vec4(-0.5, 0.2, -0.2, 1)      //11
        
    ];

    //Remember webGl has only triangles as fragment primitives
    var indices = [0, 2, 1, 1, 2, 8, 1, 8, 7, 7, 8, 6, 
                   0, 3, 2, 2, 3, 9, 2, 9, 8, 8, 9, 6, 
                   0, 4, 3, 3, 4, 10, 3, 10, 9, 9, 10, 6,
                   0, 5, 4, 4, 5, 11, 4, 11, 10, 10, 11, 6,
                   0, 1, 5, 5, 1, 7, 5, 7, 11, 11, 7, 6
    ];


    var colors = [
        vec4(0.1, 0.1, 0.1, 1),
        vec4(0.5, 0.5, 0.5, 1),
        vec4(0.6, 0.6, 0.6, 1),
        vec4(0.7, 0.7, 0.7, 1),
        vec4(0.4, 0.4, 0.4, 1),
        vec4(0.5, 0.5, 0.5, 1),
        vec4(0.1, 0.1, 0.1, 1),
        vec4(0.5, 0.5, 0.5, 1),
        vec4(0.5, 0.5, 0.5, 1),
        vec4(0.4, 0.4, 0.4, 1),
        vec4(1.0, 1.0, 1.0, 1),
        vec4(0.9, 0.9, 0.9, 1)
    ];

    //example of an object in java script 
    var cube = {vertices: vertices, indices: indices, colors: colors, primtype: gl.TRIANGLES};


    return cube;
}//generateCube



function drawObject(gl, program, obj, viewAxis) {
   
    // clear the background 
    gl.clearColor(0.6, 1.0, 0.4, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // set the shader to use
    gl.useProgram(program);


    // array element buffer

    var iBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(obj.indices), gl.STATIC_DRAW);

    // color array atrribute buffer

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(obj.colors), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    // vertex array attribute buffer

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(obj.vertices), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    thetaLoc = gl.getUniformLocation(program, "theta");
    axis = viewAxis;
    elementCount = obj.indices.length;
    
    render();
   
}//drawObject

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    theta[axis] += 1.0;
    gl.uniform3fv(thetaLoc, theta);

    gl.drawElements(gl.TRIANGLES, elementCount, gl.UNSIGNED_SHORT, 0);  

    requestAnimFrame( render );
}




