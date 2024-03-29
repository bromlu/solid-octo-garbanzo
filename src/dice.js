import { imgs } from "./load";

const faceCoords = [
  { x: 0, y: Math.PI / -2},
  { x: 0, y: Math.PI / 2 },
  { x: Math.PI / 2, y: 0 },
  { x: Math.PI / -2, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: Math.PI },
]

export class Dice {
  constructor(faces, colors) {
    this.x = 0;
    this.y = 0;
    this.face = "";
    this.color = "";
    this.faceIdx = 0;
    this.faces = faces;
    this.colors = colors;
    this.resolved = false;
    this.done = true; //externally controlled
    this.canvas = document.createElement("canvas");
    document.body.appendChild(this.canvas)
    this.canvas.classList.add("gone")
    var gl = this.canvas.getContext("webgl");
    this.gl = gl;
    if (!gl) {
      console.error("no webgl :(");
    }
    // setup GLSL program
    this.program = webglUtils.createProgramFromScripts(gl, ["vertex-shader-3d", "fragment-shader-3d"]);
    
    // look up where the vertex data needs to go.
    this.positionLocation = gl.getAttribLocation(this.program, "a_position");

    // lookup uniforms
    this.matrixLocation = gl.getUniformLocation(this.program, "u_matrix");
    this.textureLocation = gl.getUniformLocation(this.program, "u_texture");

    // Create a buffer for positions
    this.positionBuffer = gl.createBuffer();
    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    // Put the positions in the buffer
    setGeometry(gl);

    // Create a texture.
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);


    
    this.mapFaces(faces, colors)

    this.fieldOfViewRadians = degToRad(1);
    this.rotX = degToRad(0);
    this.rotY = degToRad(0);

    this.rotXTarget = Math.PI / 4 + Math.PI/2 * Math.floor((Math.random() * 3));
    this.rotYTarget = Math.PI / 4 + Math.PI/2 * Math.floor((Math.random() * 3));
    this.rotXVel = .001;
    this.rotYVel = .001;
    this.rollStopTime = 0
    // Get the starting time.
  }

  mapFaces(faces, colors) {
    this.faces = faces;
    this.colors = colors;
    const ctx = document.createElement("canvas").getContext("2d");

    ctx.canvas.width = 128;
    ctx.canvas.height = 128;
    const faceInfos = [
      { target: this.gl.TEXTURE_CUBE_MAP_POSITIVE_X, faceColor: colors[0], textColor: '#222', text: faces[0] },
      { target: this.gl.TEXTURE_CUBE_MAP_NEGATIVE_X, faceColor: colors[1], textColor: '#222', text: faces[1] },
      { target: this.gl.TEXTURE_CUBE_MAP_POSITIVE_Y, faceColor: colors[2], textColor: '#222', text: faces[2] },
      { target: this.gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, faceColor: colors[3], textColor: '#222', text: faces[3] },
      { target: this.gl.TEXTURE_CUBE_MAP_POSITIVE_Z, faceColor: colors[4], textColor: '#222', text: faces[4] },
      { target: this.gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, faceColor: colors[5], textColor: '#222', text: faces[5] },
    ];
    faceInfos.forEach((faceInfo) => {
      const {target, faceColor, textColor, text} = faceInfo;
      generateFace(ctx, faceColor, textColor, text);

      // Upload the canvas to the cubemap face.
      const level = 0;
      const internalFormat = this.gl.RGBA;
      const format = this.gl.RGBA;
      const type = this.gl.UNSIGNED_BYTE;
      this.gl.texImage2D(target, level, internalFormat, format, type, ctx.canvas);
    });
    this.gl.generateMipmap(this.gl.TEXTURE_CUBE_MAP);
    this.gl.texParameteri(this.gl.TEXTURE_CUBE_MAP, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_LINEAR);

  }

  contains(x, y) {
    let dx = this.x - x;
    let dy = this.y - y;
    return dx*dx + dy*dy < 50*50;
  }

  draw(ctx, x=this.x, y=this.y) {
    this.drawScene()
    this.canvas.height = 100;
    this.canvas.width = 100;
    ctx.drawImage(this.gl.canvas, x-50, y-50, 100, 100)
  }

  drawScene() {
    let {program, positionLocation, matrixLocation, textureLocation} = this;
    let gl = this.gl
    // convert to seconds
    let time = performance.now()
    time *= 0.001;
    // Subtract the previous time from the current time
    var deltaTime = time - this.then;
    // Remember the current time for the next frame.
    this.then = time;

    // webglUtils.resizeCanvasToDisplaySize(this.canvas);
    // this.canvas.height = 100;
    // this.canvas.width = 100;

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);

    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    // Clear the canvas AND the depth buffer.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);

    // Turn on the position attribute
    gl.enableVertexAttribArray(positionLocation);

    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);

    // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 3;          // 3 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        positionLocation, size, type, normalize, stride, offset);

    // Compute the projection matrix
    var aspect = this.canvas.clientWidth / this.canvas.clientHeight;
    var projectionMatrix =
        m4.perspective(this.fieldOfViewRadians, aspect, 1, 2000);

    var cameraPosition = [0, 0, 200];
    var up = [0, 1, 0];
    var target = [0, 0, 0];

    // Compute the camera's matrix using look at.
    var cameraMatrix = m4.lookAt(cameraPosition, target, up);

    // Make a view matrix from the camera matrix.
    var viewMatrix = m4.inverse(cameraMatrix);

    var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

    this.rotX = Math.max(this.rollStopTime - Date.now(), 0) * this.rotXVel + this.rotXTarget;
    this.rotY = Math.max(this.rollStopTime - Date.now(), 0) * this.rotYVel + this.rotYTarget;
    var matrix = viewProjectionMatrix;
    matrix = m4.yRotate(matrix, this.rotY);
    matrix = m4.xRotate(matrix, this.rotX);

    // Set the matrix.
    gl.uniformMatrix4fv(matrixLocation, false, matrix);

    // Tell the shader to use texture unit 0 for u_texture
    gl.uniform1i(textureLocation, 0);

    // Draw the geometry.
    gl.drawArrays(gl.TRIANGLES, 0, 6 * 6);
  
  }

  roll(targetIdx, duration, force) {
    this.rotXTarget = faceCoords[targetIdx].x + Math.random() * .5 - .25
    this.rotYTarget = faceCoords[targetIdx].y + Math.random() * .5 - .25
    this.rollStopTime = Date.now() + duration;

    this.rotXVel = Math.random() * force + force;
    this.rotYVel = -.02
    // Math.random() * -.01 - .01;
  }

  isDoneRolling(now) {
    return now >= this.rollStopTime;
  }

}

