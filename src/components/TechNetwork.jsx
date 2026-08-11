import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { dotSpriteTexture } from '../utils/proceduralTextures';

const PURPLE = new THREE.Color('#8b7cf6');
const CYAN = new THREE.Color('#2fc8db');

/**
 * Hero background — a slowly-rotating 3D network of nodes and connecting
 * lines, with small "pulses" traveling along a few edges to read as data
 * flowing through a circuit. Approved in the hero preview before being
 * ported here; replaces the old 2D cursor-halo canvas.
 */
export default function TechNetwork({ containerRef, reducedMotion = false }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 100);
    camera.position.set(0, 0, 9);

    const group = new THREE.Group();
    scene.add(group);

    const COUNT = 80;
    const nodePositions = [];
    const nodeColors = [];
    for (let i = 0; i < COUNT; i++) {
      const x = (Math.random() - 0.5) * 15;
      const y = (Math.random() - 0.5) * 8.5;
      const z = (Math.random() - 0.5) * 8 - 2;
      nodePositions.push(new THREE.Vector3(x, y, z));
      const t = THREE.MathUtils.clamp(x / 15 + 0.5, 0, 1);
      nodeColors.push(PURPLE.clone().lerp(CYAN, t));
    }

    // Nodes — soft-sprite points, single draw call
    const nodeGeo = new THREE.BufferGeometry();
    const posArr = new Float32Array(COUNT * 3);
    const colArr = new Float32Array(COUNT * 3);
    nodePositions.forEach((p, i) => {
      posArr[i * 3] = p.x; posArr[i * 3 + 1] = p.y; posArr[i * 3 + 2] = p.z;
      colArr[i * 3] = nodeColors[i].r; colArr[i * 3 + 1] = nodeColors[i].g; colArr[i * 3 + 2] = nodeColors[i].b;
    });
    nodeGeo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
    nodeGeo.setAttribute('color', new THREE.BufferAttribute(colArr, 3));
    const nodeMat = new THREE.PointsMaterial({
      size: 0.16, map: dotSpriteTexture(), vertexColors: true,
      transparent: true, opacity: 0.9, depthWrite: false, sizeAttenuation: true,
    });
    const points = new THREE.Points(nodeGeo, nodeMat);
    group.add(points);

    // Edges between nearby nodes (cap connections per node so it doesn't get too dense)
    const linePositions = [];
    const lineColors = [];
    const THRESH = 3.1;
    const edges = [];
    for (let i = 0; i < COUNT; i++) {
      let connections = 0;
      for (let j = i + 1; j < COUNT; j++) {
        if (connections >= 3) break;
        if (nodePositions[i].distanceTo(nodePositions[j]) < THRESH) {
          linePositions.push(nodePositions[i].x, nodePositions[i].y, nodePositions[i].z);
          linePositions.push(nodePositions[j].x, nodePositions[j].y, nodePositions[j].z);
          lineColors.push(nodeColors[i].r, nodeColors[i].g, nodeColors[i].b);
          lineColors.push(nodeColors[j].r, nodeColors[j].g, nodeColors[j].b);
          edges.push([nodePositions[i], nodePositions[j]]);
          connections++;
        }
      }
    }
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePositions), 3));
    lineGeo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(lineColors), 3));
    const lineMat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.28 });
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    group.add(lines);

    // Traveling pulses — the "data flowing through the circuit" detail
    const PULSE_COUNT = reducedMotion ? 0 : 7;
    const pulses = [];
    for (let i = 0; i < PULSE_COUNT; i++) {
      const edge = edges[Math.floor(Math.random() * edges.length)];
      const color = Math.random() > 0.5 ? PURPLE : CYAN;
      const core = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 8), new THREE.MeshBasicMaterial({ color }));
      const halo = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 8), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.22 }));
      core.add(halo);
      group.add(core);
      pulses.push({ mesh: core, edge, t: Math.random(), speed: 0.15 + Math.random() * 0.15 });
    }

    const targetRot = { x: 0, y: 0 };
    const currentRot = { x: 0, y: 0 };
    const handleMouseMove = (e) => {
      const mx = (e.clientX / window.innerWidth) * 2 - 1;
      const my = (e.clientY / window.innerHeight) * 2 - 1;
      targetRot.y = mx * 0.12;
      targetRot.x = -my * 0.08;
    };

    const resize = () => {
      const rect = container.getBoundingClientRect();
      renderer.setSize(rect.width, rect.height || 1);
      camera.aspect = rect.width / (rect.height || 1);
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener('resize', resize);
    if (!reducedMotion) window.addEventListener('mousemove', handleMouseMove);
    // Catches layout changes a plain window 'resize' misses (e.g. CSS
    // media-query-driven box changes on initial mobile load).
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const clock = new THREE.Clock();
    let raf;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.getElapsedTime();

      if (!reducedMotion) {
        currentRot.x += (targetRot.x - currentRot.x) * 0.04;
        currentRot.y += (targetRot.y - currentRot.y) * 0.04;
        group.rotation.x = currentRot.x + Math.sin(t * 0.15) * 0.02;
        group.rotation.y = currentRot.y + t * 0.02;
      }

      pulses.forEach((p) => {
        p.t += dt * p.speed;
        if (p.t >= 1) {
          p.t = 0;
          p.edge = edges[Math.floor(Math.random() * edges.length)];
        }
        p.mesh.position.lerpVectors(p.edge[0], p.edge[1], p.t);
      });

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      ro.disconnect();
      renderer.dispose();
      nodeGeo.dispose();
      lineGeo.dispose();
      nodeMat.dispose();
      lineMat.dispose();
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material.dispose();
        }
      });
    };
  }, [containerRef, reducedMotion]);

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />;
}
