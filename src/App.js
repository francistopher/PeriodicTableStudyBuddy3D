import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

const IntroText = () => {
    // add a mount to couple the 3D + 2D
    const mount = useRef(null);

    useEffect(() => {
        // add a scene to contain out meshes
        const scene = new THREE.Scene();

        // add a camera to see our mesh
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        // add a renderer to display our mesh
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        mount.current.appendChild(renderer.domElement);

        // add a fontLoader to render a font into the scene
        const fontLoader = new FontLoader();
        fontLoader.load(
            "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
            (font) => {
                // add a geometry to define a shape for out mesh
                const geometry = new TextGeometry("PTSB", {
                    font: font,
                    size: 80,
                    height: 5,
                    curveSegments: 12,
                    bevelEnabled: true,
                    bevelThickness: 10,
                    bevelSize: 8,
                    bevelOffset: 0,
                    bevelSegments: 5,
                });
                geometry.center();
                // add a material to define a texture for our mesh
                const material = new THREE.MeshStandardMaterial({
                    color: "cyan",
                    roughness: 0.7,
                    metalness: 0.0,
                    flatShading: true,
                    transparent: true,
                    opacity: 0.8,
                    castShadow: true,
                    receiveShadow: true,
                });
                // add a mesh to render it
                const mesh = new THREE.Mesh(geometry, material);
                // add group to properly rotate text on its center
                const group = new THREE.Group();
                group.add(mesh);
                scene.add(group);
                camera.position.z = 400;

                // add a control to zoom/move far and close
                const controls = new OrbitControls(camera, renderer.domElement);
                controls.enableDamping = true;
                controls.dampingFactor = 0.05;

                // add a light to cast shadows
                const light = new THREE.DirectionalLight(0xffffff, 1); // white light
                light.position.set(1, 1, 1); // top right back
                light.castShadow = true;
                light.shadow.mapSize.width = 2048; // size of light
                light.shadow.mapSize.height = 2048;
                light.shadow.camera.near = 0.1; // reach of light
                light.shadow.camera.far = 500;
                scene.add(light);

                // add animate to start the text rotation
                const animate = function () {
                    requestAnimationFrame(animate);
                    group.rotation.y += 0.03;
                    controls.update();
                    renderer.render(scene, camera);
                };
                animate();
            },
            undefined,
            function (error) {
                console.error(error);
            }
        );
    }, []);

    return <div ref={mount} />;
};

export default IntroText;
