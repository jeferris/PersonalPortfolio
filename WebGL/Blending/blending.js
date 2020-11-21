/* 
 * Jessie Ferris
 * CS 535
 * Project #6
 * Description: This program displays a series of U.S. presidents. There 
 *              are three frames on the walls and the style of frame can 
 *              be switched between 4 options using the menu on the side.
 *              The photos of the presidents can be rotated left or right 
 *              to display photos in a circular fashion using the buttons.
 */

"use strict"

var canvas;
var gl;
var program;

var floorCoord = [
    vec4( 500 + Math.sqrt(3)*400, 0, 100, 1 ),
    vec4( 500 + Math.sqrt(3)*200, 0, 300, 1 ),
    vec4( 100 + Math.sqrt(3)*200, 0, 300, 1 ),
    vec4( 100, 0, 100, 1 ),
    vec4( 500 + Math.sqrt(3)*400, 0, -200, 1),
    vec4( 100, 0, -200, 1 )
];

var wallCoord = [
    vec4( 500 + Math.sqrt(3)*400, 0, 100, 1 ),
    vec4( 500 + Math.sqrt(3)*400, 600, 100, 1 ),
    vec4( 500 + Math.sqrt(3)*200, 600, 300, 1 ),
    vec4( 500 + Math.sqrt(3)*200, 0, 300, 1 ),
    vec4( 100 + Math.sqrt(3)*200, 600, 300, 1 ),
    vec4( 100 + Math.sqrt(3)*200, 0, 300, 1 ),
    vec4( 100, 600, 100, 1 ),
    vec4( 100, 0, 100, 1 )
];

var frameCoord = [
    vec4( 500 + Math.sqrt(3)*200 + Math.sqrt(3)*175, 220,  50 - 0.1, 1 ),
    vec4( 500 + Math.sqrt(3)*200 + Math.sqrt(3)*175, 520,  50 - 0.1, 1 ),
    vec4( 500 + Math.sqrt(3)*200 + Math.sqrt(3)*25,  520, 150 - 0.1, 1 ),
    vec4( 500 + Math.sqrt(3)*200 + Math.sqrt(3)*25,  220, 150 - 0.1, 1 ),

    vec4( 450 + Math.sqrt(3)*200, 220, 199.9, 1 ),
    vec4( 450 + Math.sqrt(3)*200, 520, 199.9, 1 ),
    vec4( 150 + Math.sqrt(3)*200, 520, 199.9, 1 ),
    vec4( 150 + Math.sqrt(3)*200, 220, 199.9, 1 ),

    vec4( 100 + Math.sqrt(3)*175, 220, 150 - 0.1, 1 ),
    vec4( 100 + Math.sqrt(3)*175, 520, 150 - 0.1, 1 ),
    vec4( 100 + Math.sqrt(3)*25,  520,  50 - 0.1, 1 ),
    vec4( 100 + Math.sqrt(3)*25,  220,  50 - 0.1, 1 )
];

var crownCoord = [
    vec4( 500 + Math.sqrt(3)*400 - 0.1,  0, 100, 1 ),
    vec4( 500 + Math.sqrt(3)*400 - 0.1, 100, 100, 1 ),
    vec4( 500 + Math.sqrt(3)*200,       100, 300 - 0.1, 1 ),
    vec4( 500 + Math.sqrt(3)*200,        0, 300 - 0.1, 1 ),
    vec4( 100 + Math.sqrt(3)*200,       100, 300 - 0.1, 1 ),
    vec4( 100 + Math.sqrt(3)*200,        0, 300 - 0.1, 1 ),
    vec4( 100 + 0.1, 100, 100, 1 ),
    vec4( 100 + 0.1, 0, 100, 1 ),

    vec4( 500 + Math.sqrt(3)*400 - 0.1, 500, 100, 1 ),
    vec4( 500 + Math.sqrt(3)*400 - 0.1, 600, 100, 1 ),
    vec4( 500 + Math.sqrt(3)*200,       600, 300 - 0.1, 1 ),
    vec4( 500 + Math.sqrt(3)*200,       500, 300 - 0.1, 1 ),
    vec4( 100 + Math.sqrt(3)*200,       600, 300 - 0.1, 1 ),
    vec4( 100 + Math.sqrt(3)*200,       500, 300 - 0.1, 1 ),
    vec4( 100 + 0.1, 600, 100, 1 ),
    vec4( 100 + 0.1, 500, 100, 1 ),

    vec4( 500 + Math.sqrt(3)*400 - 0.1, 100, 100, 1 ),
    vec4( 500 + Math.sqrt(3)*400 - 0.1, 200, 100, 1 ),
    vec4( 500 + Math.sqrt(3)*200,       200, 300 - 0.1, 1 ),
    vec4( 500 + Math.sqrt(3)*200,       100, 300 - 0.1, 1 ),
    vec4( 100 + Math.sqrt(3)*200,       200, 300 - 0.1, 1 ),
    vec4( 100 + Math.sqrt(3)*200,       100, 300 - 0.1, 1 ),
    vec4( 100 + 0.1, 200, 100, 1 ),
    vec4( 100 + 0.1, 100, 100, 1 )
];

