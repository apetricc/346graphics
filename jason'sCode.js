/**
 *
 * @author:  Edward Angel
 * Modified by Marietta E. Cameron, Jason Andrae
 * Project partner: Brett Hodges
 * Last Modified: 2-1-2016
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
    var startColor = getColor(true);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(startColor[0],startColor[1],startColor[2],startColor[3]);

    //  Load shaders and initialize attribute buffers

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);
    gl.clear(gl.COLOR_BUFFER_BIT);

    //  Load seed for randomized values for this iteration
    var seed = Math.floor(Math.random()*90+10);

    console.log("About to get colors:");
    var palette = getPalette(seed+Math.floor(seed/3));

    var originCoords = generateOrigins(seed, -1, 1),
        nextCoords, thisColor, i, startingCoords, shapeVal, shape, shapeColor;

    var size = originCoords.splice(0,1)[0];
    console.log(size)
    for (i = 0; i < seed; i++){
      /**
       * randomly pick a square from the number of available square spaces,
       * then select the origin coordinates for that square
       */
      startingCoords = Math.floor((Math.random()*originCoords.length));
      nextCoords = originCoords.splice(startingCoords,1)[0];
      thisColor = palette.pop();
      shapeVal = startingCoords % 3;
      switch (shapeVal) {
        case 0:
          shape = generateSquare(nextCoords,size);
          shapeColor = blendedColors(shape.length,thisColor);
          drawObject(gl, program, shape, thisColor, gl.TRIANGLE_FAN);

          break;
        case 1:
          shape = generateCircle(size/2, 50,nextCoords,size);
          drawObject(gl, program, shape, thisColor, gl.TRIANGLE_FAN);
          break;
        case 2:
          shape = generateTriangle(nextCoords,size);
          drawObject(gl, program, shape, thisColor, gl.TRIANGLE_FAN);
          break;
        default:
      }//case
    }//For each shape
    console.log("generating curves")
    var curvePalette = getPalette(4);
    var top, bottomLeft, bottomRight;
    top = hypnotoad(0,0.5,75);
    bottomLeft = epitrogdor(-0.5,-0.5,75);
    bottomRight = epicycloid(0.5,-0.5,75);
    drawObject(gl, program, top, curvePalette.pop(), gl.LINE_STRIP);
    drawObject(gl, program, bottomLeft, curvePalette.pop(), gl.LINE_STRIP);
    drawObject(gl, program, bottomRight, curvePalette.pop(), gl.LINE_STRIP);
};//CanvasMain

/**
 * Function to randomly select a color from the predetermined JSON array, and
 * randomly select a saturation value
 */
function getColor(isSat){
  var colorVals = [];
  var i;
  var palette = [
  	  {"name":"vivid_yellow","rgb":[255, 179, 0]},
      {"name":"vivid_orange","rgb":[255, 104, 0]},
  	  {"name":"very_light_blue","rgb":[166, 189, 215]},
  	  {"name":"vivid_red","rgb":[193, 0, 32]},
  	  {"name":"grayish_yellow","rgb":[206, 162, 98]},
  	  {"name":"medium_gray","rgb":[129, 112, 102]},
  	  {"name":"vivid_green","rgb":[0, 125, 52]},
  	  {"name":"strong_purplish_pink","rgb":[246, 118, 142]},
  	  {"name":"strong_blue","rgb":[0, 83, 138]},
  	  {"name":"strong_yellowish_pink","rgb":[255, 122, 92]},
  	  {"name":"strong_violet","rgb":[83, 55, 122]},
  	  {"name":"vivid_orange_yellow","rgb":[255, 142, 0]},
  	  {"name":"strong_purplish_red","rgb":[179, 40, 81]},
  	  {"name":"vivid_greenish_yellow","rgb":[244, 200, 0]},
  	  {"name":"strong_reddish_brown","rgb":[127, 24, 13]},
  	  {"name":"vivid_yellowish_green","rgb":[147, 170, 0]},
  	  {"name":"deep_yellowish_brown","rgb":[89, 51, 21]},
  	  {"name":"vivid_reddish_orange","rgb":[241, 58, 19]},
  	  {"name":"dark_olive_green","rgb":[35, 44, 22]}
    ];
  //randomly select one color from palette
  var rgbVals = palette[Math.floor(Math.random()*palette.length)].rgb;
  for (i=0; i<rgbVals.length; i++) {
    //RGB Values are stored as ints, divide by 256 to keep same color scheme
    colorVals.push(rgbVals[i]/256);
  }
  /**for completely random saturation, keep following line
   * If full saturation parameter was passed to function, then saturation will be
   * 1, else will be a random value
   */
  isSat ? colorVals.push(1) : colorVals.push(Math.random());
  //for random saturation with minimum threshold, keep following lines
  /** var lowerFloorPerCent = 50; //change minimum saturation percentage here
   *  colorVals.push((Math.random()/2)+(lowerFloorPerCent/100));
   */
  return colorVals;
}

/**
 * Function to use getColor to get an array of predetermined color arrays, sorted
 * in by saturation value
 */
