// src/components/InteractiveParticles.jsx
import React, { useRef, useEffect } from "react";

export default function WorkSection() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

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
      attribute float a_lifetime;
      varying float v_lifetime;
      uniform float u_time;
      uniform vec2 u_mouse;
      uniform vec2 u_resolution;

      void main() {
        v_lifetime = mod(u_time + a_lifetime, 1.0); // Create pulsating effect

        // Map lifetime to alpha for fade-in/fade-out
        float alpha = v_lifetime < 0.5 ? v_lifetime * 2.0 : (1.0 - v_lifetime) * 2.0;

        // Add motion based on lifetime and mouse proximity
        vec2 offset = normalize(u_mouse - a_position) * (1.0 - v_lifetime) * 20.0;

        vec2 position = a_position + offset * alpha;
        vec2 zeroToOne = position / u_resolution;
        vec2 zeroToTwo = zeroToOne * 2.0;
        vec2 clipSpace = zeroToTwo - 1.0;

        gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
        gl_PointSize = 5.0 * (1.0 - alpha); // Vary point size by lifetime
      }
    `;

    // Fragment Shader
    const fragmentShaderSource = `
      precision highp float;
      varying float v_lifetime;
      uniform vec3 u_primaryColor;
      uniform vec3 u_accentColor;

      void main() {
        float alpha = v_lifetime < 0.5 ? v_lifetime * 2.0 : (1.0 - v_lifetime) * 2.0;
        vec3 color = mix(u_primaryColor, u_accentColor, v_lifetime);
        gl_FragColor = vec4(color, alpha);
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
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

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

    // Attribute and uniform locations
    const positionLocation = gl.getAttribLocation(program, "a_position");
    const lifetimeLocation = gl.getAttribLocation(program, "a_lifetime");
    const timeLocation = gl.getUniformLocation(program, "u_time");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const mouseLocation = gl.getUniformLocation(program, "u_mouse");
    const primaryColorLocation = gl.getUniformLocation(program, "u_primaryColor");
    const accentColorLocation = gl.getUniformLocation(program, "u_accentColor");

    // Generate particles
    const numParticles = 10000;
    const positions = [];
    const lifetimes = [];

    for (let i = 0; i < numParticles; i++) {
      positions.push(Math.random() * gl.canvas.width, Math.random() * gl.canvas.height);
      lifetimes.push(Math.random());
    }

    // Position buffer
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // Lifetime buffer
    const lifetimeBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, lifetimeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(lifetimes), gl.STATIC_DRAW);

    // Enable position attribute
    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Enable lifetime attribute
    gl.enableVertexAttribArray(lifetimeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, lifetimeBuffer);
    gl.vertexAttribPointer(lifetimeLocation, 1, gl.FLOAT, false, 0, 0);

    // Convert hex color to RGB
    const hexToRgb = (hex) => {
      const bigint = parseInt(hex.replace("#", ""), 16);
      const r = ((bigint >> 16) & 255) / 255;
      const g = ((bigint >> 8) & 255) / 255;
      const b = (bigint & 255) / 255;
      return [r, g, b];
    };

    const root = document.documentElement;
    const primaryColor = getComputedStyle(root).getPropertyValue("--primary-color").trim();
    const accentColor = getComputedStyle(root).getPropertyValue("--accent-color").trim();

    const [rPrimary, gPrimary, bPrimary] = hexToRgb(primaryColor);
    const [rAccent, gAccent, bAccent] = hexToRgb(accentColor);

    gl.uniform3f(primaryColorLocation, rPrimary, gPrimary, bPrimary);
    gl.uniform3f(accentColorLocation, rAccent, gAccent, bAccent);

    // Track mouse position
    const mousePosition = { x: 0, y: 0 };
    window.addEventListener("mousemove", (event) => {
      const rect = canvas.getBoundingClientRect();
      mousePosition.x = event.clientX - rect.left;
      mousePosition.y = gl.canvas.height - (event.clientY - rect.top);
    });

    // Animation loop
    let startTime = null;

    const render = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const elapsedTime = (currentTime - startTime) / 1000; // in seconds

      if (
        canvas.width !== canvas.clientWidth ||
        canvas.height !== canvas.clientHeight
      ) {
        resizeCanvas();
      }

      gl.clearColor(0, 0, 0, 0); // Transparent background
      gl.clear(gl.COLOR_BUFFER_BIT);

      // Update uniforms
      gl.uniform1f(timeLocation, elapsedTime);
      gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
      gl.uniform2f(mouseLocation, mousePosition.x, mousePosition.y);

      // Draw particles
      gl.drawArrays(gl.POINTS, 0, numParticles);

      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resizeCanvas);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(positionBuffer);
      gl.deleteBuffer(lifetimeBuffer);
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
