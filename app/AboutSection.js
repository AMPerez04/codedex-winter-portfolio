// src/components/AboutSection.jsx
import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";


export default function AboutSection() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null); // To store requestAnimationFrame ID

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext("webgl");

    if (!gl) {
      console.error("WebGL is not supported by your browser.");
      return;
    }

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Vertex Shader
    const vertexShaderSource = `
      attribute vec2 a_position;
      uniform float u_time;
      uniform vec2 u_resolution;

      void main() {
        // Convert from pixels to clip space
        vec2 zeroToOne = a_position / u_resolution;
        vec2 zeroToTwo = zeroToOne * 2.0;
        vec2 clipSpace = zeroToTwo - 1.0;

        // Apply time-based animation
        float angle = u_time + a_position.x * 0.001;
        float displacement = sin(angle) * 50.0;

        // Move vertices vertically based on displacement
        vec2 position = vec2(a_position.x, a_position.y + displacement);

        // Convert to clip space
        zeroToOne = position / u_resolution;
        zeroToTwo = zeroToOne * 2.0;
        clipSpace = zeroToTwo - 1.0;

        gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
        gl_PointSize = 10.0;
      }
    `;

    // Fragment Shader
    const fragmentShaderSource = `
      precision mediump float;
      uniform vec3 u_primaryColor;
      uniform vec3 u_accentColor;

      void main() {
        // Create a gradient effect between primary and accent colors
        float mixFactor = gl_FragCoord.y / 600.0; // Adjust based on canvas height
        vec3 color = mix(u_primaryColor, u_accentColor, mixFactor);
        gl_FragColor = vec4(color, 1.0);
      }
    `;

    // Compile shader
    const compileShader = (gl, type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compilation failed:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }

      return shader;
    };

    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = compileShader(
      gl,
      gl.FRAGMENT_SHADER,
      fragmentShaderSource
    );

    // Link program
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program linking failed:", gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return;
    }

    gl.useProgram(program);

    // Look up attribute and uniform locations
    const positionLocation = gl.getAttribLocation(program, "a_position");
    const timeLocation = gl.getUniformLocation(program, "u_time");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const primaryColorLocation = gl.getUniformLocation(program, "u_primaryColor");
    const accentColorLocation = gl.getUniformLocation(program, "u_accentColor");

    // Create a buffer and put a single triangle in it
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Define multiple triangles across the canvas
    const numTriangles = 100;
    const positions = [];

    for (let i = 0; i < numTriangles; i++) {
      const x = Math.random() * gl.canvas.width;
      const y = Math.random() * gl.canvas.height;
      const size = Math.random() * 50 + 20;

      // Define a simple triangle
      positions.push(
        x, y,
        x + size, y,
        x + size / 2, y + size
      );
    }

    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(positions),
      gl.STATIC_DRAW
    );

    // Enable the position attribute
    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Set uniform colors based on CSS variables
    const root = document.documentElement;
    const primaryColor = getComputedStyle(root).getPropertyValue("--dark-primary").trim();
    const accentColor = getComputedStyle(root).getPropertyValue("--dark-accent").trim();

    // Convert hex color to RGB
    const hexToRgb = (hex) => {
      const bigint = parseInt(hex.replace("#", ""), 16);
      const r = ((bigint >> 16) & 255) / 255;
      const g = ((bigint >> 8) & 255) / 255;
      const b = (bigint & 255) / 255;
      return [r, g, b];
    };

    const [rPrimary, gPrimary, bPrimary] = hexToRgb(primaryColor);
    const [rAccent, gAccent, bAccent] = hexToRgb(accentColor);

    gl.uniform3f(primaryColorLocation, rPrimary, gPrimary, bPrimary);
    gl.uniform3f(accentColorLocation, rAccent, gAccent, bAccent);

    // Animation loop
    let startTime = null;

    const render = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const elapsedTime = (currentTime - startTime) / 1000; // in seconds

      // Resize canvas if needed
      if (
        canvas.width !== canvas.clientWidth ||
        canvas.height !== canvas.clientHeight
      ) {
        resizeCanvas();
      }

      // Clear the canvas
      gl.clearColor(0, 0, 0, 0); // Transparent background
      gl.clear(gl.COLOR_BUFFER_BIT);

      // Update uniforms
      gl.uniform1f(timeLocation, elapsedTime);
      gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

      // Draw triangles
      gl.drawArrays(gl.TRIANGLES, 0, positions.length / 2);

      // Request next frame
      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resizeCanvas);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(positionBuffer);
    };
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-0"
      ></canvas>
    </div>
  );
}