var view = vec3( 300 + Math.sqrt(3)*200, 300, -725 );
var at   = vec3( 300 + Math.sqrt(3)*200, 300, 100 );
var up   = vec3( 0.0, 1.0, 0.0 );

var projectionMatrixLoc, projectionMatrix; // projection matrix
var viewMatrixLoc, viewMatrix;             // view matrix

var aspect;

var near = 1.0;
var far  = 1500.0;
var fovy = 45.0;

var floorPointsArray = []; 
var floorTexCoordsArray = [];

var wallPointsArray = []; 
var wallTexCoordsArray = [];

var framePointsArray = [];
var frameTexCoordsArray = [];

var crownPointsArray = [];
var crownTexCoordsArray = [];

var vPosition, vBuffer;
var vTexCoord, tBuffer;

var floorTexture, wallTexture, wallTexture1, crownTopTexture, crownBottomTexture;
var frameTexture = [];
var presidentsTexture = [];

var frameIndex = 0;
var picIndex = 0;

var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0)
];

// Sets Up Textures
function configureTexture( image ) {
    var texture = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texture );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image );
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);  
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    
    return texture;
}

// Adds to the Points and Texture Coordinates for a Quadrilateral
function createArea(bl, tl, tr, br, points, textureC) {
    points.push( bl );
    points.push( tl );
    points.push( tr );
    points.push( br );

    textureC.push( texCoord[0] );
    textureC.push( texCoord[1] );
    textureC.push( texCoord[2] );
    textureC.push( texCoord[3] );
}

