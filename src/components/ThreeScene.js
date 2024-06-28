import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const ThreeScene = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    let renderer;

    try {
      renderer = new THREE.WebGLRenderer();
    } catch (e) {
      renderer = {
        setSize: () => {},
        domElement: document.createElement('div'),
      };
    }

    renderer.setSize(300, 300);
    currentMount.appendChild(renderer.domElement);

    camera.position.z = 5;
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => currentMount.removeChild(renderer.domElement);
  }, []);

  return <div ref={mountRef}></div>;
};

export default ThreeScene;