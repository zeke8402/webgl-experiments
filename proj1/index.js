var scene, camera, renderer; // Three.js scene vars
var viewWidth, viewHeight; // Env vars
var toggle, isAnimating; // Animation vars
var fps, fpsInterval, startTime, now, then, elapsed; // For throttling FPS
var max = 200; // amount of dots on screen

var animationFrame;
var isPlaying = true;

var colorMood = 0x222222;
var colorMats = 0xffffff;
var dots = [];

function initScene() {
	viewWidth = window.innerWidth;
	viewHeight = window.innerHeight;

	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(75, viewWidth / viewHeight, 0.1, 1000);
	camera.position.z = 1000;
	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor(colorMood, 1);
	renderer.setSize(viewWidth, viewHeight);
	document.body.appendChild(renderer.domElement);
	
	toggle = "right";
	isAnimating = false;
};

/* Create all of our dots and save */
function init() {
	initScene();
	for (var i = 0; i < max; i++) {
		// Math.random() * (2560 - 0) + 0
		var width =
			Math.random() * (window.innerWidth - -window.innerWidth) +
			-window.innerWidth;
		var height =
			Math.random() * (window.innerHeight - -window.innerHeight) +
			-window.innerHeight;
		var geometry = new THREE.CircleGeometry(30, 16);
		var material = new THREE.MeshBasicMaterial({ color: colorMats });
		var dot = new THREE.Mesh(geometry, material);

		dot.position.set(width, height, 1);
		scene.add(dot);
		dots.push(dot);
	}

	//Prepare to animate
	fpsInterval = 1000 / 60;
	then = Date.now();
	startTime = then;
	renderer.render(scene, camera);
}

function animate() {
	animationFrame = requestAnimationFrame(animate);
	now = Date.now();
	elapsed = now - then;

	if (elapsed > fpsInterval) {
		then = now - elapsed % fpsInterval;
		updateDots();
	}
	renderer.render(scene, camera);
}

function updateDots() {
	for (var i = 0; i < max; i++) {
		var dot = dots[i];
		translationSpeed = Math.random() * (100 - 15) + 15; //Math.random() * (max - min) + min
		switch (toggle) {
			case "left":
				if (dot.position.x > -2560) {
					dot.translateX(-translationSpeed);
				}
				break;
			case "right":
				if (dot.position.x < 2560) {
					dot.translateX(translationSpeed);
				}
				break;
		}
	}
}

/* Want to match window */
window.addEventListener("resize", function() {
	viewWidth = window.innerWidth;
	viewHeight = window.innerHeight;

	renderer.setSize(viewWidth, viewHeight);
	camera.aspect = viewWidth / viewHeight;
	camera.updateProjectionMatrix();
});

/* Clicking stops animation */
window.addEventListener("click", function() {
	if (toggle === "left") {
		toggle = "right";
	} else {
		toggle = "left";
	}

	if (!isAnimating) {
		animate();
	}
});

init();

