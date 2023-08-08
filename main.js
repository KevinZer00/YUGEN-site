import * as THREE from 'three';
import { OrbitControls } from './OrbitControls.js';
import { GLTFLoader } from './GLTFLoader.js';

particlesJS.load('particles-js', 'particlesjs-config.json',
function() {
    console.log('particles.json loaded...');
});

document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('.menu a');  // select all anchor tags within .menu

  links.forEach(link => {
      link.addEventListener('click', (e) => {
          e.preventDefault();  // prevent the default jump-to-section behavior

          const targetSectionId = link.getAttribute('href');  // get the href attribute (like '#home')
          const targetSection = document.querySelector(targetSectionId);  // select the target section by its id

          if (targetSection) {
              const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset;
              window.scrollTo({
                  top: targetPosition - 80,  // 90 is an offset, adjust as needed
                  behavior: 'smooth'
              });
          }
      });
  });
});


    
function getScaleBasedOnScreenWidth() {
  if (window.innerWidth <= 400) {
        return {
            scale: 0.70,  // Half the size when screen width is <= 360px
            yOffset: 0.5  // Adjust the y position when screen width is <= 360px (you can adjust this value)
        };
    }
    return {
        scale: 1,  // Default scale (original size)
        yOffset: -0.25  // Default y position (from your original code)
    };
}

let scene, camera, renderer, model, controls;

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.5, 5000);
  
  const ambientLight = new THREE.AmbientLight(0xaaaaaa, 1); // Add ambient light
  scene.add(ambientLight);


 

  renderer = new THREE.WebGLRenderer();
  renderer = new THREE.WebGLRenderer({ antialias: true });
  const clearColor = 0xeaedf2;
  renderer.setClearColor(clearColor, 1);
  renderer.setSize(window.innerWidth, window.innerHeight);
  const modelContainer = document.getElementById('three-container');
  modelContainer.appendChild(renderer.domElement);

  controls = new OrbitControls(THREE)(camera, renderer.domElement);
  controls.enableZoom = false; //prevent scrolling in
  controls.enablePan = false //prevent panning

  
  
}

function loadModel() {
  const loader = new GLTFLoader();
  
  // Load the background model
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

    // scene.add(backgroundModel);


    // Adjust camera position
    const hallwaySize = hallwayBox.getSize(new THREE.Vector3());
    const maxDim = Math.max(hallwaySize.x, hallwaySize.y, hallwaySize.z);
    const distance = maxDim / Math.tan(Math.PI * camera.fov / 360);
    camera.position.set(0, 0, distance * 0.060);

    const ceilingLight1 = new THREE.DirectionalLight(0xeeeeee, 0.25); // Add a directional light
    ceilingLight1.position.set(0, 5, 0); // Set the position of the light
    ceilingLight1.castShadow = true;
    scene.add(ceilingLight1);

    const ceilingLight2 = new THREE.DirectionalLight(0xeeeeee, 0.25); // Add another directional light
    ceilingLight2.position.set(0, 5, 0); // Set the position of the light
    ceilingLight2.castShadow = true;
    scene.add(ceilingLight2);
    
    const ceilingLight3 = new THREE.DirectionalLight(0xeeeeee, 0.25); // Add another directional light
    ceilingLight3.position.set(5, 0, 0); // Set the position of the light\
    ceilingLight3.castShadow = true;
    scene.add(ceilingLight3);

    const ceilingLight4 = new THREE.DirectionalLight(0xeeeeee, 0.5); // Add another directional light
    ceilingLight4.position.set(0, 0, 5); // Set the position of the light
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

window.addEventListener('resize', function() {
  const adjustments = getScaleBasedOnScreenWidth();
  if (model) {
    model.scale.set(adjustments.scale, adjustments.scale, adjustments.scale);
    model.position.y = adjustments.yOffset;
  }
    
    // Adjust the renderer and any other necessary elements in response to window resizing, if required
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

  clearInterval(typingInterval); // Clear previous interval, if any
  clearTimeout(transitionTimeout); // Clear previous transition timeout, if any

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
      }, 10000); // Delay before starting the next slide animation
    }
  }, 25); // Delay between each character typing
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
    span.textContent = ''; // Clear the span's text content
    const delay = index * 3000; // Adjust the delay timing as needed
  
    // Function to animate the typing effect
    const animateTyping = (i) => {
      setTimeout(() => {
        span.textContent += text[i]; // Add one letter at a time
        
        // Check if there are more letters to type
        if (i < text.length - 1) {
          animateTyping(i + 1); // Call the function recursively for the next letter
        }
      }, 50); // Adjust the delay between each letter
    };
  
    // Start the typing animation after the delay
    setTimeout(() => {
      animateTyping(0); // Start from the first letter
    }, delay);
  });
  

  const timelineItems = document.querySelectorAll('.tl-item');

    timelineItems.forEach(item => {
        const imageUrl = item.dataset.imageUrl;
        if (imageUrl) {
            item.style.backgroundImage = `url('site1/${imageUrl}')`;
        }
    });



    


