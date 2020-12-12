/* 
 * This project makes use of functionality provided by
 * Ed Angel and Dave Shreiner. A copy of the license can
 * be found in the WebGL directory which is the parent 
 * directory of this one. The original source for these files
 * can be found at: https://www.cs.unm.edu/~angel/WebGL/7E/Common/. 
 */

 /* 
 * Jessie Ferris
 * jeferris@crimson.ua.edu
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
    vec4( 100, 0, 100, 1 ), // 0
    vec4( 100, 0, 300, 1 ), // 1
    vec4( 100, 0, 500, 1 ), // 2
    vec4( 300, 0, 500, 1 ), // 3
    vec4( 300, 0, 300, 1 ), // 4
    vec4( 300, 0, 100, 1 ), // 5
    vec4( 500, 0, 100, 1 ), // 6
    vec4( 500, 0, 300, 1 ), // 7
    vec4( 500, 0, 500, 1 )  // 8
];

var wallInCoord = [
    vec4( 100,   0, 100, 1 ), // 0 right wall
    vec4( 100, 200, 100, 1 ), // 1 right wall
    vec4( 100, 200, 300, 1 ), // 2 right wall
    vec4( 100,   0, 300, 1 ), // 3 right wall
    vec4( 100,   0, 500, 1 ), // 4 right wall && 0 back wall
    vec4( 100, 200, 500, 1 ), // 5 right wall && 1 back wall
    vec4( 300, 200, 500, 1 ), // 2 back wall
    vec4( 300,   0, 500, 1 ), // 3 back wall
    vec4( 500,   0, 500, 1 ), // 4 back wall && 4 left wall
    vec4( 500, 200, 500, 1 ), // 5 back wall && 5 left wall
    vec4( 500,   0, 100, 1 ), // 0 left wall
    vec4( 500, 200, 100, 1 ), // 1 left wall
    vec4( 500, 200, 300, 1 ), // 2 left wall
    vec4( 500,   0, 300, 1 ),  // 3 left wall

    vec4( 100, 200, 100, 1 ), // 0 right wall 2
    vec4( 100, 400, 100, 1 ), // 1 right wall 2
    vec4( 100, 400, 300, 1 ), // 2 right wall 2
    vec4( 100, 200, 300, 1 ), // 3 right wall 2
    vec4( 100, 200, 500, 1 ), // 4 right wall 2 && 0 back wall 2
    vec4( 100, 400, 500, 1 ), // 5 right wall 2 && 1 back wall 2
    vec4( 300, 400, 500, 1 ), // 2 back wall 2
    vec4( 300, 200, 500, 1 ), // 3 back wall 2
    vec4( 500, 200, 500, 1 ), // 4 back wall 2 && 4 left wall 2
    vec4( 500, 400, 500, 1 ), // 5 back wall 2 && 5 left wall 2
    vec4( 500, 200, 100, 1 ), // 0 left wall 2
    vec4( 500, 400, 100, 1 ), // 1 left wall 2
    vec4( 500, 400, 300, 1 ), // 2 left wall 2
    vec4( 500, 200, 300, 1 )  // 3 left wall 2
];

var wallOutCoord = [
    vec4(  99.9,   0, 100.0, 1 ), // 0 right wall 
    vec4(  99.9, 200, 100.0, 1 ), // 1 right wall  
    vec4(  99.9, 200, 300.0, 1 ), // 2 right wall 
    vec4(  99.9,   0, 300.0, 1 ), // 3 right wall 
    vec4(  99.9,   0, 500.1, 1 ), // 4 right wall && 0 back wall 
    vec4(  99.9, 200, 500.1, 1 ), // 5 right wall && 1 back wall 
    vec4( 300.0, 200, 500.1, 1 ), // 2 back wall
    vec4( 300.0,   0, 500.1, 1 ), // 3 back wall
    vec4( 500.1,   0, 500.1, 1 ), // 4 back wall && 4 left wall
    vec4( 500.1, 200, 500.1, 1 ), // 5 back wall && 5 left wall
    vec4( 500.1,   0, 100.0, 1 ), // 0 left wall
    vec4( 500.1, 200, 100.0, 1 ), // 1 left wall
    vec4( 500.1, 200, 300.0, 1 ), // 2 left wall
    vec4( 500.1,   0, 300.0, 1 ),  // 3 left wall

    vec4(  99.9, 200, 100.0, 1 ), // 0 right wall 
    vec4(  99.9, 400, 100.0, 1 ), // 1 right wall  
    vec4(  99.9, 400, 300.0, 1 ), // 2 right wall 
    vec4(  99.9, 200, 300.0, 1 ), // 3 right wall 
    vec4(  99.9, 200, 500.1, 1 ), // 4 right wall && 0 back wall 
    vec4(  99.9, 400, 500.1, 1 ), // 5 right wall && 1 back wall 
    vec4( 300.0, 400, 500.1, 1 ), // 2 back wall
    vec4( 300.0, 200, 500.1, 1 ), // 3 back wall
    vec4( 500.1, 200, 500.1, 1 ), // 4 back wall && 4 left wall
    vec4( 500.1, 400, 500.1, 1 ), // 5 back wall && 5 left wall
    vec4( 500.1, 200, 100.0, 1 ), // 0 left wall
    vec4( 500.1, 400, 100.0, 1 ), // 1 left wall
    vec4( 500.1, 400, 300.0, 1 ), // 2 left wall
    vec4( 500.1, 200, 300.0, 1 )  // 3 left wall
];

var tableCoord = [
    vec4( 390, 0.1, 200, 1 ), // left front leg bottom 0
    vec4( 390, 0.1, 210, 1 ), // left front leg bottom 1
    vec4( 400, 0.1, 210, 1 ), // left front leg bottom 2
    vec4( 400, 0.1, 200, 1 ), // left front leg bottom 3
    vec4( 390, 0.1, 390, 1 ), // left back leg bottom 0
    vec4( 390, 0.1, 400, 1 ), // left back leg bottom 1
    vec4( 400, 0.1, 400, 1 ), // left back leg bottom 2
    vec4( 400, 0.1, 390, 1 ), // left back leg bottom 3
    vec4( 200, 0.1, 200, 1 ), // right front leg bottom 0
    vec4( 200, 0.1, 210, 1 ), // right front leg bottom 1
    vec4( 210, 0.1, 210, 1 ), // right front leg bottom 2
    vec4( 210, 0.1, 200, 1 ), // right front leg bottom 3
    vec4( 200, 0.1, 390, 1 ), // right back leg bottom 0
    vec4( 200, 0.1, 400, 1 ), // right back leg bottom 1
    vec4( 210, 0.1, 400, 1 ), // right back leg bottom 2
    vec4( 210, 0.1, 390, 1 ), // right back leg bottom 3

    vec4( 390, 100, 200, 1 ), // left front leg top 0
    vec4( 390, 100, 210, 1 ), // left front leg top 1
    vec4( 400, 100, 210, 1 ), // left front leg top 2
    vec4( 400, 100, 200, 1 ), // left front leg top 3
    vec4( 390, 100, 390, 1 ), // left back leg top 0
    vec4( 390, 100, 400, 1 ), // left back leg top 1
    vec4( 400, 100, 400, 1 ), // left back leg top 2
    vec4( 400, 100, 390, 1 ), // left back leg top 3
    vec4( 200, 100, 200, 1 ), // right front leg top 0
    vec4( 200, 100, 210, 1 ), // right front leg top 1
    vec4( 210, 100, 210, 1 ), // right front leg top 2
    vec4( 210, 100, 200, 1 ), // right front leg top 3
    vec4( 200, 100, 390, 1 ), // right back leg top 0
    vec4( 200, 100, 400, 1 ), // right back leg top 1
    vec4( 210, 100, 400, 1 ), // right back leg top 2
    vec4( 210, 100, 390, 1 ), // right back leg top 3
    
    vec4( 190, 100, 190, 1 ), // front surface 0
    vec4( 190, 110, 190, 1 ), // front surface 1
    vec4( 410, 110, 190, 1 ), // front surface 2
    vec4( 410, 100, 190, 1 ), // front surface 3

    vec4( 410, 100, 190, 1 ), // left surface 0
    vec4( 410, 100, 410, 1 ), // left surface 1
    vec4( 410, 110, 410, 1 ), // left surface 2
    vec4( 410, 110, 190, 1 ), // left surface 3

    vec4( 190, 100, 410, 1 ), // front surface 0
    vec4( 190, 110, 410, 1 ), // front surface 1
    vec4( 410, 110, 410, 1 ), // front surface 2
    vec4( 410, 100, 410, 1 ), // front surface 3

    vec4( 190, 100, 190, 1 ), // right surface 0
    vec4( 190, 100, 410, 1 ), // right surface 1
    vec4( 190, 110, 410, 1 ), // right surface 2
    vec4( 190, 110, 190, 1 ), // right surface 3

    vec4( 190, 100, 190, 1 ), // bottom surface 0
    vec4( 410, 100, 190, 1 ), // bottom surface 1
    vec4( 410, 100, 410, 1 ), // bottom surface 2
    vec4( 190, 100, 410, 1 ), // bottom surface 3

    vec4( 190, 110, 190, 1 ), // top surface 0
    vec4( 410, 110, 190, 1 ), // top surface 1
    vec4( 410, 110, 410, 1 ), // top surface 2
    vec4( 190, 110, 410, 1 )  // top surface 3
];

var pictureFrameCoord = [
    vec4( 100.1, 120.0, 355.0, 1 ), // picture1 0
    vec4( 100.1, 280.0, 355.0, 1 ), // picture1 1
    vec4( 100.1, 280.0, 195.0, 1 ), // picture1 2
    vec4( 100.1, 120.0, 195.0, 1 ), // picture1 3

    vec4( 290.0, 200.0, 499.9, 1), // picture2 0
    vec4( 290.0, 300.0, 499.9, 1), // picture2 1
    vec4( 190.0, 300.0, 499.9, 1), // picture2 2
    vec4( 190.0, 200.0, 499.9, 1), // picture2 3
    
    vec4( 410.0, 200.0, 499.9, 1), // picture3 0
    vec4( 410.0, 300.0, 499.9, 1), // picture3 1
    vec4( 310.0, 300.0, 499.9, 1), // picture3 2
    vec4( 310.0, 200.0, 499.9, 1), // picture3 3
    
    vec4( 499.9, 120.0, 195.0, 1 ), // picture4 0
    vec4( 499.9, 280.0, 195.0, 1 ), // picture4 1
    vec4( 499.9, 280.0, 355.0, 1 ), // picture4 2
    vec4( 499.9, 120.0, 355.0, 1 )  // picture4 3
];

var eFrameCoord = [
    vec4( 350, 110.1, 200, 1 ), // eFrame 0
    vec4( 350, 210.1, 215, 1 ), // eFrame 1
    vec4( 250, 210.1, 215, 1 ), // eFrame 2
    vec4( 250, 110.1, 200, 1 )  // eFrame 3  
];

var views = [ 
    vec3(  650, 200, -200 ), // Left
    vec3(  300, 200, -350 ), // Middle
    vec3(  -50, 200, -200 ), // Right
];
var view_selection = views[1]; // default

var projectionMatrixLoc, projectionMatrix; // projection matrix
var viewMatrixLoc, viewMatrix;             // view matrix

var up =  vec3( 0.0, 1.0, 0.0 );
var aspect;

var near = 1.0;
var far  = 1500.0;
var fovy = 45.0;

var floorPointsArray = []; 
var floorTexCoordsArray = [];

var wallInPointsArray = []; 
var wallInTexCoordsArray = [];

var wallOutPointsArray = []; 
var wallOutTexCoordsArray = [];

var tablePointsArray = [];
var tableTexCoordsArray = [];

var picturePointsArray = [];
var pictureTexCoordsArray = [];

var eFramePointsArray = [];
var eFrameTexCoordsArray = [];

var vPosition, vBuffer;
var vTexCoord, tBuffer;

var floorTexture, wallInTexture, wallOutTexture, woodTexture, standTexture;
var pic1Texture, pic2Texture, pic3Texture, pic4Texture;
var ePicTextures = [];

var flag = false;
var index = 0;
var time = 0;

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
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image );
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

    gl.enable(gl.DEPTH_TEST);

    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    aspect = canvas.width / canvas.height;

    // Event Handlers
    var view_left = document.getElementById("left");
    view_left.addEventListener("click", function() {
        view_selection = views[0];
    });

    var view_middle = document.getElementById("middle");
    view_middle.addEventListener("click", function() {
        view_selection = views[1];
    });

    var view_right = document.getElementById("right");
    view_right.addEventListener("click", function() {
        view_selection = views[2];
    });

    var start_anim = document.getElementById("play");
    start_anim.addEventListener("click", function() {
        document.getElementById("warning").style.display = "none";
        time = 0;
        flag = !flag;
    });

    var nextPic = document.getElementById("next");
    nextPic.addEventListener("click", function() {
        if ( flag == false ) {
            document.getElementById("warning").style.display = "none";
            index = (index + 1) % ePicTextures.length;
        }
        else {
            document.getElementById("warning").style.display = "block";
        }
    });

    var prevPic = document.getElementById("previous");
    prevPic.addEventListener("click", function() {
        if ( flag == false ) {
            document.getElementById("warning").style.display = "none";
            if ( index == 0 ) index = ePicTextures.length - 1; 
            else index--;
        }
        else {
            document.getElementById("warning").style.display = "block";
        }
        
    });

    // Floor Areas
    createArea( floorCoord[0], floorCoord[1], floorCoord[4], floorCoord[5], floorPointsArray, floorTexCoordsArray );
    createArea( floorCoord[1], floorCoord[2], floorCoord[3], floorCoord[4], floorPointsArray, floorTexCoordsArray );
    createArea( floorCoord[4], floorCoord[3], floorCoord[8], floorCoord[7], floorPointsArray, floorTexCoordsArray );
    createArea( floorCoord[5], floorCoord[4], floorCoord[7], floorCoord[6], floorPointsArray, floorTexCoordsArray );
    
    // Right Inside Wall Areas
    createArea( wallInCoord[0], wallInCoord[1], wallInCoord[2], wallInCoord[3], wallInPointsArray, wallInTexCoordsArray );
    createArea( wallInCoord[3], wallInCoord[2], wallInCoord[5], wallInCoord[4], wallInPointsArray, wallInTexCoordsArray );
    createArea( wallInCoord[14], wallInCoord[15], wallInCoord[16], wallInCoord[17], wallInPointsArray, wallInTexCoordsArray );
    createArea( wallInCoord[17], wallInCoord[16], wallInCoord[19], wallInCoord[18], wallInPointsArray, wallInTexCoordsArray );

    // Back Inside Wall Areas
    createArea( wallInCoord[4], wallInCoord[5], wallInCoord[6], wallInCoord[7], wallInPointsArray, wallInTexCoordsArray );
    createArea( wallInCoord[7], wallInCoord[6], wallInCoord[9], wallInCoord[8], wallInPointsArray, wallInTexCoordsArray );
    createArea( wallInCoord[18], wallInCoord[19], wallInCoord[20], wallInCoord[21], wallInPointsArray, wallInTexCoordsArray );
    createArea( wallInCoord[21], wallInCoord[20], wallInCoord[23], wallInCoord[22], wallInPointsArray, wallInTexCoordsArray );

    // Left Inside Wall Areas
    createArea( wallInCoord[10], wallInCoord[11], wallInCoord[12], wallInCoord[13], wallInPointsArray, wallInTexCoordsArray );
    createArea( wallInCoord[13], wallInCoord[12], wallInCoord[9], wallInCoord[8], wallInPointsArray, wallInTexCoordsArray );
    createArea( wallInCoord[24], wallInCoord[25], wallInCoord[26], wallInCoord[27], wallInPointsArray, wallInTexCoordsArray );
    createArea( wallInCoord[27], wallInCoord[26], wallInCoord[23], wallInCoord[22], wallInPointsArray, wallInTexCoordsArray );
    
    // Right Outside Wall Areas
    createArea( wallOutCoord[4], wallOutCoord[5], wallOutCoord[2], wallOutCoord[3], wallOutPointsArray, wallOutTexCoordsArray );
    createArea( wallOutCoord[0], wallOutCoord[1], wallOutCoord[2], wallOutCoord[3], wallOutPointsArray, wallOutTexCoordsArray );
    createArea( wallOutCoord[19], wallOutCoord[18], wallOutCoord[17], wallOutCoord[16], wallOutPointsArray, wallOutTexCoordsArray );
    createArea( wallOutCoord[15], wallOutCoord[14], wallOutCoord[17], wallOutCoord[16], wallOutPointsArray, wallOutTexCoordsArray );

    // Back Outside Wall Areas
    createArea( wallOutCoord[8], wallOutCoord[9], wallOutCoord[6], wallOutCoord[7], wallOutPointsArray, wallOutTexCoordsArray );
    createArea( wallOutCoord[4], wallOutCoord[5], wallOutCoord[6], wallOutCoord[7], wallOutPointsArray, wallOutTexCoordsArray );
    createArea( wallOutCoord[23], wallOutCoord[22], wallOutCoord[21], wallOutCoord[20], wallOutPointsArray, wallOutTexCoordsArray );
    createArea( wallOutCoord[19], wallOutCoord[18], wallOutCoord[21], wallOutCoord[20], wallOutPointsArray, wallOutTexCoordsArray );

    // Left Outside Wall Areas
    createArea( wallOutCoord[10], wallOutCoord[11], wallOutCoord[12], wallOutCoord[13], wallOutPointsArray, wallOutTexCoordsArray );
    createArea( wallOutCoord[8], wallOutCoord[9], wallOutCoord[12], wallOutCoord[13], wallOutPointsArray, wallOutTexCoordsArray );
    createArea( wallOutCoord[25], wallOutCoord[24], wallOutCoord[27], wallOutCoord[26], wallOutPointsArray, wallOutTexCoordsArray );
    createArea( wallOutCoord[23], wallOutCoord[22], wallOutCoord[27], wallOutCoord[26], wallOutPointsArray, wallOutTexCoordsArray );

    // Table Leg Bottom
    createArea( tableCoord[0], tableCoord[1], tableCoord[2], tableCoord[3], tablePointsArray, tableTexCoordsArray );
    createArea( tableCoord[4], tableCoord[5], tableCoord[6], tableCoord[7], tablePointsArray, tableTexCoordsArray );
    createArea( tableCoord[8], tableCoord[9], tableCoord[10], tableCoord[11], tablePointsArray, tableTexCoordsArray );
    createArea( tableCoord[12], tableCoord[13], tableCoord[14], tableCoord[15], tablePointsArray, tableTexCoordsArray );

    // Table Leg Top
    createArea( tableCoord[16], tableCoord[17], tableCoord[18], tableCoord[19], tablePointsArray, tableTexCoordsArray );
    createArea( tableCoord[20], tableCoord[21], tableCoord[22], tableCoord[23], tablePointsArray, tableTexCoordsArray );
    createArea( tableCoord[24], tableCoord[25], tableCoord[26], tableCoord[27], tablePointsArray, tableTexCoordsArray );
    createArea( tableCoord[28], tableCoord[29], tableCoord[30], tableCoord[31], tablePointsArray, tableTexCoordsArray );

    // Table Leg Front Left Sides
    createArea( tableCoord[1], tableCoord[17], tableCoord[16], tableCoord[0], tablePointsArray, tableTexCoordsArray );
    createArea( tableCoord[3], tableCoord[19], tableCoord[18], tableCoord[2], tablePointsArray, tableTexCoordsArray );
    createArea( tableCoord[2], tableCoord[18], tableCoord[17], tableCoord[1], tablePointsArray, tableTexCoordsArray );
    createArea( tableCoord[3], tableCoord[19], tableCoord[16], tableCoord[0], tablePointsArray, tableTexCoordsArray );
    
    // Table Leg Back Left Sides
    createArea( tableCoord[5], tableCoord[21], tableCoord[20], tableCoord[4], tablePointsArray, tableTexCoordsArray );
    createArea( tableCoord[7], tableCoord[23], tableCoord[22], tableCoord[6], tablePointsArray, tableTexCoordsArray );
    createArea( tableCoord[6], tableCoord[22], tableCoord[21], tableCoord[5], tablePointsArray, tableTexCoordsArray );
    createArea( tableCoord[7], tableCoord[23], tableCoord[20], tableCoord[4], tablePointsArray, tableTexCoordsArray );

    // Table Leg Front Right Sides
    createArea( tableCoord[9], tableCoord[25], tableCoord[24], tableCoord[8], tablePointsArray, tableTexCoordsArray );
    createArea( tableCoord[11], tableCoord[27], tableCoord[26], tableCoord[10], tablePointsArray, tableTexCoordsArray );
    createArea( tableCoord[10], tableCoord[26], tableCoord[25], tableCoord[9], tablePointsArray, tableTexCoordsArray );
    createArea( tableCoord[11], tableCoord[27], tableCoord[24], tableCoord[8], tablePointsArray, tableTexCoordsArray );

    // Table Leg Back Right Sides
    createArea( tableCoord[13], tableCoord[29], tableCoord[28], tableCoord[12], tablePointsArray, tableTexCoordsArray );
    createArea( tableCoord[15], tableCoord[31], tableCoord[30], tableCoord[14], tablePointsArray, tableTexCoordsArray );
    createArea( tableCoord[14], tableCoord[30], tableCoord[29], tableCoord[13], tablePointsArray, tableTexCoordsArray );
    createArea( tableCoord[15], tableCoord[31], tableCoord[28], tableCoord[12], tablePointsArray, tableTexCoordsArray );

    // Table Top
    createArea( tableCoord[32], tableCoord[33], tableCoord[34], tableCoord[35], tablePointsArray, tableTexCoordsArray );
    createArea( tableCoord[36], tableCoord[37], tableCoord[38], tableCoord[39], tablePointsArray, tableTexCoordsArray );
    createArea( tableCoord[40], tableCoord[41], tableCoord[42], tableCoord[43], tablePointsArray, tableTexCoordsArray );
    createArea( tableCoord[44], tableCoord[45], tableCoord[46], tableCoord[47], tablePointsArray, tableTexCoordsArray );
    createArea( tableCoord[48], tableCoord[49], tableCoord[50], tableCoord[51], tablePointsArray, tableTexCoordsArray );
    createArea( tableCoord[52], tableCoord[53], tableCoord[54], tableCoord[55], tablePointsArray, tableTexCoordsArray );

    // Pictures on Walls
    createArea( pictureFrameCoord[0], pictureFrameCoord[1], pictureFrameCoord[2], pictureFrameCoord[3], picturePointsArray, pictureTexCoordsArray );
    createArea( pictureFrameCoord[4], pictureFrameCoord[5], pictureFrameCoord[6], pictureFrameCoord[7], picturePointsArray, pictureTexCoordsArray );
    createArea( pictureFrameCoord[8], pictureFrameCoord[9], pictureFrameCoord[10], pictureFrameCoord[11], picturePointsArray, pictureTexCoordsArray );
    createArea( pictureFrameCoord[12], pictureFrameCoord[13], pictureFrameCoord[14], pictureFrameCoord[15], picturePointsArray, pictureTexCoordsArray );

    // Electronic Pictures on Desk
    createArea( eFrameCoord[0], eFrameCoord[1], eFrameCoord[2], eFrameCoord[3], eFramePointsArray, eFrameTexCoordsArray );
    
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

    var wallInImg = document.getElementById("wallInImg");
    wallInTexture = configureTexture(wallInImg);

    var wallOutImg = document.getElementById("wallOutImg");
    wallOutTexture = configureTexture(wallOutImg);

    var woodImg = document.getElementById("woodImg");
    woodTexture = configureTexture(woodImg);

    var pic1Img = document.getElementById("pic1Img");
    pic1Texture = configureTexture(pic1Img);

    var pic2Img = document.getElementById("pic2Img");
    pic2Texture = configureTexture(pic2Img);

    var pic3Img = document.getElementById("pic3Img");
    pic3Texture = configureTexture(pic3Img);

    var pic4Img = document.getElementById("pic4Img");
    pic4Texture = configureTexture(pic4Img);

    var ePic1Img = document.getElementById("ePhoto1Img");
    ePicTextures.push(configureTexture(ePic1Img));

    var ePic2Img = document.getElementById("ePhoto2Img");
    ePicTextures.push(configureTexture(ePic2Img));

    var ePic3Img = document.getElementById("ePhoto3Img");
    ePicTextures.push(configureTexture(ePic3Img));

    var ePic4Img = document.getElementById("ePhoto4Img");
    ePicTextures.push(configureTexture(ePic4Img));

    // Uniforms for Shaders
    gl.uniform1i( gl.getUniformLocation(program, "texture"), 0 );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );
    viewMatrixLoc = gl.getUniformLocation( program, "viewMatrix" );

    render();
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    viewMatrix = lookAt( view_selection, vec3( 300, 200, 300 ), up );
    projectionMatrix = perspective(fovy, aspect, near, far);

    gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );
    gl.uniformMatrix4fv( viewMatrixLoc, false, flatten(viewMatrix) );
    
    // Animation for frame on the desk
    if ( flag == true ) {
        if ( time == 98 ) {
            index = (index + 1) % ePicTextures.length;
            time = 0;
        }
        time++;
    }

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
    gl.bufferData( gl.ARRAY_BUFFER, flatten(wallInPointsArray), gl.STATIC_DRAW );
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(wallInTexCoordsArray), gl.STATIC_DRAW );
    gl.bindTexture( gl.TEXTURE_2D, wallInTexture );
    for ( var i = 0; i < wallInPointsArray.length; i += 4 ) {
        gl.drawArrays( gl.TRIANGLE_FAN, i, 4 );
    }

    // Draw the outside of the walls
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(wallOutPointsArray), gl.STATIC_DRAW );
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(wallOutTexCoordsArray), gl.STATIC_DRAW );
    gl.bindTexture( gl.TEXTURE_2D, wallOutTexture );
    for ( var i = 0; i < wallOutPointsArray.length; i += 4 ) {
        gl.drawArrays( gl.TRIANGLE_FAN, i, 4 );
    }

    // Draw the table
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(tablePointsArray), gl.STATIC_DRAW );
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(tableTexCoordsArray), gl.STATIC_DRAW );
    gl.bindTexture( gl.TEXTURE_2D, woodTexture );
    for ( var i = 0; i < tablePointsArray.length; i += 4 ) {
        gl.drawArrays( gl.TRIANGLE_FAN, i, 4 );
    }

    // Draw the pictures on the wall
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(picturePointsArray), gl.STATIC_DRAW );
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pictureTexCoordsArray), gl.STATIC_DRAW );

    gl.bindTexture( gl.TEXTURE_2D, pic1Texture );
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );

    gl.bindTexture( gl.TEXTURE_2D, pic2Texture );
    gl.drawArrays( gl.TRIANGLE_FAN, 4, 4 );

    gl.bindTexture( gl.TEXTURE_2D, pic3Texture );
    gl.drawArrays( gl.TRIANGLE_FAN, 8, 4 );

    gl.bindTexture( gl.TEXTURE_2D, pic4Texture );
    gl.drawArrays( gl.TRIANGLE_FAN, 12, 4 );

    // Draw the electronic picture frame
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(eFramePointsArray), gl.STATIC_DRAW );
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(eFrameTexCoordsArray), gl.STATIC_DRAW );

    gl.bindTexture( gl.TEXTURE_2D, ePicTextures[index] );
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );
    
    requestAnimFrame(render);
}