"use client";

import { useEffect, useRef } from "react";

// Pointer-driven WebGL fluid simulation, adapted from Pavel Dobryakov's
// WebGL-Fluid-Simulation (MIT licensed).

const SIM_RESOLUTION = 128;
const DYE_RESOLUTION = 1024;
const DENSITY_DISSIPATION = 3.5;
const VELOCITY_DISSIPATION = 2;
const PRESSURE = 0.1;
const PRESSURE_ITERATIONS = 20;
const CURL = 3;
const SPLAT_RADIUS = 0.2;
const SPLAT_FORCE = 6000;
const COLOR_UPDATE_SPEED = 10;
const IDLE_MS = 5000; // stop rendering once the dye has faded out

const baseVertex = `
  precision highp float;
  attribute vec2 aPosition;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform vec2 texelSize;
  void main () {
    vUv = aPosition * 0.5 + 0.5;
    vL = vUv - vec2(texelSize.x, 0.0);
    vR = vUv + vec2(texelSize.x, 0.0);
    vT = vUv + vec2(0.0, texelSize.y);
    vB = vUv - vec2(0.0, texelSize.y);
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

const fragmentHeader = `
  precision highp float;
  precision highp sampler2D;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
`;

const clearShader = `${fragmentHeader}
  uniform sampler2D uTexture;
  uniform float value;
  void main () {
    gl_FragColor = value * texture2D(uTexture, vUv);
  }
`;

const displayShader = `${fragmentHeader}
  uniform sampler2D uTexture;
  uniform vec2 texelSize;
  void main () {
    vec3 c = texture2D(uTexture, vUv).rgb;
    vec3 lc = texture2D(uTexture, vL).rgb;
    vec3 rc = texture2D(uTexture, vR).rgb;
    vec3 tc = texture2D(uTexture, vT).rgb;
    vec3 bc = texture2D(uTexture, vB).rgb;
    float dx = length(rc) - length(lc);
    float dy = length(tc) - length(bc);
    vec3 n = normalize(vec3(dx, dy, length(texelSize)));
    float diffuse = clamp(dot(n, vec3(0.0, 0.0, 1.0)) + 0.7, 0.7, 1.0);
    c *= diffuse;
    float a = max(c.r, max(c.g, c.b));
    gl_FragColor = vec4(c, a);
  }
`;

const splatShader = `${fragmentHeader}
  uniform sampler2D uTarget;
  uniform float aspectRatio;
  uniform vec3 color;
  uniform vec2 point;
  uniform float radius;
  void main () {
    vec2 p = vUv - point.xy;
    p.x *= aspectRatio;
    vec3 splat = exp(-dot(p, p) / radius) * color;
    vec3 base = texture2D(uTarget, vUv).xyz;
    gl_FragColor = vec4(base + splat, 1.0);
  }
`;

const advectionShader = `${fragmentHeader}
  uniform sampler2D uVelocity;
  uniform sampler2D uSource;
  uniform vec2 texelSize;
  uniform float dt;
  uniform float dissipation;
  void main () {
    vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
    vec4 result = texture2D(uSource, coord);
    float decay = 1.0 + dissipation * dt;
    gl_FragColor = result / decay;
  }
`;

const divergenceShader = `${fragmentHeader}
  uniform sampler2D uVelocity;
  void main () {
    float L = texture2D(uVelocity, vL).x;
    float R = texture2D(uVelocity, vR).x;
    float T = texture2D(uVelocity, vT).y;
    float B = texture2D(uVelocity, vB).y;
    vec2 C = texture2D(uVelocity, vUv).xy;
    if (vL.x < 0.0) { L = -C.x; }
    if (vR.x > 1.0) { R = -C.x; }
    if (vT.y > 1.0) { T = -C.y; }
    if (vB.y < 0.0) { B = -C.y; }
    float div = 0.5 * (R - L + T - B);
    gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
  }
`;

const curlShader = `${fragmentHeader}
  uniform sampler2D uVelocity;
  void main () {
    float L = texture2D(uVelocity, vL).y;
    float R = texture2D(uVelocity, vR).y;
    float T = texture2D(uVelocity, vT).x;
    float B = texture2D(uVelocity, vB).x;
    float vorticity = R - L - T + B;
    gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
  }
