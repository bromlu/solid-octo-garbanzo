import THREE from 'three.js';

// var scene = new THREE.Scene();
// var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

// let diceCanvas = document.getElementById("diceCanvas")
// renderer = new THREE.WebGLRenderer( { canvas: diceCanvas } );


export function main() {
  const canvas = document.getElementById("diceCanvas")
  const renderer = new THREE.WebGLRenderer({canvas, antialias: true});
  // const fov = 75;
  // const aspect = 2;  // the canvas default
  // const near = 0.1;
  // const far = 10;
  // const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  // camera.position.z = 5;

  // let width = 10;
  // let height = 10;
  // var camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, .1, 10 );
  // // camera.z = 5;
  // camera.z = -5;

  var aspect = canvas.clientWidth / canvas.clientHeight;
  var d = 5;
  var camera = new THREE.OrthographicCamera( - d * aspect, d * aspect, d, - d, 1, 1000 );
  camera.position.set( 0, 0, 5 ); // all components equal
  
  
  const scene = new THREE.Scene();
  
  {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.AmbientLight(color);
    // light.position.set(1, 10, 10);
    scene.add(light);
  }
  camera.lookAt( scene.position ); // or the origin

  const boxWidth = 1;
  const boxHeight = 1;
  const boxDepth = 1;
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

  function makeInstance(geometry, color, x) {
    // const material = new THREE.MeshPhongMaterial({color});

    var materials = [
      new THREE.MeshBasicMaterial({map: face_textures[0].texture}),
      new THREE.MeshBasicMaterial({map: face_textures[1].texture}),
      new THREE.MeshBasicMaterial({map: face_textures[2].texture}),
      new THREE.MeshBasicMaterial({map: face_textures[3].texture}),
      new THREE.MeshBasicMaterial({map: face_textures[4].texture}),
      new THREE.MeshBasicMaterial({map: face_textures[5].texture})
    ];
    const cube = new THREE.Mesh(geometry, materials);
    scene.add(cube);

    cube.position.x = x;

    return cube;
  }

  const cubes = [
    makeInstance(geometry, 0x44aa88,  0),
    makeInstance(geometry, 0x8844aa, -2),
    makeInstance(geometry, 0xaa8844,  2),
  ];

  function render(time) {
    time *= 0.001;  // convert time to seconds

    cubes.forEach((cube, ndx) => {
      const speed = 1 + ndx * .1;
      const rot = time * speed;
      cube.rotation.x = rot;
      cube.rotation.y = rot;
    });

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

}


var face_textures = [];
function createFaceTextures() {
  var i;
  for(i = 0; i < 6; i++) {
    var dynamictexture = new THREEx.DynamicTexture(512, 512);
    dynamictexture.context.font = "bolder 90px verdana";
    dynamictexture.texture.needsUpdate = true;
    dynamictexture.clear('#d35400').drawText(i.toString(), undefined, 256, 'green');
    face_textures.push(dynamictexture);
  }
}
createFaceTextures();

main();