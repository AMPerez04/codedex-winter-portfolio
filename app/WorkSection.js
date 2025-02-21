// src/components/WorkSection.jsx
import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { gsap, Power1 } from "gsap";
import { noise } from "./perlin.js";  // Adjust the path as needed

export default function WorkSection({
  primaryColor = "#A9E7DA", // used for the background clear color and base vertex color
  accentColor = "#23f660",  // used for the perlin mix on the vertices
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!noise || typeof noise.simplex3 !== "function") {
      console.error("Perlin noise not found. Ensure perlin.js is imported correctly.");
      return;
    }

    const canvas = canvasRef.current;
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;

    // Create renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
    renderer.setSize(width, height);
    renderer.setClearColor(new THREE.Color(accentColor));

    // Create scene and camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(100, width / height, 0.1, 10000);
    camera.position.set(120, 0, 300);

    // Add lights
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
    scene.add(hemiLight);
    const dirLight1 = new THREE.DirectionalLight(primaryColor, 2);
    dirLight1.position.set(200, 300, 400);
    scene.add(dirLight1);
    const dirLight2 = dirLight1.clone();
    dirLight2.position.set(-200, 300, 400);
    scene.add(dirLight2);

    // Create an Icosahedron geometry
    const geometry = new THREE.IcosahedronGeometry(160, 20);
    const posAttr = geometry.attributes.position;
    const vertexCount = posAttr.count;

    // Create an array to store vertices for tweening
    const vertices = [];
    for (let i = 0; i < vertexCount; i++) {
      const v = new THREE.Vector3().fromBufferAttribute(posAttr, i);
      // Save original position
      v._o = v.clone();
      vertices.push(v);
    }

    // Create a color attribute on the geometry (initialized to primaryColor)
    const colorArray = new Float32Array(vertexCount * 3);
    const colorPrimary = new THREE.Color(accentColor);
    const colorAccent = new THREE.Color(primaryColor);
    for (let i = 0; i < vertexCount; i++) {
      colorPrimary.toArray(colorArray, i * 3);
    }
    geometry.setAttribute("color", new THREE.BufferAttribute(colorArray, 3));

    // Use a MeshPhongMaterial that supports vertex colors
    const material = new THREE.MeshPhongMaterial({
      vertexColors: true,
      emissive: parseInt(accentColor.replace("#", "0x")),
      emissiveIntensity: 0.4,
      shininess: 0,
    });

    const shape = new THREE.Mesh(geometry, material);
    scene.add(shape);

    // Mouse vector for interactive noise
    const mouse = new THREE.Vector2(0.8, 0.5);

    // Update vertices and vertex colors using perlin noise
    function updateVertices(time) {
      for (let i = 0; i < vertices.length; i++) {
        const vector = vertices[i];
        // Reset to original position
        vector.copy(vector._o);
        // Compute noise value
        const perlin = noise.simplex3(
          (vector.x * 0.006) + (time * 0.0002),
          (vector.y * 0.006) + (time * 0.0003),
          (vector.z * 0.006)
        );
        // Use noise to modify the scale ratio
        const ratio = 0.8 + perlin * 0.4 * (mouse.y + 0.1);
        vector.multiplyScalar(ratio);
        posAttr.setXYZ(i, vector.x, vector.y, vector.z);

        // Compute a normalized t value from perlin (range 0 to 1)
        const t = THREE.MathUtils.clamp((perlin + 1) / 2, 0, 1);
        // Mix primary and accent colors based on t
        const mixedColor = colorPrimary.clone().lerp(colorAccent, t);
        mixedColor.toArray(colorArray, i * 3);
      }
      posAttr.needsUpdate = true;
      geometry.attributes.color.needsUpdate = true;
    }

    // Render loop
    let animationId;
    function render(time) {
      updateVertices(time);
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(render);
    }
    animationId = requestAnimationFrame(render);

    // Mouse move handler
    function onMouseMove(e) {
      gsap.to(mouse, {
        duration: 0.8,
        x: e.clientX / width,
        y: e.clientY / height,
        ease: Power1.easeOut,
      });
    }
    window.addEventListener("mousemove", onMouseMove);

    // Handle window resize
    function onResize() {
      canvas.style.width = "";
      canvas.style.height = "";
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }
    let resizeTimer;
    function handleResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(onResize, 200);
    }
    window.addEventListener("resize", handleResize);

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, [primaryColor, accentColor]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0" />
    </div>
  );
}
