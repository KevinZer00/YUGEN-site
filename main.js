//importing THREE.js for 3D graphics
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js';
//importing OrbitControls for camera manipulation
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/controls/OrbitControls.js';
//importing GLTFLoader for loading 3D models
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/loaders/GLTFLoader.js';


//loading particle effects configuration
particlesJS.load('particles-js', 'particlesjs-config.json',
  //anonymous function definition, likely a callback
  function () {
    //printing debug info to console
    console.log('particles.json loaded...');
  });



//code in this block runs after the entire document is loaded
document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('.menu a');  // select all anchor tags within .menu

  links.forEach(link => {
    //listening for a specific event and defining a callback
    link.addEventListener('click', (e) => {
      e.preventDefault();  // prevent the default jump-to-section behavior

      const targetSectionId = link.getAttribute('href');  // get the href attribute (like '#home')
      const targetSection = document.querySelector(targetSectionId);  // select the target section by its id

      if (targetSection) {
        const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: targetPosition - 80,  //90 is an offset, adjust as needed
          behavior: 'smooth'
        });
      }
    });
  });
});



function getScaleBasedOnScreenWidth() {
  if (window.innerWidth <= 450) {
    return {
      scale: 0.70,  //half the size when screen width is <= 360px
      yOffset: 0.6  //adjust the y position when screen width is <= 360px (you can adjust this value)
    };
  }
  return {
    scale: 1,  //default scale (original size)
    yOffset: -0.25  //default y position (from your original code)
  };
}

let scene, camera, renderer, model, controls;

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.5, 5000);

  const ambientLight = new THREE.AmbientLight(0xFFFAF0, 1); //add ambient light
  scene.add(ambientLight);




  renderer = new THREE.WebGLRenderer();
  renderer = new THREE.WebGLRenderer({ antialias: true });
  const clearColor = 0xeaedf2;
  renderer.setClearColor(clearColor, 1);
  renderer.setSize(window.innerWidth, window.innerHeight);
  const modelContainer = document.getElementById('three-container');
  modelContainer.appendChild(renderer.domElement);



  //importing OrbitControls for camera manipulation
  controls = new OrbitControls(camera, renderer.domElement);
  controls.minPolarAngle = Math.PI / 2;
  controls.maxPolarAngle = Math.PI / 2;
  controls.enableZoom = false; //prevent scrolling in
  controls.enablePan = false //prevent panning



}

function loadModel() {
  //importing GLTFLoader for loading 3D models
  const loader = new GLTFLoader();

  //load the background model
  loader.load('scene2.gltf', function (gltf) {
    const backgroundModel = gltf.scene;

    const hallwayBox = new THREE.Box3().setFromObject(backgroundModel);
    const hallwayCenter = hallwayBox.getCenter(new THREE.Vector3());
    backgroundModel.position.x = -hallwayCenter.x;
    backgroundModel.position.y = -hallwayCenter.y + 1;
    backgroundModel.position.z = hallwayCenter.z;
    backgroundModel.scale.z = -1;

    backgroundModel.traverse(function (child) {
      if (child.isMesh) {
        child.receiveShadow = true;
      }
    });

    //scene.add(backgroundModel);


    //adjust camera position
    const hallwaySize = hallwayBox.getSize(new THREE.Vector3());
    const maxDim = Math.max(hallwaySize.x, hallwaySize.y, hallwaySize.z);
    const distance = maxDim / Math.tan(Math.PI * camera.fov / 360);
    camera.position.set(0, 0, distance * 0.060);

    const ceilingLight1 = new THREE.DirectionalLight(0xFFFAF0, 0.25); //add a directional light
    ceilingLight1.position.set(0, 5, 0); //set the position of the light
    ceilingLight1.castShadow = true;
    scene.add(ceilingLight1);

    const ceilingLight2 = new THREE.DirectionalLight(0xFFFAF0, 0.25);
    ceilingLight2.position.set(0, 5, 0);
    ceilingLight2.castShadow = true;
    scene.add(ceilingLight2);

    const ceilingLight3 = new THREE.DirectionalLight(0xFFFAF0, 0.25);
    ceilingLight3.position.set(5, 0, 0);
    ceilingLight3.castShadow = true;
    scene.add(ceilingLight3);

    const ceilingLight4 = new THREE.DirectionalLight(0xFFFAF0, 0.25);
    ceilingLight4.position.set(0, 0, 5);
    ceilingLight4.castShadow = true;
    scene.add(ceilingLight4);

    const shadowMapSize = 1024;
    ceilingLight1.shadow.mapSize.width = shadowMapSize;
    ceilingLight1.shadow.mapSize.height = shadowMapSize;
    ceilingLight1.shadow.camera.near = 0.5;
    ceilingLight1.shadow.camera.far = 10;

    ceilingLight2.shadow.mapSize.width = shadowMapSize;
    ceilingLight2.shadow.mapSize.height = shadowMapSize;
    ceilingLight2.shadow.camera.near = 0.5;
    ceilingLight2.shadow.camera.far = 10;

    ceilingLight3.shadow.mapSize.width = shadowMapSize;
    ceilingLight3.shadow.mapSize.height = shadowMapSize;
    ceilingLight3.shadow.camera.near = 0.5;
    ceilingLight3.shadow.camera.far = 10;

    ceilingLight4.shadow.mapSize.width = shadowMapSize;
    ceilingLight4.shadow.mapSize.height = shadowMapSize;
    ceilingLight4.shadow.camera.near = 0.5;
    ceilingLight4.shadow.camera.far = 10;

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;


  });

  //load the robot model
  loader.load('scene.gltf', function (gltf) {
    model = gltf.scene;
    //printing debug info to console
    console.log("Background model loaded successfully");
    const robotBox = new THREE.Box3().setFromObject(model);
    const robotSize = robotBox.getSize(new THREE.Vector3());
    const robotCenter = robotBox.getCenter(new THREE.Vector3());


    model.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
      }
    });

    const adjustments = getScaleBasedOnScreenWidth();
    model.scale.set(adjustments.scale, adjustments.scale, adjustments.scale);
    model.position.y = adjustments.yOffset;;
    scene.add(model);


  });
}