function getPalette(paletteSize){
  var palette = [];
  var i;
  //Fill palette with randomized colors
  for (i=0; i < paletteSize; i++){
    palette.push(getColor());
  }
  //sort palette by satration value (value at index 3)
  palette.sort(function(a, b){return a[3]-b[3]});
  return palette;
}

/**
 * Function to generate a series of squares from a given origin to a given endpoint
 */
function generateOrigins(squaresNeeded, lowerBound, upperBound){
  var i;
  //squareRoot of needed squares, rounded up
  var nextSquare = Math.ceil(Math.sqrt(squaresNeeded))+3;
  //size of each square, based on number of needed squares
  var squareSize = (upperBound - lowerBound)/(2*nextSquare);
  var shapesReturned = Math.pow(nextSquare,2);
  var start = lowerBound + (squareSize/2), //first x coordinate
      x = start, //current x coordinate
      y = start, //current y coordinate
      vertices = []; //array to store all square coordinates
  vertices.push(squareSize);
  console.log(vertices)
  //loop for next integer squared larger than needed number of squares
  for (i = 0; i < shapesReturned; i++){
    if (x > upperBound){
      x = start;
      y += squareSize * 2; //sS * 2 because first sS only moves the distance of the square
    }
    console.log("Calling generateSquare");
    vertices.push(vec2(x,y));
    x += squareSize * 2;
  }
  return vertices;
}

/**
 * Function to create square corner coordinates based on origin and size parameters
 */
function generateSquare(coords, size){
  var vertices = [],
      x = coords[0],
      y = coords[1];

  vertices.push(vec2(x,y));
  vertices.push(vec2(x,y+size));
  vertices.push(vec2(x+size,y+size));
  vertices.push(vec2(x+size,y));
  return vertices;
}//generateSquare

/**
 * Function to generate a circle within a given box coordinates
 */
function generateCircle(radius, pointCount, startingCoords, size){
    var circleVertices = [];
    var inc = 2*Math.PI / pointCount;
    var x = startingCoords[0] + (size/2), //starting x origin
        y = startingCoords[1] + (size/2); //starting y origin

    for (var theta = 0; theta <2*Math.PI; theta += inc){
        circleVertices.push(vec2(radius*Math.cos(theta)+x, radius*Math.sin(theta)+y));
    }//generate circle

    return circleVertices;
}//generateCircle

/**
 * Function to create a triangle from within a given box of coordinates
 */
function generateTriangle(coords, size){
  console.log("Making Triange:")
  var squareCoords = generateSquare(coords,size), //generate a square to house triangle
      vertices = [],
      direction = Math.floor(Math.random()*squareCoords.length),
      i, x, y;
  //Randomly select from one of the 4 squareCoords points, add to triangle
  vertices.push(vec2(squareCoords[direction][0],squareCoords[direction][1]));
  //Take the next point in a square from the previously selected point (%4 in case next point is index 0)
  vertices.push(vec2(squareCoords[(direction+1)%4][0],squareCoords[(direction+1)%4][1]));
  //Last triangle point is midway between the last 2 points in squareCoords
  x = (squareCoords[(direction+2)%4][0]+squareCoords[(direction+3)%4][0])/2;
  y = (squareCoords[(direction+2)%4][1]+squareCoords[(direction+3)%4][1])/2;
  vertices.push(vec2(x,y));
  return vertices;
}

/**
 * Function to draw objects
 */
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

function blendedColors(pointTotals, color){
  var counter = 0, i,
      colors = [];

  for (i=0; i<pointTotals*2/3;i++){
    colors.push(color);
    counter++;
  }
  while (counter<pointTotals){
    colors.push(vec4(0,0,0,1));
    counter++;
  }
  return colors;
}

function hypnotoad(ox,oy,pointCount){
  var vertices = [];
  var a = Math.random();
  var b = Math.random();
  var c = Math.random();
  var inc = 2*Math.PI / pointCount;
  for (var t = 0; t <2*Math.PI; t += inc){
    vertices.push(vec2((a - b)*Math.cos(t) + c*Math.cos((a/b -1)*t), (a - b)*Math.sin(t) - c*Math.sin((a/b -1)*t)));
  }
  return vertices;
}

function epitrogdor(ox,oy,pointCount){
  var vertices = [];
  var a = Math.random();
  var b = Math.random();
  var c = Math.random();
  var inc = 2*Math.PI / pointCount;
  for (var t = 0; t <2*Math.PI; t += inc){
    vertices.push(vec2((a + b)*Math.cos(t) - c*Math.cos((a/b + 1)*t), (a + b)*Math.sin(t) - c*Math.sin((a/b + 1)*t)));
  }
  return vertices;
}

function epicycloid(ox,oy,pointCount){
  var vertices = [];
  var a = Math.random();
  var b = Math.random();
  var c = Math.random();
  var inc = 2*Math.PI / pointCount;
  for (var t = 0; t <2*Math.PI; t += inc){
    vertices.push(vec2((a + b)*Math.cos(t) - b*Math.cos((a/b + 1)*t), (a + b)*Math.sin(t) - b*Math.sin((a/b + 1)*t)));
  }
  return vertices;
}