`;

const vorticityShader = `${fragmentHeader}
  uniform sampler2D uVelocity;
  uniform sampler2D uCurl;
  uniform float curl;
  uniform float dt;
  void main () {
    float L = texture2D(uCurl, vL).x;
    float R = texture2D(uCurl, vR).x;
    float T = texture2D(uCurl, vT).x;
    float B = texture2D(uCurl, vB).x;
    float C = texture2D(uCurl, vUv).x;
    vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
    force /= length(force) + 0.0001;
    force *= curl * C;
    force.y *= -1.0;
    vec2 velocity = texture2D(uVelocity, vUv).xy;
    velocity += force * dt;
    velocity = min(max(velocity, -1000.0), 1000.0);
    gl_FragColor = vec4(velocity, 0.0, 1.0);
  }
`;

const pressureShader = `${fragmentHeader}
  uniform sampler2D uPressure;
  uniform sampler2D uDivergence;
  void main () {
    float L = texture2D(uPressure, vL).x;
    float R = texture2D(uPressure, vR).x;
    float T = texture2D(uPressure, vT).x;
    float B = texture2D(uPressure, vB).x;
    float divergence = texture2D(uDivergence, vUv).x;
    float pressure = (L + R + B + T - divergence) * 0.25;
    gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
  }
`;

const gradientSubtractShader = `${fragmentHeader}
  uniform sampler2D uPressure;
  uniform sampler2D uVelocity;
  void main () {
    float L = texture2D(uPressure, vL).x;
    float R = texture2D(uPressure, vR).x;
    float T = texture2D(uPressure, vT).x;
    float B = texture2D(uPressure, vB).x;
    vec2 velocity = texture2D(uVelocity, vUv).xy;
    velocity.xy -= vec2(R - L, T - B);
    gl_FragColor = vec4(velocity, 0.0, 1.0);
  }
