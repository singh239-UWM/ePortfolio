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
        let v = (Math.random() - 0.5) * 40
        if (i % 3 == 0 && v >= 1) {
            starsPosArr[i - 1] = -1;
        } else {
            starsPosArr[i - 1] = v;
        }

        // starsPosArr[i - 1] = (Math.random() - 0.5) * 40;
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


}
// star animation handler
function animateStars(event) {
    starsMesh.rotation.x = event.clientY * 0.00008;
    starsMesh.rotation.y = event.clientX * 0.00002;

    //earthMesh.position.set(event.clientX * 0.0003, -6 , 1)
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    earthMesh.rotation.y += 0.0006

    renderer.render(scene, camera);
};