window.addEventListener('resize', function () {
  const adjustments = getScaleBasedOnScreenWidth();
  if (model) {
    model.scale.set(adjustments.scale, adjustments.scale, adjustments.scale);
    model.position.y = adjustments.yOffset;
  }

});


function animate() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}


init();
loadModel();
animate();




const slides = document.querySelectorAll('.slide');
const circles = document.querySelectorAll('.circle');
let currentSlide = 0;
let typingInterval;
let transitionTimeout;

function showSlide(index) {
  slides.forEach((slide) => {
    slide.classList.remove('active');
  });

  circles.forEach((circle) => {
    circle.classList.remove('active');
  });

  slides[index].classList.add('active');
  circles[index].classList.add('active');
}

function startTypewriterAnimation(slideIndex) {
  const slide = slides[slideIndex];
  const text = slide.textContent.trim();
  let currentText = '';
  let charIndex = 0;

  clearInterval(typingInterval); //clear previous interval, if any
  clearTimeout(transitionTimeout); //clear previous transition timeout, if any


  typingInterval = setInterval(() => {
    if (charIndex < text.length) {
      currentText += text[charIndex];
      slide.textContent = currentText;
      charIndex++;
    } else {
      clearInterval(typingInterval);
      transitionTimeout = setTimeout(() => {
        currentSlide++;
        if (currentSlide >= slides.length) {
          currentSlide = 0;
        }
        showSlide(currentSlide);
        startTypewriterAnimation(currentSlide);
      }, 10000); //delay before starting the next slide animation
    }
  }, 25); //delay between each character typing
}

circles.forEach((circle, index) => {
  circle.addEventListener('click', () => {
    currentSlide = index;
    showSlide(currentSlide);
    startTypewriterAnimation(currentSlide);
  });
});

showSlide(currentSlide);
startTypewriterAnimation(currentSlide);




const typewriterSpans = document.querySelectorAll('.typewriter');

typewriterSpans.forEach((span, index) => {
  const text = span.textContent;
  span.textContent = ''; //clear the span's text content
  const delay = index * 3000; //adjust the delay timing as needed

  //function to animate the typing effect
  const animateTyping = (i) => {
    setTimeout(() => {
      span.textContent += text[i]; //add one letter at a time

      //check if there are more letters to type
      if (i < text.length - 1) {
        animateTyping(i + 1); //call the function recursively for the next letter
      }
    }, 50); //adjust the delay between each letter
  };

  //start the typing animation after the delay
  setTimeout(() => {
    animateTyping(0); //start from the first letter
  }, delay);
});



document.addEventListener("DOMContentLoaded", function () {
  //define the options for the Intersection Observer
  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  //the callback for the Intersection Observer
  const callback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      } else {
        entry.target.classList.remove('in-view');
      }
    });
  };

  //create the observer
  const observer = new IntersectionObserver(callback, options);

  //start observing all the .tl-item elements
  document.querySelectorAll('.tl-item').forEach(item => {
    observer.observe(item);
  });
});







