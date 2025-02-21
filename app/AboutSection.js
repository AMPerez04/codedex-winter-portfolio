// src/components/AboutSection.jsx
import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { gsap, Power1, Back } from "gsap";

export default function AboutSection({
  primaryColor = "#000000",  // Used for the background
  accentColor = "#00FFFF",   // Used for the dots
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    // 1. Grab the canvas and set up initial width/height
    const canvas = canvasRef.current;
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;

    // 2. Create the WebGL renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
    renderer.setSize(width, height);

    // Convert primaryColor from hex string to a THREE.Color
    const bgColor = new THREE.Color(primaryColor);
    // Set the background color
    renderer.setClearColor(bgColor);

    // 3. Create the scene and camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 2000);
    camera.position.set(0, 0, 80);

    // 4. Load the dot texture (adjust path if needed)
    const loader = new THREE.TextureLoader();
    const dotTexture = loader.load("/img/dotTexture.png");

    // 5. Create geometry for an icosahedron (detail level 5)
    const radius = 50;
    const sphereGeom = new THREE.IcosahedronGeometry(radius, 7);
    const count = sphereGeom.attributes.position.count;

    // Prepare a typed array to hold vertex positions
    const positions = new Float32Array(count * 3);
    // Store the vertices as Vector3 objects for tweening
    const vertices = [];

    // 6. Animate each vertex with GSAP so it moves along x/z
    function animateDot(index, vector) {
      gsap.to(vector, {
        duration: 4,
        x: 0,
        z: 0,
        ease: Back.easeOut,
        delay: Math.abs(vector.y / radius) * 2,
        repeat: -1,
        yoyo: true,
        yoyoEase: Back.easeOut,
        onUpdate: () => {
          updateDot(index, vector);
        },
      });
    }

    function updateDot(index, vector) {
      // Update the positions array so Three.js sees the new coordinates
      positions[index * 3 + 0] = vector.x;
      // Keep y as-is
      positions[index * 3 + 2] = vector.z;
    }

    // 7. Initialize geometry data and start animations
    for (let i = 0; i < count; i++) {
      const vector = new THREE.Vector3().fromBufferAttribute(sphereGeom.attributes.position, i);
      vertices.push(vector);
      animateDot(i, vector);
      vector.toArray(positions, i * 3);
    }

    // 8. Create a new BufferGeometry for the points and add the positions attribute
    const bufferDotsGeom = new THREE.BufferGeometry();
    bufferDotsGeom.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    // Convert accentColor from hex string to a THREE.Color
    const dotColor = new THREE.Color(accentColor);

    // 9. Create a ShaderMaterial that uses the dot texture and accent color.
    // The fragment shader now discards fragments outside a circle.
    const wrapVertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_PointSize = 6.0;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;
    const wrapFragmentShader = `
      uniform sampler2D uTexture;
      uniform vec3 uAccentColor;
      void main() {
        // Create a circular mask using gl_PointCoord:
        float dist = distance(gl_PointCoord, vec2(0.5));
        if(dist > 0.5) discard;
        vec2 coord = gl_PointCoord;
        vec4 color = texture2D(uTexture, coord);
        if (color.a < 0.1) discard;
        // Multiply only the non-transparent part by the accent color
        color.rgb *= uAccentColor;
        gl_FragColor = color;
      }
    `;

    const shaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: dotTexture },
        uAccentColor: { value: dotColor },
      },
      vertexShader: wrapVertexShader,
      fragmentShader: wrapFragmentShader,
      transparent: true,
    });

    // 10. Create a Points object and add it to the scene
    const dots = new THREE.Points(bufferDotsGeom, shaderMaterial);
    scene.add(dots);

    // 11. Render loop (called on each GSAP tick)
    function render() {
      bufferDotsGeom.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    }

    // 12. Handle window resize
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
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(onResize, 200);
    };
    window.addEventListener("resize", handleResize);

    // 13. Mouse movement => rotate the point cloud
    const mouse = new THREE.Vector2(0.8, 0.5);
    function onMouseMove(e) {
      mouse.x = e.clientX / window.innerWidth - 0.5;
      mouse.y = e.clientY / window.innerHeight - 0.5;
      gsap.to(dots.rotation, {
        duration: 4,
        x: mouse.y * Math.PI * 0.5,
        z: mouse.x * Math.PI * 0.2,
        ease: Power1.easeOut,
      });
    }
    window.addEventListener("mousemove", onMouseMove);

    // 14. Use GSAP's ticker to render on each tick
    gsap.ticker.add(render);

    // Cleanup on unmount
    return () => {
      gsap.ticker.remove(render);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", onMouseMove);
      renderer.dispose();
      sphereGeom.dispose();
      bufferDotsGeom.dispose();
      dotTexture.dispose();
      shaderMaterial.dispose();
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
