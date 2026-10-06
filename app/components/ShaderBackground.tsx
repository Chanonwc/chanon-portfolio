"use client";

import { useEffect, useRef } from "react";

// Full-page WebGL background: thin streaks of light shooting diagonally across the screen,
// in the site's blue / cyan / violet. Follows the light/dark theme (the `dark` class on <html>).

const vertex = `
  attribute vec2 aPosition;
  void main() {
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

const fragment = `
  precision highp float;
  uniform vec2 uRes;
  uniform float uTime;
  uniform float uLight; // 0 = dark theme, 1 = light theme
  uniform float uDpr;   // canvas pixels per CSS pixel, so dots keep the same size on every screen

  float hash(float n) { return fract(sin(n) * 43758.5453); }
  float hash2(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

  // Theme colours: accent blue, cyan and violet.
  vec3 palette(float t) {
    vec3 blue = vec3(0.184, 0.490, 0.965);
    vec3 cyan = vec3(0.024, 0.714, 0.831);
    vec3 violet = vec3(0.545, 0.361, 0.965);
    return t < 0.5 ? mix(blue, cyan, t * 2.0) : mix(blue, violet, (t - 0.5) * 2.0);
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;

    // Rotate so the streaks run diagonally from top-left to bottom-right.
    float a = -0.5;
    vec2 p = mat2(cos(a), -sin(a), sin(a), cos(a)) * uv;

    vec3 glow = vec3(0.0);
    float amount = 0.0;

    // Three depth layers: far ones are denser, thinner, slower and dimmer.
    for (int i = 0; i < 3; i++) {
      float fi = float(i);
      float lanes = 7.0 + fi * 6.0;
      float lane = floor(p.y * lanes);
      float across = fract(p.y * lanes) - 0.5;
      float seed = hash(lane * 17.13 + fi * 91.7);

      // Only some lanes carry a streak at all.
      if (seed < 0.35) continue;

      float speed = (0.35 + 0.6 * hash(lane * 3.7 + fi)) / (1.0 + fi * 0.6);
      float len = 0.25 + 0.55 * hash(lane * 5.1 + fi * 3.0);
      float period = 3.6 + 2.0 * hash(lane * 9.3 + fi);
      float head = mod(uTime * speed + seed * 20.0, period) - period * 0.5;

      float behind = head - p.x;                       // distance behind the head
      float tail = step(0.0, behind) * pow(max(0.0, 1.0 - behind / len), 2.2);
      float core = exp(-abs(behind) * 45.0);           // bright head
      float line = 1.0 - smoothstep(0.0, 0.04 + fi * 0.01, abs(across));
      float halo = 0.35 * (1.0 - smoothstep(0.0, 0.35, abs(across)));

      float strength = (tail * (line + halo) + core * line * 2.0) / (1.0 + fi * 0.7);
      glow += palette(hash(lane * 1.9 + fi * 5.0)) * strength;
      amount += strength;
    }

    // Twinkling dots: small and white in the dark theme; bigger, denser and black in the light theme.
    float cellSize = mix(5.0, 9.0, uLight) * uDpr;
    vec2 cellUv = gl_FragCoord.xy / cellSize;
    vec2 cell = floor(cellUv);
    float radius = mix(0.25, 0.22, uLight);
    float speck = 1.0 - smoothstep(radius * 0.5, radius, length(fract(cellUv) - 0.5));
    float twinkle = clamp(0.55 + 0.45 * sin(uTime * 1.5 + hash2(cell + 7.0) * 30.0), 0.0, 1.0);
    float star = step(mix(0.998, 0.992, uLight), hash2(cell)) * speck * twinkle;

    // Soft corner tint so the background is never flat.
    float vignette = smoothstep(1.3, 0.2, length(uv - vec2(-0.4, 0.4)));

    vec3 dark = vec3(0.0) + palette(0.0) * 0.06 * vignette + glow * 1.1 + vec3(star * 0.6);

    // Light theme: soft blue / violet streaks on an off-white; the twinkling dots turn black.
    vec3 ink = vec3(0.04, 0.04, 0.06);
    vec3 lightBg = mix(vec3(0.973, 0.980, 0.992), vec3(0.925, 0.945, 0.996), vignette * 0.7);
    vec3 tint = amount > 0.0 ? glow / amount : palette(0.0);
    vec3 light = mix(lightBg, tint * 0.95, clamp(amount * 0.55, 0.0, 0.7));
    light = mix(light, ink, star * 0.85);

    gl_FragColor = vec4(mix(dark, light, uLight), 1.0);
  }
`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
}

export default function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl", { antialias: false, alpha: false });
    if (!canvas || !gl) return; // no WebGL: the plain body background shows instead

    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, vertex));
    gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, fragment));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    // One triangle that covers the whole screen.
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "uRes");
    const uTime = gl.getUniformLocation(program, "uTime");
    const uLight = gl.getUniformLocation(program, "uLight");
    const uDpr = gl.getUniformLocation(program, "uDpr");

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uDpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    // Ease between themes instead of snapping.
    const isDark = () => document.documentElement.classList.contains("dark");
    let light = isDark() ? 0 : 1;

    let frame = 0;
    const start = performance.now();
    let last = start;
    const render = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      const target = isDark() ? 0 : 1;
      light += (target - light) * Math.min(1, dt * 8);
      gl.uniform1f(uLight, light);
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      frame = requestAnimationFrame(render);
    };

    // Stop drawing while the tab is hidden.
    const onVisibility = () => {
      cancelAnimationFrame(frame);
      if (!document.hidden) frame = requestAnimationFrame(render);
    };
    document.addEventListener("visibilitychange", onVisibility);
    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none fixed inset-0 z-0 h-full w-full" />;
}
