import * as THREE from 'three';

//
let scene, camera, renderer;
// spotlight
let spotLight, spotLightMat;
// mats
let earthMat, earthMesh, starsMat, starsTexture, starsMesh;

init();
animate();

function init() {
    // init scene
    scene = new THREE.Scene();

    // init camera
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 12;

    // init spotlight
    const spotLightGeo = new THREE.SphereGeometry(8, 8, 8);
    spotLight = new THREE.PointLight(0xD9AB73, 300, 50);
    spotLightMat = new THREE.MeshStandardMaterial({
        emissive: 0xffffee,
        emissiveIntensity: 1,
        color: 0x000000
    });
    spotLight.add(new THREE.Mesh(spotLightGeo, spotLightMat));
    spotLight.position.set(20, 20, 16);
    spotLight.castShadow = true;
    scene.add(spotLight);

    // material loader
    const textureLoader = new THREE.TextureLoader();

    starsTexture = textureLoader.load('./textures/star_texture.png');

    earthMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.8,
        metalness: 1.1,

    });
    textureLoader.load("./textures/2k_earth_daymap.jpg", function (map) {
        map.anisotropy = 4;
        map.encoding = THREE.sRGBEncoding;
        earthMat.map = map;
        earthMat.needsUpdate = true;
    });
    textureLoader.load("./textures/2k_earth_specular_map.jpg", function (map) {
        map.anisotropy = 4;
        map.encoding = THREE.sRGBEncoding;
        earthMat.metalnessMap = map;
        earthMat.needsUpdate = true;
    });

    // init stars
    const starsGeo = new THREE.BufferGeometry;
    const starsCount = 2048;
    const starsPosArr = new Float32Array(starsCount * 3);
    // filing stars position
    for (let i = 1; i < (starsCount * 3) + 1; i++) {
        // let v = (Math.random() - 0.5) * 40
        // if (i % 3 == 0 && v >= 1) {
        //     starsPosArr[i - 1] = -1;
        // } else {
        //     starsPosArr[i - 1] = v;
        // }

        starsPosArr[i - 1] = (Math.random() - 0.5) * 40;
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starsPosArr, 3));
    starsMat = new THREE.PointsMaterial({ size: 0.14, map: starsTexture, transparent: true });
    starsMesh = new THREE.Points(starsGeo, starsMat);
    starsMesh.position.z = 0;

    // init earth
    const earthGeo = new THREE.SphereGeometry(7, 32, 32);
    earthMesh = new THREE.Mesh(earthGeo, earthMat);
    earthMesh.castShadow = true;
    earthMesh.position.set(0, -6, 1)
    earthMesh.rotation.x += -.25

    // scene add
    scene.add(spotLight, starsMesh, earthMesh)

    // renderer
    renderer = new THREE.WebGLRenderer();
    renderer.physicallyCorrectLights = true;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.setClearColor(new THREE.Color('#03080D'), 1)
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // resize event
    window.addEventListener('resize', onWindowResize);

    // mouse event
    window.addEventListener('mousemove', animateStars);

    //
    document.getElementById("explore").addEventListener("click", () => updateDiv());


}
// star animation handler
function animateStars(event) {
    starsMesh.position.x = event.clientX * 0.0003;
    starsMesh.position.y = -(event.clientY * 0.0003);

    //earthMesh.position.set(event.clientX * 0.0003, -6 , 1)
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    earthMesh.rotation.y += 0.0006;

    starsMesh.rotation.y += 0.0002;

    renderer.render(scene, camera);
};

function updateDiv() {
    //requestAnimationFrame( updateCamera );
    var x = document.getElementById("explore");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }

    x = document.getElementById("head");

    x.innerHTML = "EXPLORE"

    x = document.getElementById("skills");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }

    x = document.getElementById("more1");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

function Time() {
    // Creating object of the Date class
    var date = new Date();
    // Get current hour
    var hour = date.getHours();
    // Get current minute
    var minute = date.getMinutes();
    // Get current second
    var second = date.getSeconds();
    // Variable to store AM / PM
    var period = "";
    // Assigning AM / PM according to the current hour
    if (hour >= 12) {
        period = "PM";
    } else {
        period = "AM";
    }
    // Converting the hour in 12-hour format
    if (hour == 0) {
        hour = 12;
    } else {
        if (hour > 12) {
            hour = hour - 12;
        }
    }
    // Updating hour, minute, and second
    // if they are less than 10
    hour = update(hour);
    minute = update(minute);
    second = update(second);
    // Adding time elements to the div
    document.getElementById("digital-clock").innerText = hour + " : " + minute + " : " + second + " " + period;
    // Set Timer to 1 sec (1000 ms)
    setTimeout(Time, 1000);
}
// Function to update time elements if they are less than 10
// Append 0 before time elements if they are less than 10
function update(t) {
    if (t < 10) {
        return "0" + t;
    }
    else {
        return t;
    }
}
Time();