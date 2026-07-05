"use client";

import React, { CSSProperties, useEffect, useRef } from "react";

interface AnimationConfig {
  scale: number;
  speed: number;
}

interface NoiseConfig {
  opacity: number;
  scale: number;
}

interface EtheralShadowProps {
  color?: string;
  animation?: AnimationConfig;
  noise?: NoiseConfig;
  sizing?: "fill" | "stretch";
  style?: CSSProperties;
  className?: string;
}

const fragmentShaderSource = `#version 300 es
precision highp float;
out vec4 O;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec3 u_color;
uniform float u_speed;
uniform float u_detail;
uniform vec2 u_mouse;
uniform float u_stir;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float vnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 r = mat2(0.8, -0.6, 0.6, 0.8);
  for (int i = 0; i < 5; i++) {
    v += a * vnoise(p);
    p = r * p * 2.0;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution) / u_resolution.y;
  float t = u_time * u_speed;

  vec2 p = uv * u_detail;

  // Cursor stir: swirl the noise domain around the pointer, fading with distance
  vec2 mv = uv - u_mouse;
  float md = max(length(mv), 0.12);
  float infl = exp(-md * md * 6.0) * u_stir;
  p += (vec2(-mv.y, mv.x) / md) * infl * 0.9;

  vec2 q = vec2(
    fbm(p + vec2(0.0, t * 0.15)),
    fbm(p + vec2(5.2, 1.3) + t * 0.10)
  );
  vec2 r = vec2(
    fbm(p + 4.0 * q + vec2(1.7, 9.2) + t * 0.18),
    fbm(p + 4.0 * q + vec2(8.3, 2.8) + t * 0.14)
  );
  float n = fbm(p + 2.5 * r);

  float cloud = smoothstep(0.05, 0.95, n);
  cloud = pow(cloud, 1.3);

  float hue = sin(t * 0.4 + n * 6.2831) * 0.5 + 0.5;
  vec3 tint = mix(
    u_color,
    vec3(u_color.b, u_color.r, u_color.g) * 1.05,
    hue * 0.35
  );

  vec2 vUv = gl_FragCoord.xy / u_resolution - 0.5;
  vUv.x *= u_resolution.x / u_resolution.y;
  float vig = 1.0 - smoothstep(0.4, 1.15, length(vUv));

  vec3 col = tint * cloud * vig;

  O = vec4(col, 1.0);
}`;

const vertexShaderSource = `#version 300 es
precision highp float;
in vec4 position;
void main() { gl_Position = position; }`;

const parseColor = (input: string): [number, number, number] => {
  const m = input.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (m) {
    return [
      parseInt(m[1], 10) / 255,
      parseInt(m[2], 10) / 255,
      parseInt(m[3], 10) / 255,
    ];
  }
  const hex = input.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (hex) {
    return [
      parseInt(hex[1], 16) / 255,
      parseInt(hex[2], 16) / 255,
      parseInt(hex[3], 16) / 255,
    ];
  }
  return [0.16, 0.31, 0.71];
};

export function EtheralShadow({
  color = "rgba(40, 80, 180, 1)",
  animation,
  noise,
  style,
  className,
}: EtheralShadowProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colorRef = useRef(parseColor(color));
  const speedRef = useRef(animation ? animation.speed : 50);
  const detailRef = useRef(animation ? animation.scale : 60);

  useEffect(() => {
    colorRef.current = parseColor(color);
  }, [color]);

  useEffect(() => {
    speedRef.current = animation ? animation.speed : 50;
    detailRef.current = animation ? animation.scale : 60;
  }, [animation]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2", { antialias: false, alpha: false });
    if (!gl) return;

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compile(gl.VERTEX_SHADER, vertexShaderSource);
    const fs = compile(gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vs || !fs) return;

    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]),
      gl.STATIC_DRAW
    );

    const pos = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uResolution = gl.getUniformLocation(program, "u_resolution");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uColor = gl.getUniformLocation(program, "u_color");
    const uSpeed = gl.getUniformLocation(program, "u_speed");
    const uDetail = gl.getUniformLocation(program, "u_detail");
    const uMouse = gl.getUniformLocation(program, "u_mouse");
    const uStir = gl.getUniformLocation(program, "u_stir");

    const resize = () => {
      const w = canvas.clientWidth || window.innerWidth;
      const h = canvas.clientHeight || window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    };
    resize();
    window.addEventListener("resize", resize);

    // Pointer stirring: strength builds with cursor speed, decays each frame.
    // Coordinates converted to the shader's centered, aspect-corrected uv space.
    const mouseTarget = [10, 10];
    const mouseSmooth = [10, 10];
    let stir = 0;
    let lastX = 0;
    let lastY = 0;
    let hasLast = false;
    const onPointerMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      if (!r.height) return;
      const x = (e.clientX - r.left - r.width / 2) / r.height;
      const y = (r.height / 2 - (e.clientY - r.top)) / r.height;
      if (hasLast) {
        stir = Math.min(1.2, stir + Math.hypot(x - lastX, y - lastY) * 6);
      }
      lastX = x;
      lastY = y;
      hasLast = true;
      mouseTarget[0] = x;
      mouseTarget[1] = y;
      if (mouseSmooth[0] > 5) {
        // First move: snap instead of gliding in from offscreen
        mouseSmooth[0] = x;
        mouseSmooth[1] = y;
      }
    };
    window.addEventListener("pointermove", onPointerMove);

    let raf = 0;
    const start = performance.now();
    const loop = (now: number) => {
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform1f(uTime, (now - start) * 1e-3);
      gl.uniform3fv(uColor, colorRef.current);
      // Map speed (0..100) to a calm range so the look stays drifting, not strobing
      gl.uniform1f(uSpeed, 0.05 + (speedRef.current / 100) * 0.35);
      // Map scale (0..100) to FBM detail multiplier (smaller = larger soft cloud)
      gl.uniform1f(uDetail, 0.6 + (detailRef.current / 100) * 1.8);
      mouseSmooth[0] += (mouseTarget[0] - mouseSmooth[0]) * 0.08;
      mouseSmooth[1] += (mouseTarget[1] - mouseSmooth[1]) * 0.08;
      stir *= 0.985;
      gl.uniform2f(uMouse, mouseSmooth[0], mouseSmooth[1]);
      gl.uniform1f(uStir, stir);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      cancelAnimationFrame(raf);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buffer);
    };
  }, []);

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        ...style,
      }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
      {noise && noise.opacity > 0 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url("https://framerusercontent.com/images/g0QcWrxr87K0ufOxIUFBakwYA8.png")`,
            backgroundSize: noise.scale * 200,
            backgroundRepeat: "repeat",
            opacity: noise.opacity / 2,
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
}
