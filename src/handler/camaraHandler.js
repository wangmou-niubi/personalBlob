import * as THREE from "three";

export function initCamara(fov = 45,aspect = window.innerWidth / window.innerHeight,bear = 0.1,far = 100000){
    return new THREE.PerspectiveCamera(fov, aspect, bear,far);
}