function radToDeg(r) {
  return r * 180 / Math.PI;
}

function degToRad(d) {
  return d * Math.PI / 180;
}

function generateFace(ctx, faceColor, textColor, text) {
  let backImg = imgs[faceColor];
  const {width, height} = ctx.canvas;
  if (backImg) {
    ctx.drawImage(backImg, 0, 0, width, height);
  } else {
    ctx.fillStyle = faceColor;
    ctx.fillRect(0, 0, width, height);
    
  }

  let img = imgs[text];
  if (img) {
    ctx.drawImage(img, 0, 0, width, height);
  } else {
    ctx.font = `${width * 0.7}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = textColor;
    ctx.fillText(text, width / 2, height / 2);
  }

}

// Fill the buffer with the values that define a cube.
function setGeometry(gl) {
  var positions = new Float32Array(
    [
    -1, -1,  -1,
    -1,  1,  -1,
     1, -1,  -1,
    -1,  1,  -1,
     1,  1,  -1,
     1, -1,  -1,

    -1, -1,   1,
     1, -1,   1,
    -1,  1,   1,
    -1,  1,   1,
     1, -1,   1,
     1,  1,   1,

    -1,   1, -1,
    -1,   1,  1,
     1,   1, -1,
    -1,   1,  1,
     1,   1,  1,
     1,   1, -1,

    -1,  -1, -1,
     1,  -1, -1,
    -1,  -1,  1,
    -1,  -1,  1,
     1,  -1, -1,
     1,  -1,  1,

    -1,  -1, -1,
    -1,  -1,  1,
    -1,   1, -1,
    -1,  -1,  1,
    -1,   1,  1,
    -1,   1, -1,

     1,  -1, -1,
     1,   1, -1,
     1,  -1,  1,
     1,  -1,  1,
     1,   1, -1,
     1,   1,  1,

    ]);
  gl.bufferData(gl.ARRAY_BUFFER, positions.map(x => x * 1), gl.STATIC_DRAW);
}
