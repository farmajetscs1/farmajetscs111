import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  Play,
  Pause,
  RotateCcw,
  Scissors,
  Eye,
  Sliders,
  Layers,
  Volume2,
  Sparkles,
  Radio,
  Zap,
  Activity,
  Compass
} from 'lucide-react';

export type VisualizerMode =
  | 'horn_torus_structure'
  | 'invocant_horn'
  | 'trauma_flow'
  | 'partial_drives'
  | 'ricci_surgery';

export type ActiveDriveType = 'all' | 'invocante' | 'fantasia' | 'trauma' | 'oral' | 'anal' | 'escopica';

interface ManifoldVisualizerProps {
  initialMode?: VisualizerMode;
  onSelectItem?: (id: string) => void;
}

export const ManifoldVisualizer: React.FC<ManifoldVisualizerProps> = ({
  initialMode = 'invocant_horn',
  onSelectItem
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<VisualizerMode>(initialMode);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  // Geometric Horn Torus parameters
  const [torusRatio, setTorusRatio] = useState<number>(1.0); // 1.0 = Horn Torus (R = r)
  const [crossSectionCut, setCrossSectionCut] = useState<boolean>(false); // Cut in half to see cusp
  const [showWireframe, setShowWireframe] = useState<boolean>(true);
  const [showCuspDetail, setShowCuspDetail] = useState<boolean>(true);

  // Drives and flux animation
  const [activeDrive, setActiveDrive] = useState<ActiveDriveType>('invocante');
  const [driveSpeed, setDriveSpeed] = useState<number>(1.2);
  const [somaticFluxS, setSomaticFluxS] = useState<number>(1.0); // Triebfeder s
  const [nachtraglichkeitSurge, setNachtraglichkeitSurge] = useState<boolean>(false);

  // Surgery & Ricci flow
  const [ricciTime, setRicciTime] = useState<number>(0.0);
  const [isSurgeryPerformed, setIsSurgeryPerformed] = useState<boolean>(false);

  // Oscilloscope voice/superego readings
  const [voiceSignalY, setVoiceSignalY] = useState<number>(0.42);
  const [superegoSignalU, setSuperegoSignalU] = useState<number>(0.85);

  // Three.js internal references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animFrameId = useRef<number | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const driveParticlesRef = useRef<{
    invocantParticles: THREE.Points | null;
    fantasyParticles: THREE.Points | null;
    traumaParticles: THREE.Points | null;
    partialParticles: THREE.Points | null;
  }>({
    invocantParticles: null,
    fantasyParticles: null,
    traumaParticles: null,
    partialParticles: null
  });

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  // Setup Three.js scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x06080d);

    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 5.2, 9.2);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x38bdf8, 1.4);
    dirLight1.position.set(6, 12, 8);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xa855f7, 0.95);
    dirLight2.position.set(-8, -6, -6);
    scene.add(dirLight2);

    const dirLight3 = new THREE.DirectionalLight(0xf59e0b, 0.6);
    dirLight3.position.set(0, -8, 0);
    scene.add(dirLight3);

    // Subtle coordinate floor
    const grid = new THREE.GridHelper(16, 16, 0x1e293b, 0x0f172a);
    grid.position.y = -2.6;
    scene.add(grid);

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);
    groupRef.current = mainGroup;

    // Mouse drag rotation
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !groupRef.current) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      groupRef.current.rotation.y += deltaX * 0.006;
      groupRef.current.rotation.x += deltaY * 0.006;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (!cameraRef.current) return;
      cameraRef.current.position.z = Math.max(4.2, Math.min(20, cameraRef.current.position.z + e.deltaY * 0.01));
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    domElement.addEventListener('wheel', handleWheel, { passive: false });

    const handleResize = () => {
      if (!container || !cameraRef.current || !rendererRef.current) return;
      cameraRef.current.aspect = container.clientWidth / container.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      domElement.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      domElement.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  // Geometry builder: Mathematically generates the exact Horn Torus with cusp and drive trajectories
  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;

    // Dispose old meshes and geometries
    while (group.children.length > 0) {
      const obj = group.children[0];
      group.remove(obj);
      if ((obj as THREE.Mesh).geometry) (obj as THREE.Mesh).geometry.dispose();
      if ((obj as THREE.Mesh).material) {
        const mat = (obj as THREE.Mesh).material;
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else mat.dispose();
      }
    }

    const R_BASE = 2.4;
    const r_val = R_BASE * torusRatio; // R = r gives the exact Horn Torus!

    // 1. Parametric Horn Torus Mesh Generation
    const segmentsU = 72;
    const segmentsV = 64;
    const geom = new THREE.BufferGeometry();
    const positions: number[] = [];
    const normals: number[] = [];
    const colors: number[] = [];
    const indices: number[] = [];

    const maxU = crossSectionCut ? Math.PI * 1.5 : Math.PI * 2;

    for (let i = 0; i <= segmentsU; i++) {
      const u = (i / segmentsU) * maxU;
      for (let j = 0; j <= segmentsV; j++) {
        const v = (j / segmentsV) * Math.PI * 2;

        let radialDist = R_BASE + r_val * Math.cos(v);
        let z_coord = r_val * Math.sin(v);

        // Trauma bottleneck region at u ~ PI/2, v ~ 0
        const distToTrauma = Math.hypot(u - Math.PI / 2, v - 0.2);
        let traumaDeformation = 0;

        if (mode === 'trauma_flow' || mode === 'ricci_surgery') {
          if (!isSurgeryPerformed) {
            const surgeFactor = nachtraglichkeitSurge ? 1.4 : 1.0;
            traumaDeformation = Math.exp(-distToTrauma * 4.0) * (0.85 * surgeFactor - ricciTime * 0.5);
          } else {
            // Post Perelman surgery: smoothed spherical cap
            traumaDeformation = distToTrauma < 0.35 ? 0 : Math.exp(-distToTrauma * 4.0) * 0.05;
          }
        }

        radialDist = Math.max(0.001, radialDist - traumaDeformation);

        const x = radialDist * Math.cos(u);
        const y = z_coord;
        const z = radialDist * Math.sin(u);

        positions.push(x, y, z);

        const nx = Math.cos(v) * Math.cos(u);
        const ny = Math.sin(v);
        const nz = Math.cos(v) * Math.sin(u);
        normals.push(nx, ny, nz);

        // Curvature calculation K = cos v / (r * (R + r cos v))
        const denom = r_val * (R_BASE + r_val * Math.cos(v));
        const theoreticalK = Math.abs(denom) > 0.08 ? Math.cos(v) / denom : (Math.cos(v) >= 0 ? 5.0 : -5.0);

        if ((mode === 'trauma_flow' || mode === 'ricci_surgery') && distToTrauma < 0.45) {
          if (isSurgeryPerformed) {
            colors.push(0.1, 0.85, 0.6); // Healed smooth cap
          } else {
            colors.push(0.95, 0.2, 0.3); // High singular curvature
          }
        } else if (Math.abs(radialDist) < 0.25) {
          colors.push(0.95, 0.75, 0.2); // Cusp contact c
        } else if (theoreticalK > 0) {
          colors.push(0.12, 0.45 + Math.min(0.5, theoreticalK * 0.4), 0.85);
        } else {
          colors.push(0.35, 0.2, 0.65);
        }
      }
    }

    for (let i = 0; i < segmentsU; i++) {
      for (let j = 0; j < segmentsV; j++) {
        const a = i * (segmentsV + 1) + j;
        const b = (i + 1) * (segmentsV + 1) + j;
        const c = (i + 1) * (segmentsV + 1) + (j + 1);
        const d = i * (segmentsV + 1) + (j + 1);
        indices.push(a, b, d);
        indices.push(b, c, d);
      }
    }

    geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geom.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    geom.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geom.setIndex(indices);

    const torusMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.35,
      metalness: 0.15,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: crossSectionCut ? 0.95 : 0.88
    });
    const torusMesh = new THREE.Mesh(geom, torusMat);
    group.add(torusMesh);

    if (showWireframe) {
      const wireMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        wireframe: true,
        transparent: true,
        opacity: 0.12
      });
      group.add(new THREE.Mesh(geom, wireMat));
    }

    // 2. CUSP POINT c = (0, 0, 0)
    const cuspPoint = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 24, 24),
      new THREE.MeshStandardMaterial({
        color: 0xfbbf24,
        emissive: 0xd97706,
        emissiveIntensity: 0.95
      })
    );
    cuspPoint.position.set(0, 0, 0);
    group.add(cuspPoint);

    // 3. TWO HORN BOUNDARIES: B+ (oído / superyó) & B- (voz / manifestación)
    if (showCuspDetail) {
      const hornRingRadius = 0.42;
      const hornHeight = 0.55;

      // B+ (Cuerno Superior / Lo Oído / Entrada u(t) del Superyó)
      const bPlus = new THREE.Mesh(
        new THREE.TorusGeometry(hornRingRadius, 0.035, 16, 48),
        new THREE.MeshStandardMaterial({ color: 0x06b6d4, emissive: 0x0891b2, emissiveIntensity: 0.85 })
      );
      bPlus.position.set(0, hornHeight, 0);
      bPlus.rotation.x = Math.PI / 2;
      group.add(bPlus);

      // B- (Cuerno Inferior / Lo Vocalizado / Salida y(t) de la Voz)
      const bMinus = new THREE.Mesh(
        new THREE.TorusGeometry(hornRingRadius, 0.035, 16, 48),
        new THREE.MeshStandardMaterial({ color: 0xa855f7, emissive: 0x7e22ce, emissiveIntensity: 0.85 })
      );
      bMinus.position.set(0, -hornHeight, 0);
      bMinus.rotation.x = Math.PI / 2;
      group.add(bMinus);

      // Cusp tangent axis
      const axisGeom = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 1.25, 0),
        new THREE.Vector3(0, -1.25, 0)
      ]);
      const axisLine = new THREE.Line(axisGeom, new THREE.LineDashedMaterial({ color: 0xf59e0b, dashSize: 0.1, gapSize: 0.05 }));
      group.add(axisLine);
    }

    // 4. PRIMARY FANTASY NUCLEUS n ∈ S \ {c} (Variante A: n ≠ c)
    const nucleusAngle = Math.PI * 0.15;
    const n_R = R_BASE + r_val * Math.cos(0);
    const n_x = n_R * Math.cos(nucleusAngle);
    const n_y = r_val * Math.sin(0);
    const n_z = n_R * Math.sin(nucleusAngle);

    const nucleusMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 24, 24),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xb45309, emissiveIntensity: 0.9 })
    );
    nucleusMesh.position.set(n_x, n_y, n_z);
    group.add(nucleusMesh);

    // Angst boundary wall B(n) = {r = δ} with kg = 1/δ
    const angstRadius = 0.55;
    const angstCurvePts: THREE.Vector3[] = [];
    for (let k = 0; k <= 48; k++) {
      const th = (k / 48) * Math.PI * 2;
      angstCurvePts.push(new THREE.Vector3(
        n_x + Math.cos(th) * angstRadius,
        n_y + Math.sin(th) * (angstRadius * 0.7),
        n_z + Math.sin(th) * (angstRadius * 0.7)
      ));
    }
    const angstCurve = new THREE.CatmullRomCurve3(angstCurvePts);
    const angstTube = new THREE.Mesh(
      new THREE.TubeGeometry(angstCurve, 48, 0.03, 10, true),
      new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xb91c1c, emissiveIntensity: 0.9 })
    );
    group.add(angstTube);

    // Fantasy limit cycle C_θ
    const fantasyPts: THREE.Vector3[] = [];
    for (let k = 0; k <= 64; k++) {
      const th = (k / 64) * Math.PI * 2;
      const orbitR = angstRadius * 1.35;
      fantasyPts.push(new THREE.Vector3(
        n_x + Math.cos(th) * orbitR,
        n_y + Math.sin(th) * (orbitR * 0.7),
        n_z + Math.sin(th) * (orbitR * 0.7)
      ));
    }
    const fantasyCurve = new THREE.CatmullRomCurve3(fantasyPts);
    const fantasyTube = new THREE.Mesh(
      new THREE.TubeGeometry(fantasyCurve, 64, 0.038, 10, true),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.9 })
    );
    group.add(fantasyTube);

    // 5. TRAUMA MARK p_i ∈ V_T
    const traumaAngle = Math.PI / 2;
    const t_R = R_BASE + r_val * Math.cos(0.2);
    const tx = t_R * Math.cos(traumaAngle);
    const ty = r_val * Math.sin(0.2);
    const tz = t_R * Math.sin(traumaAngle);

    if (!isSurgeryPerformed) {
      const traumaMarker = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 16, 16),
        new THREE.MeshStandardMaterial({ color: 0xf43f5e, emissive: 0xe11d48, emissiveIntensity: 1.0 })
      );
      traumaMarker.position.set(tx, ty, tz);
      group.add(traumaMarker);
    }

    // 6. DYNAMIC DRIVE PARTICLE STREAMS (Las Pulsiones recorriendo el Horn Torus)
    // Stream A: Pulsión Invocante (Superyó B+ -> Cúspide c -> Voz B-)
    const invocantNumParticles = 60;
    const invocantPositions = new Float32Array(invocantNumParticles * 3);
    const invocantColors = new Float32Array(invocantNumParticles * 3);

    for (let p = 0; p < invocantNumParticles; p++) {
      const frac = p / invocantNumParticles;
      const phi = frac * Math.PI * 2;
      const rad = R_BASE + r_val * Math.cos(phi);
      invocantPositions[p * 3] = rad * Math.cos(phi);
      invocantPositions[p * 3 + 1] = r_val * Math.sin(phi);
      invocantPositions[p * 3 + 2] = rad * Math.sin(phi);

      // Color gradation: Violet to Crimson
      invocantColors[p * 3] = 0.95;
      invocantColors[p * 3 + 1] = 0.2 + frac * 0.4;
      invocantColors[p * 3 + 2] = 0.85;
    }

    const invocantGeom = new THREE.BufferGeometry();
    invocantGeom.setAttribute('position', new THREE.BufferAttribute(invocantPositions, 3));
    invocantGeom.setAttribute('color', new THREE.BufferAttribute(invocantColors, 3));

    const invocantParticlesMesh = new THREE.Points(
      invocantGeom,
      new THREE.PointsMaterial({
        size: 0.14,
        vertexColors: true,
        transparent: true,
        opacity: 0.95
      })
    );
    group.add(invocantParticlesMesh);
    driveParticlesRef.current.invocantParticles = invocantParticlesMesh;

    // Stream B: Fantasy stream circling around n (atractor de Poincaré-Bendixson)
    const fantasyNumParticles = 40;
    const fantasyPositions = new Float32Array(fantasyNumParticles * 3);
    for (let p = 0; p < fantasyNumParticles; p++) {
      const th = (p / fantasyNumParticles) * Math.PI * 2;
      const or = angstRadius * 1.35;
      fantasyPositions[p * 3] = n_x + Math.cos(th) * or;
      fantasyPositions[p * 3 + 1] = n_y + Math.sin(th) * (or * 0.7);
      fantasyPositions[p * 3 + 2] = n_z + Math.sin(th) * (or * 0.7);
    }
    const fantasyGeom = new THREE.BufferGeometry();
    fantasyGeom.setAttribute('position', new THREE.BufferAttribute(fantasyPositions, 3));
    const fantasyParticlesMesh = new THREE.Points(
      fantasyGeom,
      new THREE.PointsMaterial({
        size: 0.12,
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.9
      })
    );
    group.add(fantasyParticlesMesh);
    driveParticlesRef.current.fantasyParticles = fantasyParticlesMesh;

    // Stream C: 4 Partial Drives (Oral, Anal, Escópica, Invocante)
    if (mode === 'partial_drives') {
      const driveCycles = [
        { name: 'Oral', r: angstRadius * 1.25, color: 0x06b6d4 },
        { name: 'Anal', r: angstRadius * 1.75, color: 0xf59e0b },
        { name: 'Escópica', r: angstRadius * 2.25, color: 0x10b981 },
        { name: 'Invocante', r: angstRadius * 2.75, color: 0xa855f7 }
      ];

      driveCycles.forEach((dc) => {
        const pts: THREE.Vector3[] = [];
        for (let k = 0; k <= 48; k++) {
          const th = (k / 48) * Math.PI * 2;
          pts.push(new THREE.Vector3(
            n_x + Math.cos(th) * dc.r,
            n_y + Math.sin(th) * (dc.r * 0.7),
            n_z + Math.sin(th) * (dc.r * 0.7)
          ));
        }
        const c3 = new THREE.CatmullRomCurve3(pts);
        const tg = new THREE.TubeGeometry(c3, 48, 0.025, 8, true);
        const tm = new THREE.MeshStandardMaterial({ color: dc.color, emissive: dc.color, emissiveIntensity: 0.75 });
        group.add(new THREE.Mesh(tg, tm));
      });
    }

  }, [
    mode,
    torusRatio,
    crossSectionCut,
    showWireframe,
    showCuspDetail,
    ricciTime,
    isSurgeryPerformed,
    nachtraglichkeitSurge
  ]);

  // Animation Loop with Real-time Drive Particle Flux along the Horn Torus
  useEffect(() => {
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameId.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      if (isPlaying && groupRef.current) {
        // Slow subtle rotation
        groupRef.current.rotation.y += 0.18 * delta * driveSpeed;

        // Animate particles flowing through the cusp B+ -> c -> B-
        const invParticles = driveParticlesRef.current.invocantParticles;
        if (invParticles) {
          const posAttr = invParticles.geometry.attributes.position as THREE.BufferAttribute;
          if (posAttr) {
            const arr = posAttr.array as Float32Array;
            const count = arr.length / 3;
            const R_BASE = 2.4;
            const r_val = R_BASE * torusRatio;

            for (let i = 0; i < count; i++) {
              // Current parametric angle
              let phi = ((i / count) * Math.PI * 2 + elapsed * 1.4 * driveSpeed) % (Math.PI * 2);
              const rad = R_BASE + r_val * Math.cos(phi);
              arr[i * 3] = rad * Math.cos(phi);
              arr[i * 3 + 1] = r_val * Math.sin(phi);
              arr[i * 3 + 2] = rad * Math.sin(phi);
            }
            posAttr.needsUpdate = true;
          }
        }

        // Live oscilloscope telemetry calculation
        const voiceVal = 0.5 + 0.35 * Math.sin(elapsed * 2.2 * driveSpeed) + 0.15 * Math.cos(elapsed * 4.5);
        const superegoVal = 0.8 + 0.2 * Math.cos(elapsed * 1.5 * driveSpeed);
        setVoiceSignalY(voiceVal);
        setSuperegoSignalU(superegoVal);
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animFrameId.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [isPlaying, driveSpeed, torusRatio]);

  const handleResetCamera = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 5.2, 9.2);
      cameraRef.current.lookAt(0, 0, 0);
    }
    if (groupRef.current) {
      groupRef.current.rotation.set(0.35, -0.4, 0);
    }
  };

  const triggerNachtraglichkeit = () => {
    setNachtraglichkeitSurge(true);
    setTimeout(() => setNachtraglichkeitSurge(false), 2400);
  };

  return (
    <div className="relative w-full h-[660px] bg-[#06080d] border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col">
      {/* Top Header & Mode Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b border-slate-800 bg-[#0c1017]/95 backdrop-blur-md z-10">
        <div className="flex items-center gap-2">
          <span className="font-display font-semibold text-sm text-slate-100 whitespace-nowrap">
            Dinámica Pulsional en el Horn Torus S
          </span>
          <span className="text-slate-600">/</span>
          <span className="text-xs font-mono text-cyan-400 tabular-nums">
            {mode === 'invocant_horn' && 'PULSIÓN INVOCANTE (VOZ & SUPERYÓ EN CÚSPIDE c)'}
            {mode === 'trauma_flow' && 'PULSIÓN & MARCA TRAUMÁTICA p_i'}
            {mode === 'partial_drives' && '4 PULSIONES PARCIALES (ORAL/ANAL/ESCÓPICA/INVOCANTE)'}
            {mode === 'horn_torus_structure' && 'ESTRUCTURA GEOMÉTRICA HORN TORUS'}
            {mode === 'ricci_surgery' && 'CIRUGÍA DE PERELMAN & CONTRAINVESTIDURA'}
          </span>
        </div>

        {/* View Mode Buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
          <button
            onClick={() => setMode('invocant_horn')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              mode === 'invocant_horn'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Voz, Superyó & Invocante
          </button>
          <button
            onClick={() => setMode('trauma_flow')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              mode === 'trauma_flow'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Trauma & Nachträglichkeit
          </button>
          <button
            onClick={() => setMode('partial_drives')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              mode === 'partial_drives'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            4 Pulsiones Parciales
          </button>
          <button
            onClick={() => setMode('ricci_surgery')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              mode === 'ricci_surgery'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Cirugía & Fantasía
          </button>
        </div>
      </div>

      {/* Main 3D Canvas Stage */}
      <div className="relative flex-1 w-full h-full cursor-grab active:cursor-grabbing">
        <div ref={mountRef} className="w-full h-full" />

        {/* Floating Real-time Metapsychological Telemetry Box (Left HUD) */}
        <div className="absolute top-4 left-4 p-4 bg-[#0b0f17]/90 backdrop-blur-md border border-slate-800 rounded-xl max-w-sm pointer-events-auto space-y-2.5 text-xs shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 font-mono text-cyan-400 text-[11px] uppercase tracking-wider">
            <span>¿Cómo Recorren las Pulsiones el Horn Torus?</span>
          </div>

          <div className="space-y-2 text-slate-300 leading-relaxed">
            <div className="p-2 bg-slate-950/70 border border-slate-800 rounded">
              <strong className="text-cyan-300 block mb-0.5">1. La Pulsión Invocante (Voz y Superyó):</strong>
              Es la <em>única</em> pulsión que atraviesa el orificio central de la cúspide c = (0,0,0). Entra por el cuerno superior B⁺ (la voz del superyó / lo oído u(t)) y sale por el cuerno inferior B⁻ (la voz emitida por el sujeto y(t)). Representa el generador π₁(S) ≅ ℤ.
            </div>

            <div className="p-2 bg-slate-950/70 border border-slate-800 rounded">
              <strong className="text-amber-300 block mb-0.5">2. El Núcleo de la Fantasía n y la Angustia:</strong>
              La pulsión tiende hacia el núcleo n como un sumidero, pero la <strong>pared rígida de angustia</strong> B(n) con k_g = 1/δ impide que caiga en él. La pulsión queda atrapada en el ciclo límite atractor C_θ.
            </div>

            <div className="p-2 bg-slate-950/70 border border-slate-800 rounded">
              <strong className="text-rose-300 block mb-0.5">3. Lo Traumático (p_i ∈ V_T):</strong>
              Cuando un evento despierta una marca mnémica reprimida (<em>Nachträglichkeit</em>), la cantidad Q inunda el cuello de p_i, provocando hipertensión de curvatura K que obliga al Yo a pagar un gasto (<em>Aufwand</em>) por Gauss-Bonnet.
            </div>
          </div>
        </div>

        {/* Real-time Oscilloscope HUD: Voice y(t) & Super-Ego u(t) (Right HUD) */}
        <div className="absolute top-4 right-4 p-3.5 bg-[#0b0f17]/90 backdrop-blur-md border border-slate-800 rounded-xl w-72 pointer-events-auto space-y-2.5 text-xs shadow-xl">
          <div className="flex items-center justify-between font-mono text-[11px] text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-800">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <Activity className="w-3.5 h-3.5" />
              <span>Osciloscopio Acústico</span>
            </span>
            <span className="text-emerald-400 font-mono text-[10px]">EN VIVO</span>
          </div>

          <div className="space-y-1.5 font-mono text-[11px]">
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-cyan-400">Voz Saliente y(t):</span>
              <span className="text-slate-100 font-bold tabular-nums">{voiceSignalY.toFixed(3)} u</span>
            </div>
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-cyan-400 h-full transition-all duration-75"
                style={{ width: `${Math.min(100, voiceSignalY * 100)}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-slate-300 pt-1">
              <span className="text-purple-400">Superyó Entrante u(t):</span>
              <span className="text-slate-100 font-bold tabular-nums">{superegoSignalU.toFixed(3)} rad</span>
            </div>
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-purple-400 h-full transition-all duration-75"
                style={{ width: `${Math.min(100, superegoSignalU * 100)}%` }}
              />
            </div>
          </div>

          <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800/80 leading-tight">
            Par Dirichlet a Neumann en el puerto de la cúspide B = B⁺ ∪ B⁻: u = K|_B e y = ∫_B ∂_ν K ds.
          </div>
        </div>

        {/* Legend Overlay at Bottom Right */}
        <div className="absolute bottom-4 right-4 p-3 bg-[#0b0f17]/90 backdrop-blur-md border border-slate-800 rounded-xl text-xs space-y-1.5 pointer-events-auto shadow-lg">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Flujo de Pulsiones
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400 inline-block shrink-0 animate-pulse" />
            <span>Pulsión Invocante (Cruza $B^+ \to c \to B^-$)</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block shrink-0" />
            <span>Circuito de Fantasía $C_\theta$ (Bordea $n$)</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block shrink-0" />
            <span>Trauma $p_i$ & Angustia $B(n)$</span>
          </div>
        </div>
      </div>

      {/* Bottom Interactive Controls Strip */}
      <div className="px-5 py-3.5 bg-[#0c1017] border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 z-10">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pausar' : 'Rotar'}</span>
          </button>
          <button
            onClick={handleResetCamera}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Centrar</span>
          </button>

          {/* Cross section cut toggle to view the acute cusp interior */}
          <button
            onClick={() => setCrossSectionCut(!crossSectionCut)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              crossSectionCut
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{crossSectionCut ? 'Corte Interior Activo' : 'Corte Transversal'}</span>
          </button>
        </div>

        {/* Dynamic Horn Torus Ratio Slider */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Geometría T_r (r/R):</span>
            <input
              type="range"
              min="0.5"
              max="1.2"
              step="0.05"
              value={torusRatio}
              onChange={(e) => setTorusRatio(parseFloat(e.target.value))}
              className="w-24 accent-cyan-400 cursor-pointer"
            />
            <span className="text-xs font-mono text-cyan-400 tabular-nums w-8">
              {torusRatio.toFixed(2)}
            </span>
          </div>

          {torusRatio !== 1.0 && (
            <button
              onClick={() => setTorusRatio(1.0)}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 underline"
            >
              Fijar r=R
            </button>
          )}
        </div>

        {/* Pulsional Event Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={triggerNachtraglichkeit}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border border-rose-800/50 text-xs font-medium rounded-lg transition-colors"
            title="Axioma 7: Eleva la carga a_i de la marca traumática y dispara la respuesta de la contrainvestidura"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Disparar Nachträglichkeit</span>
          </button>

          <button
            onClick={() => setIsSurgeryPerformed(!isSurgeryPerformed)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              isSurgeryPerformed
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-300 border border-cyan-800/50'
            }`}
          >
            <Scissors className="w-3.5 h-3.5" />
            <span>{isSurgeryPerformed ? 'Revertir Cirugía' : 'Cirugía Perelman'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
