import React, { useRef, useEffect } from 'react';

export default function RainAnimation({ primaryColor = '#000000', accentColor = '#00FFFF' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl');

    if (!gl) {
      console.error('WebGL is not supported by your browser.');
      return;
    }

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Vertex Shader
    const vertexShaderSource = `
      attribute vec2 a_position;
      attribute float a_speed;
      uniform float u_time;
      varying float v_opacity;

      void main() {
        vec2 position = a_position;
        position.y -= mod(u_time * a_speed, 1.0); // Move down
        if (position.y < -1.0) position.y += 2.0; // Reset to top when off-screen
        v_opacity = 1.0 - ((position.y + 1.0) / 2.0); // Opacity decreases as it falls
        gl_Position = vec4(position, 0.0, 1.0);
        gl_PointSize = 2.0;
      }
    `;

    // Fragment Shader
    const fragmentShaderSource = `
      precision mediump float;
      uniform vec3 u_accentColor;
      varying float v_opacity;

      void main() {
        gl_FragColor = vec4(u_accentColor, v_opacity);
      }
    `;

    // Compile Shader
    const compileShader = (gl, type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compilation failed:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    // Link Program
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program linking failed:', gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return;
    }

    gl.useProgram(program);

    // Attribute and uniform locations
    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const speedLocation = gl.getAttribLocation(program, 'a_speed');
    const timeLocation = gl.getUniformLocation(program, 'u_time');
    const accentColorLocation = gl.getUniformLocation(program, 'u_accentColor');

    // Set up raindrop positions and speeds
    const dropCount = 500; // Fewer drops for optimization
    const positions = new Float32Array(dropCount * 2);
    const speeds = new Float32Array(dropCount);
    for (let i = 0; i < dropCount; i++) {
      positions[i * 2] = (Math.random() * 2 - 1); // x (-1 to 1)
      positions[i * 2 + 1] = (Math.random() * 2 - 1); // y (-1 to 1)
      speeds[i] = Math.random() * 0.3 + 0.2; // Speed (0.2 to 0.5)
    }

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const speedBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, speedBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, speeds, gl.STATIC_DRAW);

    // Enable position attribute
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Enable speed attribute
    gl.bindBuffer(gl.ARRAY_BUFFER, speedBuffer);
    gl.enableVertexAttribArray(speedLocation);
    gl.vertexAttribPointer(speedLocation, 1, gl.FLOAT, false, 0, 0);

    // Set rain color
    const hexToRgb = (hex) => {
      const bigint = parseInt(hex.replace('#', ''), 16);
      const r = ((bigint >> 16) & 255) / 255;
      const g = ((bigint >> 8) & 255) / 255;
      const b = (bigint & 255) / 255;
      return [r, g, b];
    };

    const [rAccent, gAccent, bAccent] = hexToRgb(accentColor);
    gl.uniform3f(accentColorLocation, rAccent, gAccent, bAccent);

    // Animation loop
    let startTime = null;
    const animate = (time) => {
      if (!startTime) startTime = time;
      const elapsedTime = (time - startTime) / 1000.0;

      gl.clearColor(...hexToRgb(primaryColor), 1.0); // Set background color
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.uniform1f(timeLocation, elapsedTime);

      gl.drawArrays(gl.POINTS, 0, dropCount);

      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(positionBuffer);
      gl.deleteBuffer(speedBuffer);
    };
  }, [primaryColor, accentColor]);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0"></canvas>
    </div>
  );
}
