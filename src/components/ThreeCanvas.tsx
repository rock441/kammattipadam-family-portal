import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RefreshCw, Play, Camera, Eye, HelpCircle } from "lucide-react";

interface ThreeCanvasProps {
  mode: "home" | "house" | "showroom";
  activeVehicleId?: string;
  activeSpotId?: string;
  isNightMode?: boolean;
}

export default function ThreeCanvas({
  mode,
  activeVehicleId,
  activeSpotId,
  isNightMode = true,
}: ThreeCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  // References to procedural geometries for manual manipulation
  const supercarGroupRef = useRef<THREE.Group | null>(null);
  const mansionGroupRef = useRef<THREE.Group | null>(null);
  const particleSystemRef = useRef<THREE.Points | null>(null);
  const neonEmblemRef = useRef<THREE.Mesh | null>(null);

  // Rotation and Interaction state
  const isDraggingRef = useRef<boolean>(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const [loading, setLoading] = useState<boolean>(true);
  const [stats, setStats] = useState({ vertices: 12400, fps: 60 });

  // Update scene based on day/night switch
  useEffect(() => {
    if (!sceneRef.current) return;
    const scene = sceneRef.current;
    
    // Day vs Night theme background & lighting updates
    if (isNightMode) {
      scene.background = new THREE.Color("#f1f5f9");
      scene.fog = new THREE.FogExp2("#f1f5f9", 0.02);
    } else {
      scene.background = new THREE.Color("#fcfbf9");
      scene.fog = new THREE.FogExp2("#fcfbf9", 0.02);
    }
  }, [isNightMode]);

  // Update vehicle materials / color schemes when standard vehicle changes
  useEffect(() => {
    if (mode === "showroom" && supercarGroupRef.current) {
      const group = supercarGroupRef.current;
      
      // Determine custom color to paint based on active vehicle
      let paintColor = 0xd4af37; // Default gold for Chiron
      let neonUnderglow = 0xebb232;
      
      if (activeVehicleId === "v2") {
        paintColor = 0xc53030; // Red for Aventador
        neonUnderglow = 0xff0000;
      } else if (activeVehicleId === "v3") {
        paintColor = 0x1a202c; // Black out
        neonUnderglow = 0xa855f7; // purple
      } else if (activeVehicleId === "v4") {
        paintColor = 0xdd6b20; // Orange Ducati
        neonUnderglow = 0xdd6b20;
      }

      // Update color arrays for procedural components
      group.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (child.name === "carBody") {
            const mat = child.material as THREE.MeshStandardMaterial;
            mat.color.setHex(paintColor);
            mat.roughness = 0.08;
            mat.metalness = 0.95;
            mat.needsUpdate = true;
          }
          if (child.name === "neonGlow") {
            const mat = child.material as THREE.MeshBasicMaterial;
            mat.color.setHex(neonUnderglow);
            mat.needsUpdate = true;
          }
        }
      });
      
      // Flash camera viewpoint to denote transition
      if (cameraRef.current) {
         cameraRef.current.position.set(-6, 3, 7);
         cameraRef.current.lookAt(0, 0.8, 0);
      }
    }
  }, [activeVehicleId, mode]);

  // Update mansion view hotspots to zoom of camera
  useEffect(() => {
    if (mode === "house" && cameraRef.current) {
      const cam = cameraRef.current;
      // Animate/Position camera targeting areas
      if (activeSpotId === "spot-garage") {
        cam.position.set(-7, 2.5, 6);
      } else if (activeSpotId === "spot-conf") {
        cam.position.set(0, 4.5, 9);
      } else if (activeSpotId === "spot-trophy") {
        cam.position.set(7, 2.5, 6);
      } else {
        cam.position.set(-8, 5, 12);
      }
      cam.lookAt(0, 1.2, 0);
    }
  }, [activeSpotId, mode]);

  useEffect(() => {
    if (!containerRef.current) return;
    setLoading(true);

    // Get real widths
    const width = containerRef.current.clientWidth || 550;
    const height = containerRef.current.clientHeight || 450;

    // 1. Initial Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(isNightMode ? "#f1f5f9" : "#fcfbf9");
    scene.fog = new THREE.FogExp2(isNightMode ? "#f1f5f9" : "#fcfbf9", 0.02);
    sceneRef.current = scene;

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(-8, 5, 12);
    cameraRef.current = camera;

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Flush any old canvases
    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Elegant Ambient & Spot lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, isNightMode ? 0.2 : 0.5);
    scene.add(ambientLight);

    const platformLight = new THREE.DirectionalLight(0xffffff, 1.2);
    platformLight.position.set(5, 15, 5);
    platformLight.castShadow = true;
    scene.add(platformLight);

    // Glowing stage downlights
    const stageLight = new THREE.SpotLight(0xd4af37, 2.5, 20, Math.PI / 4, 0.5, 1);
    stageLight.position.set(0, 10, 0);
    scene.add(stageLight);

    // 5. Build scenic components according to active state "mode"
    let totalEstimatedVerts = 5000;

    if (mode === "home") {
      // SCENE: Cyber neon city grid & floating particles
      totalEstimatedVerts = 18500;
      
      // Ground Cyber Grid lines
      const gridHelper = new THREE.GridHelper(40, 40, 0xff5722, 0x1f2937);
      gridHelper.position.set(0, -0.1, 0);
      scene.add(gridHelper);

      // Procedural neon blocks (representing skyline of Los Santos)
      const buildingCount = 20;
      const buildingGroup = new THREE.Group();
      
      for (let i = 0; i < buildingCount; i++) {
        const bHeight = Math.random() * 8 + 4;
        const bWidth = Math.random() * 2 + 1.2;
        const bDepth = Math.random() * 2 + 1.2;
        
        const geo = new THREE.BoxGeometry(bWidth, bHeight, bDepth);
        
        // Neon edge shader style material
        const mat = new THREE.MeshStandardMaterial({
          color: 0x1a202c,
          roughness: 0.1,
          metalness: 0.8,
          wireframe: Math.random() > 0.65, // cyberpunk matrix touch
        });

        const mesh = new THREE.Mesh(geo, mat);
        
        // Arrange properties in ring bounds around the viewer
        const angle = (i / buildingCount) * Math.PI * 2;
        const radius = Math.random() * 6 + 10;
        mesh.position.set(Math.cos(angle) * radius, bHeight / 2 - 0.1, Math.sin(angle) * radius);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        buildingGroup.add(mesh);
      }
      scene.add(buildingGroup);

      // Huge Kammattipadam center Emblem sphere
      const emblemGeo = new THREE.IcosahedronGeometry(2, 1);
      const emblemMat = new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        roughness: 0.2,
        metalness: 0.9,
        wireframe: true
      });
      const emblemMesh = new THREE.Mesh(emblemGeo, emblemMat);
      emblemMesh.position.set(0, 3, 0);
      scene.add(emblemMesh);
      neonEmblemRef.current = emblemMesh;

      // Camera coordinates setup
      camera.position.set(0, 5, 8);
      camera.lookAt(0, 2, 0);

    } else if (mode === "house") {
      // SCENE: Interactive mansion inspector
      totalEstimatedVerts = 12200;

      const group = new THREE.Group();
      mansionGroupRef.current = group;

      // Platform
      const platformGeo = new THREE.CylinderGeometry(8, 9, 0.4, 32);
      const platformMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        roughness: 0.4,
        metalness: 0.7
      });
      const platform = new THREE.Mesh(platformGeo, platformMat);
      platform.position.y = -0.2;
      group.add(platform);

      // Mansion Estate Center structure (Penthouse tower mockup)
      const towerGeo = new THREE.BoxGeometry(3.5, 4.5, 3.5);
      const towerMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.2,
        metalness: 0.8
      });
      const tower = new THREE.Mesh(towerGeo, towerMat);
      tower.position.set(0, 2.25, -1.5);
      group.add(tower);

      // Left Flank (Garage wing mockup)
      const garageGeo = new THREE.BoxGeometry(3, 1.8, 3.5);
      const garageMat = new THREE.MeshStandardMaterial({
         color: 0x0f172a,
         roughness: 0.3
      });
      const garageMesh = new THREE.Mesh(garageGeo, garageMat);
      garageMesh.position.set(-4, 0.9, -1);
      group.add(garageMesh);

      // Right Flank ( Briefing Deck )
      const deckGeo = new THREE.BoxGeometry(3, 1.2, 3.5);
      const deckMat = new THREE.MeshStandardMaterial({
         color: 0x0f172a,
         roughness: 0.3
      });
      const deckMesh = new THREE.Mesh(deckGeo, deckMat);
      deckMesh.position.set(4, 0.6, -1);
      group.add(deckMesh);

      // Floating holographic markers corresponding to Spots
      const spotsInfo = [
        { name: "Garage Spotlight", px: -4, py: 1.8, pz: -1, color: 0xd4af37 },
        { name: "Briefing Spotlight", px: 0, py: 3.5, pz: -1.5, color: 0xff5722 },
        { name: "Trophy Spotlight", px: 4, py: 1.2, pz: -1, color: 0x46b251 }
      ];

      spotsInfo.forEach((spot) => {
         const spotGeo = new THREE.SphereGeometry(0.24, 8, 8);
         const spotMat = new THREE.MeshBasicMaterial({
           color: spot.color,
           wireframe: true
         });
         const mesh = new THREE.Mesh(spotGeo, spotMat);
         mesh.position.set(spot.px, spot.py, spot.pz);
         group.add(mesh);
      });

      scene.add(group);
      camera.position.set(-8, 5, 12);
      camera.lookAt(0, 1.2, 0);

    } else if (mode === "showroom") {
      // SCENE: rotating supercar platform!
      totalEstimatedVerts = 14500;

      const group = new THREE.Group();
      supercarGroupRef.current = group;

      // Rotator platform baseplate
      const turntableGeo = new THREE.CylinderGeometry(5, 5.2, 0.3, 32);
      const turntableMat = new THREE.MeshStandardMaterial({
        color: 0x080812,
        roughness: 0.1,
        metalness: 0.9
      });
      const turntable = new THREE.Mesh(turntableGeo, turntableMat);
      turntable.position.y = -0.15;
      turntable.receiveShadow = true;
      group.add(turntable);

      // Outer golden light ring
      const ringGeo = new THREE.TorusGeometry(4.8, 0.08, 8, 48);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0xd4af37 });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      ringMesh.position.y = -0.12;
      group.add(ringMesh);

      // Build vehicle proxy body layers
      const chassisGeo = new THREE.BoxGeometry(4.2, 0.35, 1.8);
      const paintMat = new THREE.MeshStandardMaterial({
        name: "paint_material",
        color: 0xd4af37,
        roughness: 0.08,
        metalness: 0.95
      });
      const chassis = new THREE.Mesh(chassisGeo, paintMat);
      chassis.name = "carBody";
      chassis.position.y = 0.35;
      chassis.castShadow = true;
      group.add(chassis);

      // Streamlined cabin cockpit
      const cabinGeo = new THREE.ConeGeometry(1, 0.8, 4);
      cabinGeo.scale(2, 1, 1.3);
      cabinGeo.rotateY(Math.PI / 2);
      const cabinMat = new THREE.MeshStandardMaterial({
        color: 0x111111,
        roughness: 0.05,
        metalness: 0.9
      });
      const cabin = new THREE.Mesh(cabinGeo, cabinMat);
      cabin.position.set(-0.2, 0.72, 0);
      cabin.castShadow = true;
      group.add(cabin);

      // Vicious spoiler wings on tail
      const spoilerGeo = new THREE.BoxGeometry(0.3, 0.4, 1.9);
      const spoilerMat = new THREE.MeshStandardMaterial({
        color: 0x111111,
        roughness: 0.2
      });
      const spoiler = new THREE.Mesh(spoilerGeo, spoilerMat);
      spoiler.position.set(1.7, 0.7, 0);
      spoiler.rotateZ(0.12);
      spoiler.castShadow = true;
      group.add(spoiler);

      // Highly functional revolving tires (four cylinders)
      const wheelGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.32, 16);
      wheelGeo.rotateX(Math.PI / 2);
      const wheelMat = new THREE.MeshStandardMaterial({
         color: 0x111111,
         roughness: 0.8,
         metalness: 0.2
      });

      const lfWheel = new THREE.Mesh(wheelGeo, wheelMat);
      lfWheel.position.set(-1.3, 0.32, 0.9);
      lfWheel.castShadow = true;
      group.add(lfWheel);

      const rfWheel = new THREE.Mesh(wheelGeo, wheelMat);
      rfWheel.position.set(-1.3, 0.32, -0.9);
      rfWheel.castShadow = true;
      group.add(rfWheel);

      const lrWheel = new THREE.Mesh(wheelGeo, wheelMat);
      lrWheel.position.set(1.3, 0.32, 0.9);
      lrWheel.castShadow = true;
      group.add(lrWheel);

      const rrWheel = new THREE.Mesh(wheelGeo, wheelMat);
      rrWheel.position.set(1.3, 0.32, -0.9);
      rrWheel.castShadow = true;
      group.add(rrWheel);

      // Add a cool customized ground neon underglow box bar
      const glowGeo = new THREE.BoxGeometry(2.8, 0.05, 1.2);
      const glowMat = new THREE.MeshBasicMaterial({
        color: 0xebb232,
        transparent: true,
        opacity: 0.74
      });
      const glowBar = new THREE.Mesh(glowGeo, glowMat);
      glowBar.name = "neonGlow";
      glowBar.position.set(0, 0.04, 0);
      group.add(glowBar);

      scene.add(group);
      
      camera.position.set(-6, 3, 7);
      camera.lookAt(0, 0.8, 0);
    }

    // 6. Background stellar spark particles
    const particleCount = 280;
    const pGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 45;
      positions[i+1] = Math.random() * 20 - 4;
      positions[i+2] = (Math.random() - 0.5) * 45;
    }

    pGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const pMaterial = new THREE.PointsMaterial({
      color: 0xd4af37,
      size: 0.08,
      transparent: true,
      opacity: 0.85
    });

    const particles = new THREE.Points(pGeometry, pMaterial);
    scene.add(particles);
    particleSystemRef.current = particles;

    setStats({ vertices: totalEstimatedVerts, fps: 60 });
    setLoading(false);

    // 7. Render Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Slow drift stars
      if (particleSystemRef.current) {
         particleSystemRef.current.rotation.y += 0.015 * delta;
      }

      // Rotate center emblem in home screen
      if (mode === "home" && neonEmblemRef.current) {
        neonEmblemRef.current.rotation.y += 0.4 * delta;
        neonEmblemRef.current.rotation.z += 0.15 * delta;
        // Float emblem up/down
        neonEmblemRef.current.position.y = 3 + Math.sin(elapsed * 1.5) * 0.25;
      }

      // Automatically spin vehicle on showroom platform if user isn't actively dragging
      if (mode === "showroom" && supercarGroupRef.current && !isDraggingRef.current) {
         supercarGroupRef.current.rotation.y += 0.25 * delta;
      }

      // Light rotation on safe-house inspect mode
      if (mode === "house" && mansionGroupRef.current && !isDraggingRef.current) {
         mansionGroupRef.current.rotation.y = Math.sin(elapsed * 0.1) * 0.3;
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
         rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    // 8. Responsive Resize Observer setup
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;

      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();

      rendererRef.current.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, [mode]);

  // DRAG INTERACTIONS: Rotate the platform manually!
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - previousMousePosition.current.x;

    if (mode === "showroom" && supercarGroupRef.current) {
      supercarGroupRef.current.rotation.y += deltaX * 0.012;
    } else if (mode === "house" && mansionGroupRef.current) {
      mansionGroupRef.current.rotation.y += deltaX * 0.012;
    }

    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Touch triggers for smartphone / ipad drags
  const handleTouchStart = (e: React.TouchEvent) => {
     if (e.touches.length === 1) {
       isDraggingRef.current = true;
       previousMousePosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
     }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
     if (!isDraggingRef.current || e.touches.length !== 1) return;
     const deltaX = e.touches[0].clientX - previousMousePosition.current.x;

     if (mode === "showroom" && supercarGroupRef.current) {
       supercarGroupRef.current.rotation.y += deltaX * 0.015;
     } else if (mode === "house" && mansionGroupRef.current) {
       mansionGroupRef.current.rotation.y += deltaX * 0.015;
     }

     previousMousePosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  return (
    <div className="w-full h-full relative group">
      {/* 3D viewport canvas wrap */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
        className="w-full h-full cursor-grab active:cursor-grabbing relative overflow-hidden bg-[#030307]"
      />

      {/* Loading overlay indicator inside canvas */}
      {loading && (
        <div className="absolute inset-0 bg-[#050508]/90 z-20 flex flex-col items-center justify-center gap-3">
          <RefreshCw className="w-8 h-8 text-orange-500 animate-spin" />
          <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest animate-pulse">
            Spawning WebGL Viewport...
          </p>
        </div>
      )}

      {/* Technical graphics HUD panel */}
      <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md rounded-xl border border-white/5 p-2.5 flex justify-between items-center text-[10px] text-slate-400 font-mono select-none pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping"></span>
          <span className="font-bold text-slate-300">GPU BUFFER: OK</span>
        </div>
        <div className="flex gap-4">
          <span>VERTS: {stats.vertices}</span>
          <span className="text-amber-400">FPS: {stats.fps}</span>
          <span className="hidden sm:inline">MODE: {mode.toUpperCase()}</span>
        </div>
      </div>

      {mode === "showroom" && (
        <div className="absolute top-4 left-4 pointer-events-none">
          <div className="bg-black/70 backdrop-blur-md px-2 py-1 rounded-md border border-white/5 text-[9px] font-mono text-orange-400">
             👈 DRAG TO ROTATE 360°
          </div>
        </div>
      )}
    </div>
  );
}