window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

    gl.disable(gl.DEPTH_TEST);

    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    aspect = canvas.width / canvas.height;

    // Event Handlers
    var frame_menu = document.getElementById("frame_menu");
    frame_menu.selectedIndex = frameIndex;
    frame_menu.addEventListener("click", function() {
       frameIndex = frame_menu.selectedIndex;
    });

    var leftF = document.getElementById("left");
    leftF.addEventListener("click", function() {
        picIndex = (picIndex + 1) % presidentsTexture.length;
    });

    var rightF = document.getElementById("right");
    rightF.addEventListener("click", function() {
            if ( picIndex == 0 ) picIndex = presidentsTexture.length - 1; 
            else picIndex--;
    });

    // Floor Areas
    createArea( floorCoord[0], floorCoord[1], floorCoord[2], floorCoord[3], floorPointsArray, floorTexCoordsArray );
    createArea( floorCoord[4], floorCoord[0], floorCoord[3], floorCoord[5], floorPointsArray, floorTexCoordsArray );
  
    // Right Inside Wall Areas
    createArea( wallCoord[0], wallCoord[1], wallCoord[2], wallCoord[3], wallPointsArray, wallTexCoordsArray );
    createArea( wallCoord[3], wallCoord[2], wallCoord[4], wallCoord[5], wallPointsArray, wallTexCoordsArray );
    createArea( wallCoord[5], wallCoord[4], wallCoord[6], wallCoord[7], wallPointsArray, wallTexCoordsArray );

    // Frames
    createArea( frameCoord[0], frameCoord[1], frameCoord[2], frameCoord[3], framePointsArray, frameTexCoordsArray );
    createArea( frameCoord[4], frameCoord[5], frameCoord[6], frameCoord[7], framePointsArray, frameTexCoordsArray );
    createArea( frameCoord[8], frameCoord[9], frameCoord[10], frameCoord[11], framePointsArray, frameTexCoordsArray );
    
    // Crown Molding
    createArea( crownCoord[0], crownCoord[1], crownCoord[2], crownCoord[3], crownPointsArray, crownTexCoordsArray );
    createArea( crownCoord[3], crownCoord[2], crownCoord[4], crownCoord[5], crownPointsArray, crownTexCoordsArray );
    createArea( crownCoord[5], crownCoord[4], crownCoord[6], crownCoord[7], crownPointsArray, crownTexCoordsArray );
    createArea( crownCoord[8], crownCoord[9], crownCoord[10], crownCoord[11], crownPointsArray, crownTexCoordsArray );
    createArea( crownCoord[11], crownCoord[10], crownCoord[12], crownCoord[13], crownPointsArray, crownTexCoordsArray );
    createArea( crownCoord[13], crownCoord[12], crownCoord[14], crownCoord[15], crownPointsArray, crownTexCoordsArray );
    createArea( crownCoord[16], crownCoord[17], crownCoord[18], crownCoord[19], crownPointsArray, crownTexCoordsArray );
    createArea( crownCoord[19], crownCoord[18], crownCoord[20], crownCoord[21], crownPointsArray, crownTexCoordsArray );
    createArea( crownCoord[21], crownCoord[20], crownCoord[22], crownCoord[23], crownPointsArray, crownTexCoordsArray );

    // Create Buffers & Get Attribute Locations
    vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    
    vPosition = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    
    vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vTexCoord );

    // Load Textures
    var floorImg = document.getElementById("floorImg");
    floorTexture = configureTexture(floorImg);

    var wallImg = document.getElementById("wallImg");
    wallTexture = configureTexture(wallImg);

    var wallImg1 = document.getElementById("wallImg1");
    wallTexture1 = configureTexture(wallImg1);

    var frame1 = document.getElementById("frame1");
    frameTexture.push( configureTexture(frame1) );

    var frame2 = document.getElementById("frame2");
    frameTexture.push( configureTexture(frame2) );

    var frame3 = document.getElementById("frame3");
    frameTexture.push( configureTexture(frame3) );

    var frame4 = document.getElementById("frame4");
    frameTexture.push( configureTexture(frame4) );

    var pres1 = document.getElementById("pres1");
    presidentsTexture.push( configureTexture(pres1) );

    var pres2 = document.getElementById("pres2");
    presidentsTexture.push( configureTexture(pres2) );

    var pres3 = document.getElementById("pres3");
    presidentsTexture.push( configureTexture(pres3) );

    var pres4 = document.getElementById("pres4");
    presidentsTexture.push( configureTexture(pres4) );

    var pres5 = document.getElementById("pres5");
    presidentsTexture.push( configureTexture(pres5) );

    var pres6 = document.getElementById("pres6");
    presidentsTexture.push( configureTexture(pres6) );

    var pres7 = document.getElementById("pres7");
    presidentsTexture.push( configureTexture(pres7) );

    var pres8 = document.getElementById("pres8");
    presidentsTexture.push( configureTexture(pres8) );

    var pres9 = document.getElementById("pres9");
    presidentsTexture.push( configureTexture(pres9) );

    var pres10 = document.getElementById("pres10");
    presidentsTexture.push( configureTexture(pres10) );

    var crownTop = document.getElementById("crownTop");
    crownTopTexture = configureTexture(crownTop);

    var crownBottom = document.getElementById("crownBottom");
    crownBottomTexture = configureTexture(crownBottom);

    // Uniforms for Shaders
    gl.uniform1i( gl.getUniformLocation(program, "texture"), 0 );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );
    viewMatrixLoc = gl.getUniformLocation( program, "viewMatrix" );

    render();
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    viewMatrix = lookAt( view, at, up );
    projectionMatrix = perspective(fovy, aspect, near, far);

    gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );
    gl.uniformMatrix4fv( viewMatrixLoc, false, flatten(viewMatrix) );

    gl.disable(gl.BLEND);

    // Draw the floor
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(floorPointsArray), gl.STATIC_DRAW );
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(floorTexCoordsArray), gl.STATIC_DRAW );
    
    gl.bindTexture( gl.TEXTURE_2D, floorTexture );
    for ( var i = 0; i < floorPointsArray.length; i += 4 ) {
        gl.drawArrays( gl.TRIANGLE_FAN, i, 4 );
    }

    // Draw the inside of the walls
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(wallPointsArray), gl.STATIC_DRAW );
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(wallTexCoordsArray), gl.STATIC_DRAW );
    
    gl.bindTexture( gl.TEXTURE_2D, wallTexture1 );
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );
    gl.bindTexture( gl.TEXTURE_2D, wallTexture );
    gl.drawArrays( gl.TRIANGLE_FAN, 4, 4 );
    gl.bindTexture( gl.TEXTURE_2D, wallTexture1 );
    gl.drawArrays( gl.TRIANGLE_FAN, 8, 4 );

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA );
    
    // Draw the crown molding
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(crownPointsArray), gl.STATIC_DRAW );
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(crownTexCoordsArray), gl.STATIC_DRAW );

    gl.bindTexture( gl.TEXTURE_2D, crownBottomTexture );
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );
    gl.drawArrays( gl.TRIANGLE_FAN, 4, 4 );
    gl.drawArrays( gl.TRIANGLE_FAN, 8, 4 );
    gl.bindTexture( gl.TEXTURE_2D, crownTopTexture );
    for ( var i = 12; i < crownPointsArray.length; i += 4 ) {
        gl.drawArrays( gl.TRIANGLE_FAN, i, 4 );
    }

    // Draw the president photos and then the frames on the walls
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(framePointsArray), gl.STATIC_DRAW );
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(frameTexCoordsArray), gl.STATIC_DRAW );

    gl.bindTexture( gl.TEXTURE_2D, presidentsTexture[picIndex] );
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );
    gl.bindTexture( gl.TEXTURE_2D, presidentsTexture[(picIndex+1)%presidentsTexture.length] );
    gl.drawArrays( gl.TRIANGLE_FAN, 4, 4 );
    gl.bindTexture( gl.TEXTURE_2D, presidentsTexture[(picIndex+2)%presidentsTexture.length] );
    gl.drawArrays( gl.TRIANGLE_FAN, 8, 4 );
    
    gl.bindTexture( gl.TEXTURE_2D, frameTexture[frameIndex] );
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );
    gl.drawArrays( gl.TRIANGLE_FAN, 4, 4 );
    gl.drawArrays( gl.TRIANGLE_FAN, 8, 4 );

    requestAnimFrame(render);
}