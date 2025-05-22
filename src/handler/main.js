import * as THREE from "three";
import {GLTFLoader} from "three/addons";
import {gsap} from "gsap";
import {throttle} from "@/util/index.js"

let scene, clock, camera, renderer, loader, ocean = {}, mixer
export function initAll(domRef) {
    scene = new THREE.Scene()
    clock = new THREE.Clock()
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100000);
    camera.position.set(0, 0, 10);
    const backLoader = new THREE.TextureLoader();
    const bgTexture = backLoader.load("/img/th.webp");
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    let ambientLight = new THREE.AmbientLight(0xf5d6cd) // 创建环境光
    scene.add(ambientLight) // 将环境光添加到场景
    // scene.background = new THREE.Color(245,214,205);
    scene.background = bgTexture;
    // const controls = new OrbitControls( camera, renderer.domElement );
    // controls.update()
    // 添加灯光
    let light = new THREE.DirectionalLight(0xffffff, 0.7);
    light.position.set(0, 0, 1);
    scene.add(light);
    let light2 = new THREE.DirectionalLight(0xffffff, 0.3);
    light2.position.set(0, 0, -1);
    scene.add(light2);
    let light3 = new THREE.AmbientLight(0xffffff, 0.3);
    light3.position.set(-1, 1, 1);
    scene.add(light3);
    loader = new GLTFLoader();
    loader.load("/module/3d/shiba/scene.gltf", (gltf) => {
        gltf.scene.scale.set(2, 2, 2);
        gltf.scene.position.set(5, 0, 0);
        scene.add(gltf.scene);
        window.addEventListener("mousemove", (e) => {
            let x = (e.clientX / window.innerWidth) * 2 - 1;
            let y = (e.clientY / window.innerHeight) * 2 - 1;
            let timeline = gsap.timeline();
            timeline.to(gltf.scene.rotation, {
                duration: 0.5,
                x: y,
                y: x,
            });
        });
    });
    loader.load("/module/3d/just_a_girl/scene.gltf", (gltf) => {
        gltf.scene.scale.set(0.02, 0.02, 0.02);
        gltf.scene.position.set(5, -8, 0);
        scene.add(gltf.scene);
        window.addEventListener("mousemove", (e) => {
            let x = (e.clientX / window.innerWidth) * 2 - 1;
            let y = (e.clientY / window.innerHeight) * 2 - 1;
            let timeline = gsap.timeline();
            timeline.to(gltf.scene.rotation, {
                duration: 0.5,
                x: y,
                y: x,
            });
        });
    });
    loader.load("/module/3d/shiba/scene.gltf", (gltf) => {
        gltf.scene.scale.set(2, 2, 2);
        gltf.scene.position.set(5, -16, 0);
        scene.add(gltf.scene);
        window.addEventListener("mousemove", (e) => {
            let x = (e.clientX / window.innerWidth) * 2 - 1;
            let y = (e.clientY / window.innerHeight) * 2 - 1;
            let timeline = gsap.timeline();
            timeline.to(gltf.scene.rotation, {
                duration: 0.5,
                x: y,
                y: x,
            });
        });
    });
    loader.load("/module/3d/ocean/animated_ocean_scene_tutorial_example_1.glb", (glb) => {
        ocean.glb = glb
        ocean.baseY = -3
        glb.scene.scale.set(1, 1, 1);
        glb.scene.position.set(0, ocean.baseY, 10);
        mixer = new THREE.AnimationMixer(glb.scene)
        mixer.clipAction(glb.animations[0]).play()
        scene.add(glb.scene);
    });

    let page = 0;
    let timeline2 = gsap.timeline();

    window.addEventListener("resize", () => {
        renderer.setSize(window.innerWidth, window.innerHeight)
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
    })
    // 创建渲染函数
    if (domRef.current.children.length === 0) {
        domRef.current.appendChild(renderer.domElement);
    }
    document.getElementById('main-container').addEventListener("mousewheel", throttle((e) => {
        e.preventDefault()
        let currentPage = parseInt((document.getElementById('main-container').scrollTop + (window.innerHeight / 2)) / window.innerHeight)

        if (currentPage !== page) {
            if (!timeline2.isActive()) {
                ocean.glb.scene.position.set(0, ocean.baseY + currentPage * -8, 10);
                timeline2.to(camera.position, {
                    duration: 0.5,
                    y: currentPage * -8,
                });
                gsap.to(page, {
                    duration: 1,
                    y: -currentPage * window.innerHeight,
                });
            }
        }
        page = currentPage
        // document.getElementById('main-container').scrollTop = page * window.innerHeight
    }, 100));


    function animate() {
        requestAnimationFrame(animate)
        if (mixer) mixer.update(clock.getDelta())
        render()
    }

    function render() {
        renderer.render(scene, camera);
    }

    animate()
}
