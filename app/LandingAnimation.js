import { useRef, useEffect } from "react";

export default function LandingAnimation({ primaryColor = "#000000", accentColor = "#FF0000" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext("webgl");

    if (!gl) {
      console.error("WebGL is not supported by your browser.");
      return;
    }

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const vertexShaderSource = `
    attribute vec2 a_position;
    uniform vec2 u_resolution;
    uniform float u_time;
    uniform float u_yOffset;
    uniform float u_offsetBase;
  
    const float PI = 3.141592653589793;
    const float ANGLE = PI / 3.65; // 45 degrees in radians
  
    void main() {
      float frequency = 60.0 + sin(u_time) * 3.0; // Modulate frequency over time
      float yOffset = u_offsetBase*1.5 + sin(a_position.x / u_resolution.x * frequency + u_time) * 20.0 + u_yOffset;
  
      // Apply wave modulation
      vec2 position = vec2(a_position.x, a_position.y + yOffset);
  
      // Rotate by 45 degrees
      vec2 rotatedPosition = vec2(
        position.x * cos(ANGLE) - position.y * sin(ANGLE),
        position.x * sin(ANGLE) + position.y * cos(ANGLE)
      );
  
      // Map to clip space
      vec2 zeroToOne = rotatedPosition / u_resolution;
      vec2 zeroToTwo = zeroToOne * 2.0;
      vec2 clipSpace = zeroToTwo - 1.0;
  
      gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
    }
  `;

    // Fragment Shader
    const fragmentShaderSource = `
      precision mediump float;

      uniform vec4 u_color;

      void main() {
        gl_FragColor = u_color;
      }
    `;

    const createShader = (gl, type, source) => {
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

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    const createProgram = (gl, vertexShader, fragmentShader) => {
      const program = gl.createProgram();
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("Program linking failed:", gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
      }

      return program;
    };

    const program = createProgram(gl, vertexShader, fragmentShader);
    gl.useProgram(program);

    // Define positions for the waves
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const positions = [];
    const numPoints = 100;
    const width = canvas.width;

    for (let i = 0; i < numPoints; i++) {
      positions.push((i / numPoints) * width, 0);
    }

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "a_position");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const timeLocation = gl.getUniformLocation(program, "u_time");
    const colorLocation = gl.getUniformLocation(program, "u_color");
    const yOffsetLocation = gl.getUniformLocation(program, "u_yOffset");

    gl.viewport(0, 0, canvas.width, canvas.height);

    const [r, g, b] = accentColor.match(/\w\w/g).map((hex) => parseInt(hex, 16) / 255);

    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const size = 2;
    gl.vertexAttribPointer(positionLocation, size, gl.FLOAT, false, 0, 0);

    const numWaves = 80; // Total number of waves
    const waveSpacing = canvas.height*2.5 / numWaves; // Distribute waves across the canvas height
    // Add new uniform location for `u_offsetBase`
    const offsetBaseLocation = gl.getUniformLocation(program, "u_offsetBase");

    // Calculate the offset based on canvas width
    const offsetBase = -canvas.clientWidth / 2;


    const render = (time) => {
      gl.clearColor(
        parseInt(primaryColor.slice(1, 3), 16) / 255,
        parseInt(primaryColor.slice(3, 5), 16) / 255,
        parseInt(primaryColor.slice(5, 7), 16) / 255,
        1.0
      );
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(offsetBaseLocation, offsetBase);
      gl.uniform1f(timeLocation, time * 0.001);
      gl.uniform4f(colorLocation, r, g, b, 1.0);

      for (let i = 0; i < numWaves; i++) {
        const yOffset = i * waveSpacing; // Vertical position of the wave
        gl.uniform1f(yOffsetLocation, yOffset);

        gl.drawArrays(gl.LINE_STRIP, 0, numPoints);
      }

      requestAnimationFrame(render);
    };

    requestAnimationFrame(render);
  }, [primaryColor, accentColor]);

  return (
    <div style={{ width: "100vw", height: "94vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