`;

type FBO = {
  fbo: WebGLFramebuffer | null;
  width: number;
  height: number;
  texelSizeX: number;
  texelSizeY: number;
  attach: (unit: number) => number;
};

type DoubleFBO = { read: FBO; write: FBO; swap: () => void };

type Color = { r: number; g: number; b: number };

function randomColor(): Color {
  // Fully saturated hue, dimmed so overlapping splats don't blow out.
  const h = Math.random() * 6;
  const f = h - Math.floor(h);
  const [r, g, b] = [
    [1, f, 0],
    [1 - f, 1, 0],
    [0, 1, f],
    [0, 1 - f, 1],
    [f, 0, 1],
    [1, 0, 1 - f],
  ][Math.floor(h) % 6];
  return { r: r * 0.15, g: g * 0.15, b: b * 0.15 };
}

function startFluid(canvas: HTMLCanvasElement, gl: WebGL2RenderingContext) {
  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
  };

  const vertexShader = compile(gl.VERTEX_SHADER, baseVertex);

  const createProgram = (fragmentSource: string) => {
    const program = gl.createProgram()!;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentSource));
    gl.bindAttribLocation(program, 0, "aPosition");
    gl.linkProgram(program);
    const uniforms: Record<string, WebGLUniformLocation | null> = {};
    const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS) as number;
    for (let i = 0; i < count; i++) {
      const name = gl.getActiveUniform(program, i)!.name;
      uniforms[name] = gl.getUniformLocation(program, name);
    }
    return { uniforms, bind: () => gl.useProgram(program) };
  };

  const clearProgram = createProgram(clearShader);
  const displayProgram = createProgram(displayShader);
  const splatProgram = createProgram(splatShader);
  const advectionProgram = createProgram(advectionShader);
  const divergenceProgram = createProgram(divergenceShader);
  const curlProgram = createProgram(curlShader);
  const vorticityProgram = createProgram(vorticityShader);
  const pressureProgram = createProgram(pressureShader);
  const gradientSubtractProgram = createProgram(gradientSubtractShader);

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(0);

  const blit = (target: FBO | null) => {
    if (target) {
      gl.viewport(0, 0, target.width, target.height);
      gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
    } else {
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
  };

  const createFBO = (w: number, h: number, internalFormat: number, format: number, filter: number): FBO => {
    gl.activeTexture(gl.TEXTURE0);
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, gl.HALF_FLOAT, null);

    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    gl.viewport(0, 0, w, h);
    gl.clear(gl.COLOR_BUFFER_BIT);

    return {
      fbo,
      width: w,
      height: h,
      texelSizeX: 1 / w,
      texelSizeY: 1 / h,
      attach(unit) {
        gl.activeTexture(gl.TEXTURE0 + unit);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        return unit;
      },
    };
  };

  const createDoubleFBO = (w: number, h: number, internalFormat: number, format: number, filter: number): DoubleFBO => {
    const pair = {
      read: createFBO(w, h, internalFormat, format, filter),
      write: createFBO(w, h, internalFormat, format, filter),
      swap() {
        [pair.read, pair.write] = [pair.write, pair.read];
      },
    };
    return pair;
  };

  const getResolution = (resolution: number) => {
    let aspect = gl.drawingBufferWidth / gl.drawingBufferHeight;
    if (aspect < 1) aspect = 1 / aspect;
    const min = Math.round(resolution);
    const max = Math.round(resolution * aspect);
    return gl.drawingBufferWidth > gl.drawingBufferHeight
      ? { width: max, height: min }
      : { width: min, height: max };
  };

  let dye: DoubleFBO;
  let velocity: DoubleFBO;
  let pressure: DoubleFBO;
  let divergence: FBO;
  let curl: FBO;

  const initFramebuffers = () => {
    const sim = getResolution(SIM_RESOLUTION);
    const dyeRes = getResolution(DYE_RESOLUTION);
    gl.disable(gl.BLEND);
    dye = createDoubleFBO(dyeRes.width, dyeRes.height, gl.RGBA16F, gl.RGBA, gl.LINEAR);
    velocity = createDoubleFBO(sim.width, sim.height, gl.RG16F, gl.RG, gl.LINEAR);
    pressure = createDoubleFBO(sim.width, sim.height, gl.R16F, gl.RED, gl.NEAREST);
    divergence = createFBO(sim.width, sim.height, gl.R16F, gl.RED, gl.NEAREST);
    curl = createFBO(sim.width, sim.height, gl.R16F, gl.RED, gl.NEAREST);
  };

  const resizeCanvas = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.floor(canvas.clientWidth * ratio);
    const height = Math.floor(canvas.clientHeight * ratio);
    if (canvas.width === width && canvas.height === height) return false;
    canvas.width = width;
    canvas.height = height;
    return true;
  };

  const step = (dt: number) => {
    gl.disable(gl.BLEND);

    curlProgram.bind();
    gl.uniform2f(curlProgram.uniforms.texelSize, velocity.read.texelSizeX, velocity.read.texelSizeY);
    gl.uniform1i(curlProgram.uniforms.uVelocity, velocity.read.attach(0));
    blit(curl);

    vorticityProgram.bind();
    gl.uniform2f(vorticityProgram.uniforms.texelSize, velocity.read.texelSizeX, velocity.read.texelSizeY);
    gl.uniform1i(vorticityProgram.uniforms.uVelocity, velocity.read.attach(0));
    gl.uniform1i(vorticityProgram.uniforms.uCurl, curl.attach(1));
    gl.uniform1f(vorticityProgram.uniforms.curl, CURL);
    gl.uniform1f(vorticityProgram.uniforms.dt, dt);
    blit(velocity.write);
    velocity.swap();

    divergenceProgram.bind();
    gl.uniform2f(divergenceProgram.uniforms.texelSize, velocity.read.texelSizeX, velocity.read.texelSizeY);
    gl.uniform1i(divergenceProgram.uniforms.uVelocity, velocity.read.attach(0));
    blit(divergence);

    clearProgram.bind();
    gl.uniform1i(clearProgram.uniforms.uTexture, pressure.read.attach(0));
    gl.uniform1f(clearProgram.uniforms.value, PRESSURE);
    blit(pressure.write);
    pressure.swap();

    pressureProgram.bind();
    gl.uniform2f(pressureProgram.uniforms.texelSize, velocity.read.texelSizeX, velocity.read.texelSizeY);
    gl.uniform1i(pressureProgram.uniforms.uDivergence, divergence.attach(0));
    for (let i = 0; i < PRESSURE_ITERATIONS; i++) {
      gl.uniform1i(pressureProgram.uniforms.uPressure, pressure.read.attach(1));
      blit(pressure.write);
      pressure.swap();
    }

    gradientSubtractProgram.bind();
    gl.uniform2f(gradientSubtractProgram.uniforms.texelSize, velocity.read.texelSizeX, velocity.read.texelSizeY);
    gl.uniform1i(gradientSubtractProgram.uniforms.uPressure, pressure.read.attach(0));
    gl.uniform1i(gradientSubtractProgram.uniforms.uVelocity, velocity.read.attach(1));
    blit(velocity.write);
    velocity.swap();

    advectionProgram.bind();
    gl.uniform2f(advectionProgram.uniforms.texelSize, velocity.read.texelSizeX, velocity.read.texelSizeY);
    const velocityUnit = velocity.read.attach(0);
    gl.uniform1i(advectionProgram.uniforms.uVelocity, velocityUnit);
    gl.uniform1i(advectionProgram.uniforms.uSource, velocityUnit);
    gl.uniform1f(advectionProgram.uniforms.dt, dt);
    gl.uniform1f(advectionProgram.uniforms.dissipation, VELOCITY_DISSIPATION);
    blit(velocity.write);
    velocity.swap();

    gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.attach(0));
    gl.uniform1i(advectionProgram.uniforms.uSource, dye.read.attach(1));
    gl.uniform1f(advectionProgram.uniforms.dissipation, DENSITY_DISSIPATION);
    blit(dye.write);
    dye.swap();
  };

  const render = () => {
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.BLEND);
    displayProgram.bind();
    gl.uniform2f(displayProgram.uniforms.texelSize, 1 / gl.drawingBufferWidth, 1 / gl.drawingBufferHeight);
    gl.uniform1i(displayProgram.uniforms.uTexture, dye.read.attach(0));
    blit(null);
  };

  const splat = (x: number, y: number, dx: number, dy: number, color: Color) => {
    const aspect = canvas.width / canvas.height;
    gl.disable(gl.BLEND);
    splatProgram.bind();
    gl.uniform1i(splatProgram.uniforms.uTarget, velocity.read.attach(0));
    gl.uniform1f(splatProgram.uniforms.aspectRatio, aspect);
    gl.uniform2f(splatProgram.uniforms.point, x, y);
    gl.uniform3f(splatProgram.uniforms.color, dx, dy, 0);
    gl.uniform1f(splatProgram.uniforms.radius, (SPLAT_RADIUS / 100) * Math.max(aspect, 1));
    blit(velocity.write);
    velocity.swap();

    gl.uniform1i(splatProgram.uniforms.uTarget, dye.read.attach(0));
    gl.uniform3f(splatProgram.uniforms.color, color.r, color.g, color.b);
    blit(dye.write);
    dye.swap();
  };

  const pointer = { x: 0, y: 0, dx: 0, dy: 0, moved: false, seen: false, color: randomColor() };
  let raf = 0;
  let lastTime = 0;
  let lastInput = 0;
  let colorTimer = 0;

  const frame = (now: number) => {
    const dt = Math.min((now - lastTime) / 1000, 1 / 60);
    lastTime = now;
    if (resizeCanvas()) initFramebuffers();

    colorTimer += dt * COLOR_UPDATE_SPEED;
    if (colorTimer >= 1) {
      colorTimer = 0;
      pointer.color = randomColor();
    }
    if (pointer.moved) {
      splat(pointer.x, pointer.y, pointer.dx * SPLAT_FORCE, pointer.dy * SPLAT_FORCE, pointer.color);
      pointer.moved = false;
      pointer.dx = 0;
      pointer.dy = 0;
    }

    step(dt);
    render();
    raf = now - lastInput > IDLE_MS ? 0 : requestAnimationFrame(frame);
  };

  const wake = () => {
    lastInput = performance.now();
    if (!raf) {
      lastTime = lastInput;
      raf = requestAnimationFrame(frame);
    }
  };

  const onMove = (e: PointerEvent) => {
    const x = e.clientX / window.innerWidth;
    const y = 1 - e.clientY / window.innerHeight;
    if (pointer.seen) {
      // Keep the push the same strength horizontally and vertically.
      const aspect = canvas.width / canvas.height;
      pointer.dx += (x - pointer.x) * (aspect < 1 ? aspect : 1);
      pointer.dy += (y - pointer.y) / (aspect > 1 ? aspect : 1);
      pointer.moved = true;
    }
    pointer.x = x;
    pointer.y = y;
    pointer.seen = true;
    wake();
  };

  const onDown = (e: PointerEvent) => {
    const color = randomColor();
    const burst = { r: color.r * 10, g: color.g * 10, b: color.b * 10 };
    const x = e.clientX / window.innerWidth;
    const y = 1 - e.clientY / window.innerHeight;
    splat(x, y, 10 * (Math.random() - 0.5), 30 * (Math.random() - 0.5), burst);
    wake();
  };

  resizeCanvas();
  initFramebuffers();
  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerdown", onDown);

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerdown", onDown);
  };
}

export default function FluidCursor() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2", {
      alpha: true,
      depth: false,
      stencil: false,
      antialias: false,
    });
    // Half-float render targets are required; without them the effect is simply skipped.
    if (!gl || !gl.getExtension("EXT_color_buffer_float")) return;
    return startFluid(canvas, gl);
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
}
