import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { noiseTexture, gradientStripTexture } from '../utils/proceduralTextures';

/**
 * Procedural humanoid bust — monitor-head figure that tracks the cursor.
 * v2: clearcoat materials + a subtle noise roughness/bump map (fabric feel
 * instead of flat CG plastic), two-tone violet/cyan rim lights matching the
 * brand gradient, emissive circuit trim on the shoulders, and an animated
 * gradient "scanline" under the eyes so the screen face reads as alive.
 */
export default function HeroFigure({ wrapRef, followSpeed = 0.08, reducedMotion = false }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const rect = wrap.getBoundingClientRect();
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(rect.width, rect.height || 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, rect.width / (rect.height || 1), 0.1, 100);
    camera.position.set(0, 0.15, 5.7);

    scene.add(new THREE.AmbientLight('#dfe1ee', 1.1));
    const key = new THREE.DirectionalLight('#ffffff', 1.3);
    key.position.set(2, 3, 4);
    scene.add(key);
    const rimPurple = new THREE.DirectionalLight('#8b7cf6', 1.1);
    rimPurple.position.set(-3, 1.4, -2);
    scene.add(rimPurple);
    const rimCyan = new THREE.DirectionalLight('#2fc8db', 0.9);
    rimCyan.position.set(3, -0.6, -2.6);
    scene.add(rimCyan);

    const figure = new THREE.Group();
    const noise = noiseTexture(128, 150, 210, 3);

    const suitMat = new THREE.MeshPhysicalMaterial({
      color: '#3d4152', roughness: 0.55, metalness: 0.18,
      clearcoat: 0.5, clearcoatRoughness: 0.35, roughnessMap: noise, bumpMap: noise, bumpScale: 0.012,
    });

    // Torso — cone-ish cylinder defines the shoulders. Do NOT add a shoulder
    // sphere here: an earlier pass had one and it visually ate the head box.
    const torso = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 0.85, 2.3, 32), suitMat);
    torso.position.y = -1.55;
    figure.add(torso);

    const collar = new THREE.Mesh(
      new THREE.BoxGeometry(0.66, 0.24, 0.56),
      new THREE.MeshPhysicalMaterial({ color: '#eef0f7', roughness: 0.4, clearcoat: 0.3 })
    );
    collar.position.set(0, -0.42, 0.12);
    figure.add(collar);

    const lapelMat = new THREE.MeshPhysicalMaterial({ color: '#262a36', roughness: 0.6, clearcoat: 0.3 });
    const lapelL = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.9, 0.06), lapelMat);
    lapelL.position.set(-0.34, -1.0, 0.58);
    lapelL.rotation.z = 0.28;
    const lapelR = lapelL.clone();
    lapelR.position.x = 0.34;
    lapelR.rotation.z = -0.28;
    figure.add(lapelL, lapelR);

    // Emissive circuit trim — the two-tone brand accent running along the shoulders
    const trimPurple = new THREE.Mesh(
      new THREE.TorusGeometry(1.05, 0.02, 8, 24, Math.PI * 0.5),
      new THREE.MeshBasicMaterial({ color: '#8b7cf6' })
    );
    trimPurple.rotation.set(Math.PI / 2, 0, Math.PI * 0.62);
    trimPurple.position.set(-0.55, -0.75, 0.2);
    figure.add(trimPurple);

    const trimCyan = trimPurple.clone();
    trimCyan.material = new THREE.MeshBasicMaterial({ color: '#2fc8db' });
    trimCyan.rotation.set(Math.PI / 2, 0, -Math.PI * 0.12);
    trimCyan.position.set(0.55, -0.75, 0.2);
    figure.add(trimCyan);

    const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.21, 1.7, 16), suitMat);
    armL.position.set(-1.28, -1.85, 0);
    armL.rotation.z = 0.22;
    const armR = armL.clone();
    armR.position.x = 1.28;
    armR.rotation.z = -0.22;
    figure.add(armL, armR);

    const neck = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.32, 0.3, 16),
      new THREE.MeshPhysicalMaterial({ color: '#2f3340', roughness: 0.6 })
    );
    neck.position.y = -0.28;
    figure.add(neck);

    const headGroup = new THREE.Group();
    headGroup.position.y = 0.55;
    const head = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 1.3, 1.2),
      new THREE.MeshPhysicalMaterial({ color: '#1b1c26', roughness: 0.35, metalness: 0.25, clearcoat: 0.6, clearcoatRoughness: 0.25 })
    );
    headGroup.add(head);

    const screen = new THREE.Mesh(
      new THREE.BoxGeometry(1.15, 0.85, 0.05),
      new THREE.MeshPhysicalMaterial({ color: '#0d0e14', roughness: 0.3, clearcoat: 0.4 })
    );
    screen.position.set(0, 0.05, 0.63);
    headGroup.add(screen);

    // Animated gradient scanline under the eyes — the "screen is alive" detail
    const scanlineMat = new THREE.MeshBasicMaterial({
      map: gradientStripTexture('#8b7cf6', '#2fc8db'), transparent: true, opacity: 0.6,
    });
    const scanline = new THREE.Mesh(new THREE.PlaneGeometry(0.95, 0.05), scanlineMat);
    scanline.position.set(0, -0.22, 0.665);
    headGroup.add(scanline);

    const eyeGeo = new THREE.SphereGeometry(0.09, 16, 16);
    const eyeL = new THREE.Mesh(eyeGeo, new THREE.MeshBasicMaterial({ color: '#8b7cf6' }));
    eyeL.position.set(-0.28, 0.05, 0.68);
    const eyeR = new THREE.Mesh(eyeGeo, new THREE.MeshBasicMaterial({ color: '#2fc8db' }));
    eyeR.position.set(0.28, 0.05, 0.68);
    headGroup.add(eyeL, eyeR);

    figure.add(headGroup);
    scene.add(figure);

    const target = { rx: 0, ry: 0 };
    const current = { rx: 0, ry: 0 };
    const clock = new THREE.Clock();
    let raf;

    const handleMouseMove = (e) => {
      const r = wrap.getBoundingClientRect();
      const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
      const ny = ((e.clientY - r.top) / r.height) * 2 - 1;
      target.ry = Math.max(-0.6, Math.min(0.6, nx * 0.6));
      target.rx = Math.max(-0.35, Math.min(0.35, -ny * 0.4));
    };

    const handleResize = () => {
      const r = wrap.getBoundingClientRect();
      renderer.setSize(r.width, r.height || 1);
      camera.aspect = r.width / (r.height || 1);
      camera.updateProjectionMatrix();
    };

    const animate = () => {
      raf = requestAnimationFrame(animate);
      current.rx += (target.rx - current.rx) * followSpeed;
      current.ry += (target.ry - current.ry) * followSpeed;
      const t = clock.getElapsedTime();
      const idle = reducedMotion ? 0 : 1;
      headGroup.rotation.x = current.rx;
      headGroup.rotation.y = current.ry + Math.sin(t * 0.4) * 0.03 * idle;
      figure.rotation.y = current.ry * 0.25;
      headGroup.position.y = 0.55 + Math.sin(t * 1.1) * 0.03 * idle;
      figure.position.y = Math.sin(t * 0.8) * 0.04 * idle;
      scanlineMat.opacity = 0.35 + Math.sin(t * 2) * 0.25 * idle;
      renderer.render(scene, camera);
    };
    animate();

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    // window 'resize' only fires on actual viewport size changes — it does
    // NOT fire when a CSS media query alone changes this element's box
    // (e.g. the very first paint on a phone, or a mobile browser's UI
    // chrome show/hide). ResizeObserver catches those cases too, which is
    // what was making the canvas render at a stale/zero size on mobile.
    const ro = new ResizeObserver(handleResize);
    ro.observe(wrap);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      ro.disconnect();
      renderer.dispose();
      noise.dispose();
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material.dispose();
        }
      });
    };
  }, [wrapRef, followSpeed, reducedMotion]);

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />;
}
