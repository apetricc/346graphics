/**
 * 
 * @author:  Edward Angel
 * Modified by Andrew Petriccione
 * Last Modified: 1-12-2016
 * 
 * Draws shapes on screen
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
        //vertices for 1st shape
        vec2(-0.95, -0.95), //constructor for 2d vectors (points)
        vec2(-0.95, -.6),
        vec2(-.5, -.6),
        vec2(-.5, -.95),
        vec2(-.75, -.75),
        
        //vertices for 2nd shape
        vec2(-.95, 0.2),
        vec2(-.95, .5),
        vec2(-.50,.8),
        vec2(-.3,.8),
        vec2(-.3,.5),
        
        //vertices for 3rd shape
        vec2(.5,0),
        vec2(.5,.5),
        vec2(.7,.3),
        vec2(.2,-.1),
        vec2(.3,.7),
        vec2(.5,.0),
        //vertices for 4th shape
        vec2(.5,-.32),
        vec2(.5,-.75),
        vec2(.9,-.73),
        vec2(.2,-.71),
        vec2(.3,-.73),
        vec2(.5,-.720)
        
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
/**
  TRIANGLE_FAN seems to make a triangle and fill it in as it goes
  LINES makes pairs of lines that don't connect it seems
  LINE_LOOP connects first point to last point and points along the way
  POINTS just makes squares at the points given

**/
function drawScene() {
    
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.LINE_LOOP, 0, 5);  //call this for each object I want to draw, but keep all the vertices in one big array
    
    gl.drawArrays(gl.TRIANGLE_FAN, 5, 5);
    
    gl.drawArrays(gl.POINTS, 10, 6);
    gl.drawArrays(gl.TRIANGLE_FAN, 10, 6);
    
    gl.drawArrays(gl.POINTS, 16, 5);
    gl.drawArrays(gl.LINE_LOOP, 16, 5);
    
    
    
    /**
      we have one big array with all the points/vertices. The array is called vertices.  It is an array of type vec2. 
     Later, we call gl.drawArrays for each object we want to draw-- 
     1st parameter is the type of line we want to connect the points(gl.LINES, gl.LINE_LOOP, etc.),
     2nd is what index to start at in the array.  **Not sure how it knows which array to look in**  --drawScene() gets called at the end of canvasMain()-- 
     3rd parameter is how many points (or sides?) in our object--square would be 4, triangle 3 etc.
    
    **/
    //other constants to try 
    //    gl.TRIANGLE_FAN
    //   gl.POINTS
    //   gl.LINES
    //   gl.LINE_STRIP
    //   gl.LINE_LOOP
    //   gl.TRIANGLE_FAN
}//drawScene


