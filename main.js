var scene;
var renderer;
var cube;
var camera;
var tie;
var lasers = [];
var mousew;
var mouseh;
var stars = [];
var staticstar;

// Initialize and run on document ready
$(document).ready(function() {
	$('body').append('<div id="intro">Cliquez pour démarrer !</div>');
  init();

	addLight();
  addTie();
	addCam();

	render();

});

function init(){

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild(renderer.domElement);

	mousew = 1;
	mouseh = 1;

	time = 0;

  scene = new THREE.Scene;
};

function addCam(){
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

  scene.add(camera);
};
function addLight(){
	var light, materials;
	scene.add( new THREE.AmbientLight( 0x666666 ) );
	light = new THREE.DirectionalLight( 0xdfebff, 1.75 );
	light.position.set( 50, 200, 100 );
	light.position.multiplyScalar( 1.3 );
	light.castShadow = true;
	light.shadowMapWidth = 1024;
	light.shadowMapHeight = 1024;
	var d = 300;
	light.shadowCameraLeft = -d;
	light.shadowCameraRight = d;
	light.shadowCameraTop = d;
	light.shadowCameraBottom = -d;
	light.shadowCameraFar = 1000;
	scene.add(light);
}
function addTie(){
	var loader = new THREE.ObjectLoader();
	console.log("TEST");
	loader.load("tie.json",function ( obj ) {
		obj.position.z -= 25;
			tie =	obj
			console.log("TEST");
	    scene.add(tie);
	});
};

function adjust(width, height){
	mousew = width;
	mouseh = height;
};
function render() {
	requestAnimationFrame( render );
	tie.position.x = (mousew/30)-30;
	tie.position.y = (- mouseh/20)+14;
	tie.rotation.z = (mousew/3000)-0.29;
	tie.rotation.y = -(mousew/2000)+0.5

	time++;
	animate();
	genStar();
	if(staticstar == null){addTerra();}

	renderer.render( scene, camera );
}
function animate(){
	lasers.forEach(function(entry) {
    entry.position.z -= 6;
	});
	stars.forEach(function(entry) {
    entry.position.z += 10;
	});
	if(staticstar != null){
		staticstar.position.z += 0.01;
		staticstar.rotateY(0.002);
	}

}
function shoot(){
	var i = lasers.length;

	var geometry = new THREE.BoxGeometry( 0.5, 0.5, 10 );
	var material = new THREE.MeshBasicMaterial( { color: 0xFF0000 } );
	lasers[i+1] = new THREE.Mesh( geometry, material );
	lasers[i+1].position.x = tie.position.x+1;
	lasers[i+1].position.y = tie.position.y;
	lasers[i+1].position.z = tie.position.z;

	scene.add(lasers[i+1]);

	var geometry = new THREE.BoxGeometry( 0.5, 0.5, 10 );
	var material = new THREE.MeshBasicMaterial( { color: 0xFF0000 } );
	lasers[i+2] = new THREE.Mesh( geometry, material );
	lasers[i+2].position.x = tie.position.x-1;
	lasers[i+2].position.y = tie.position.y;
	lasers[i+2].position.z = tie.position.z-1;

	scene.add(lasers[i+2]);


}
function genStar(){
	var i = stars.length;

	var geometry = new THREE.BoxGeometry( 0.5, 0.5, 0.5);
	var material = new THREE.MeshBasicMaterial( { color: 0xFFFFFF } );
	stars[i+1] = new THREE.Mesh( geometry, material );
	stars[i+1].position.x = tie.position.x+((Math.random()*600)-300);
	stars[i+1].position.y = tie.position.y+((Math.random()*600)-300);
	stars[i+1].position.z = tie.position.z-600;

	scene.add(stars[i+1]);
}
function addTerra(){
	var geometry = new THREE.SphereGeometry( 30, 100, 100);
	var material = new THREE.MeshPhongMaterial();
	material.map = THREE.ImageUtils.loadTexture('terra.png')
	staticstar = new THREE.Mesh( geometry, material );
	staticstar.position.x = tie.position.x+100;
	staticstar.position.y = tie.position.y;
	staticstar.position.z = tie.position.z-100;
	staticstar

	scene.add(staticstar);
}


$( document ).on( "mousemove", function( event ) {
  adjust(event.pageX, event.pageY);
});
$(document).click(function() {
	shoot();
});
