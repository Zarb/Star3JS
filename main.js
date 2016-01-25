// =============================================================================
// Variables globales

var scene;
var renderer;
var mousew;
var mouseh;
var camera;

// Objets uniques
var tie;
var wing;
var staticstar;

// Objets générés en masse
var lasers = [];
var particle = [];
var traces = [];
var stars = [];


// =============================================================================
// Instructions executées au chargement de la page
$(document).ready(function() {

	// Initialisation
	init();
	// Rendu
	render();

});

// =============================================================================
// Fonction JQuery executée aux mouvements de souris
$( document ).on( "mousemove", function( event ) {
  adjust(event.pageX, event.pageY);
});
$(document).click(function() {
	shoot();
});

// =============================================================================
// Script d'Initialisation
function init(){
	// Initialisation du Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild(renderer.domElement);
	// Initialisation de la scène
	scene = new THREE.Scene;
	// Ajout d'une lumière ambiante
	scene.add( new THREE.AmbientLight(0x666666) );
	// Ajout d'un point de vue
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
	scene.add(camera);
	// Ajout des deux vaisseaux
	addTie();
	//addWing();

	// Initialisation de variables
	mousew = 1;
	mouseh = 1;
	time = 0;
};

// =============================================================================
// Fonction appellée à chaque changement de position du curseur utilisateur pour
// mettre à jour les variables associées.
function adjust(width, height){
	mousew = width;
	mouseh = height;
};
// =============================================================================
// Boucle d'animation, ce qui est executé à chaque frame.
function render() {
	requestAnimationFrame( render );
	tie.position.x = (mousew/30)-30;
	tie.position.y = (- mouseh/20)+14;
	tie.rotation.z = (mousew/3000)-0.29;
	tie.rotation.y = -(mousew/2000)+0.5

	time++;
	animate();
	genParticle();
	genTraces();
	if(stars.length < 3){genStar();}
	if(staticstar == null){addTerra();}

	renderer.render( scene, camera );
}
// =============================================================================
// Fonction secondaire gérant les calculs de mouvement
function animate(){
	lasers.forEach(function(entry) {
    entry.position.z -= 6;
	});
	particle.forEach(function(entry) {
		entry.position.z += 10;
	});
	stars.forEach(function(entry) {
    entry.position.z += 0.001;
		entry.rotateY(0.002);
	});
	traces.forEach(function(entry) {
    entry.position.z += 1;
		entry.rotateY(0.002);
	});
	if(staticstar != null){
		staticstar.position.z += 0.01;
		staticstar.rotateY(0.002);
	}
}

// =============================================================================
// Création du chasseur TIE
function addTie(){
	var loader = new THREE.ObjectLoader();
	loader.load("res/tie.json",function ( obj ) {
		obj.position.z -= 25;
			tie =	obj
	    scene.add(tie);
	});
};
// =============================================================================
// Création du X-Wing
function addWing(){
	var loader = new THREE.ObjectLoader();
	loader.load("res/xwing.json",function ( obj ) {
		obj.position.x = tie.position.x;
		obj.position.y = tie.position.y;
		obj.position.z = tie.position.z-50;
		obj.rotation.y = 0.5;
			wing = obj
	    scene.add(wing);
	});
};
// =============================================================================
// Fonction de tir
function shoot(){
	var i = lasers.length;

	var geometry = new THREE.BoxGeometry( 0.5, 0.5, 10 );
	var material = new THREE.MeshBasicMaterial( { color: 0xFF0000 } );

	lasers[i+1] = new THREE.Mesh( geometry, material );
	lasers[i+1].position.x = tie.position.x+1;
	lasers[i+1].position.y = tie.position.y;
	lasers[i+1].position.z = tie.position.z;

	lasers[i+2] = new THREE.Mesh( geometry, material );
	lasers[i+2].position.x = tie.position.x-1;
	lasers[i+2].position.y = tie.position.y;
	lasers[i+2].position.z = tie.position.z-1;

	scene.add(lasers[i+1]);
	scene.add(lasers[i+2]);
}
// =============================================================================
// Fonction de génération aléatoire d'étoiles en arrière-plan
function genStar(){
	var i = stars.length;

	var geometry = new THREE.SphereGeometry(Math.random()*10+10, 10, 10);
	var material = new THREE.MeshPhongMaterial();
	material.map = THREE.ImageUtils.loadTexture('res/sun.jpg')
	stars[i+1] = new THREE.Mesh( geometry, material );
	stars[i+1].position.x = tie.position.x+(((Math.random()*1200)-600)+200);
	stars[i+1].position.y = tie.position.y+(((Math.random()*1200)-600)+200);
	stars[i+1].position.z = tie.position.z-(Math.random()*1200)+200;

	scene.add(stars[i+1]);
}
// =============================================================================
// Fonction de génération des particules
function genParticle(){
	var i = particle.length;

	var geometry = new THREE.BoxGeometry( 0.5, 0.5, 10);
	var material = new THREE.MeshBasicMaterial( { color: 0xFFFFFF } );
	particle[i+1] = new THREE.Mesh( geometry, material );
	particle[i+1].position.x = tie.position.x+((Math.random()*400)-200);
	particle[i+1].position.y = tie.position.y+((Math.random()*400)-200);
	particle[i+1].position.z = tie.position.z-600;

	scene.add(particle[i+1]);
}
// =============================================================================
// Fonction de génération de la trainée de fumée
function genTraces(){
	var i = traces.length;

	var geometry = new THREE.BoxGeometry(  Math.random()/5,  Math.random()/5, Math.random()*2);
	var material = new THREE.MeshBasicMaterial( { color: 0xFFFFFF } );

	traces[i+1] = new THREE.Mesh( geometry, material );
	traces[i+1].position.x = tie.position.x-3;
	traces[i+1].position.y = tie.position.y;
	traces[i+1].position.z = tie.position.z+5;
	traces[i+2] = new THREE.Mesh( geometry, material );
	traces[i+2].position.x = tie.position.x+3;
	traces[i+2].position.y = tie.position.y;
	traces[i+2].position.z = tie.position.z+5;

	scene.add(traces[i+1]);
	scene.add(traces[i+2]);
}
// =============================================================================
// Fonction de génération de la terre
function addTerra(){
	var geometry = new THREE.SphereGeometry( 30, 50, 50);
	var material = new THREE.MeshPhongMaterial();
	material.map = THREE.ImageUtils.loadTexture('res/terra.png')
	staticstar = new THREE.Mesh( geometry, material );
	staticstar.position.x = tie.position.x+100;
	staticstar.position.y = tie.position.y;
	staticstar.position.z = tie.position.z-100;

	scene.add(staticstar);
}
