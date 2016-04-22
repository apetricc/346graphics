/**
 * 
 * @author:  Edward Angel
 * Modified by Marietta E. Cameron, Will Godfrey
 * Last Modified: 3-21-2016
 * 
 * Draws a Color Octohedron on screen
 */

var gl;

var xAxis = 0; //used as a subscript in theta array
var yAxis = 1; //used as a subscript in theta array
var zAxis = 2; //used as a subscript in theta array

var axis = 0;
var theta = [0, 0, 0]; //rotation angle about x, y, z 

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

    var Mountain = generateMtn();

    gl.viewport(0, 0, canvas.width, canvas.height);
   
    var inc = 5;
  
    //event listeners for buttons    
    document.getElementById( "xPlusButton" ).onclick = function () {
        axis = xAxis; 
        theta[0] += inc;
        //theta = [0,0,0];
    };
    document.getElementById( "yPlusButton" ).onclick = function () {
        axis = yAxis;
        theta[1] += inc;
        //theta = [0,0,0];
    };
    document.getElementById( "zPlusButton" ).onclick = function () {
        axis = zAxis;   
        theta[2] += inc;
        //theta = [0,0,0];
    };
    document.getElementById( "zTheta" ).onclick = function () {
        theta = [0,0,0];
    };


    drawObject(gl, program, Mountain, axis);
}//CanvasMain




/**
 * Generate Cube creates the geometry for the cube object (setup vertices, colors, and indices)
 * @returns {generateCube.cube}
 */
function generateMtn() {
        
    var a = vec4(0.0, 1.0,  0.0, 1.0);
    var b = vec4(-1.0, -1.0, 0.0, 1.0);
    var c = vec4(1.0, -1.0, 0.0, 1.0);
    var pPoints = [];
    var iterations = 6;
    triRecursive(a,b,c,pPoints,iterations);
    var m = 0;
    for (var i =0; i<pPoints.length;i++){
        m = Math.random()*.125;
        pPoints[i][2] = m;
    }
    findZBust(pPoints);
    
    //Remember webGl has only triangles as fragment primitives
    
    var indices = [];
    for (var i = 0;i<pPoints.length;i++){
        indices.push(i);
    }
    var colors = [];
    for (var i = 0;i<pPoints.length;i++){
        colors.push(vec4(0, 0, 1, 1));
    }

    //example of an object in java script 
    var mtn = {vertices: pPoints, indices: indices, colors: colors, primtype: gl.TRIANGLES};


    return mtn;
}//generateCube
function findZBust(pPoints){
    var x,y,z = 0;
    for(var i = 0; i<pPoints.length;i++){
        x=pPoints[i][0];
        y=pPoints[i][1];
        z=pPoints[i][2];
        var indexPile = [];
        var zPile = [];
        for(var j = 0; j<pPoints.length;j++){
            if (x === pPoints[j][0] && y === pPoints[j][1]){
                indexPile.push(j);
                zPile.push(pPoints[j][2]);
            }
        }
        setLowest(zPile, indexPile, pPoints);
    }
}

function sort(zPile){
    var min = 1;
    for(var i =0;i<zPile.length-1;i++){
        if (zPile[i] < min){
            min = zPile[i];
        }
    }
    return min;
}

function setLowest(zPile,indexPile, pPoints){
    var min = sort(zPile);  
    for(var i = 0;i<indexPile.length;i++){
        var temp = indexPile[i];
        pPoints[temp][2] = min;
    }
}
function triRecursive(a, b, c, pPoints, iterations)
{
    if(iterations === 0){ 
        pPoints.push(a,b,c);
    }
    else
    {
        var p1 = mix(a,c,.5);
        var p2 = mix(a,b,.5);
        var p3 = mix(b,c,.5);
        
        triRecursive(a,p2,p1,pPoints, iterations-1);
        triRecursive(p2,b,p3,pPoints, iterations-1);
        triRecursive(p1,p3,c,pPoints, iterations-1);
        triRecursive(p1,p2,p3,pPoints, iterations-1);
    }
}

function drawObject(gl, program, obj, viewAxis) {
   
    // clear the background (with black)
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
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

    //theta[axis] += 2.0;  //rotate by 2degrees
    gl.uniform3fv(thetaLoc, theta); //find theta in html  and set it

    gl.drawElements(gl.TRIANGLES, elementCount, gl.UNSIGNED_SHORT, 0);  //draw elements  ... elementCount number of indices  

    requestAnimFrame( render );  
}
