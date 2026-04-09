'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Sparkles, Stars as DreiStars } from '@react-three/drei';
import { useRef, useMemo, useState, useEffect } from 'react';
import * as THREE from 'three';

// ============================================
// مكون النجوم المتلألئة
// ============================================
function TwinklingStars() {
  const starsRef = useRef<THREE.Points>(null);
  const [time, setTime] = useState(0);
  
  const starsGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const starsCount = 3000;
    const positions = new Float32Array(starsCount * 3);
    const colors = new Float32Array(starsCount * 3);
    
    for (let i = 0; i < starsCount; i++) {
      // توزيع النجوم في كل مكان
      positions[i * 3] = (Math.random() - 0.5) * 2000;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 1000;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200 - 100;
      
      // ألوان مختلفة للنجوم
      const colorChoice = Math.random();
      if (colorChoice < 0.7) {
        colors[i * 3] = 1;     // أحمر
        colors[i * 3 + 1] = 1; // أخضر
        colors[i * 3 + 2] = 1; // أزرق
      } else if (colorChoice < 0.85) {
        colors[i * 3] = 1;     // أحمر
        colors[i * 3 + 1] = 0.6; // أخضر
        colors[i * 3 + 2] = 0.4; // أزرق
      } else {
        colors[i * 3] = 0.6;   // أحمر
        colors[i * 3 + 1] = 0.7; // أخضر
        colors[i * 3 + 2] = 1; // أزرق
      }
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geometry;
  }, []);
  
  useFrame(() => {
    setTime(t => t + 0.01);
    if (starsRef.current) {
      starsRef.current.rotation.y += 0.0001;
      starsRef.current.rotation.x = Math.sin(time * 0.05) * 0.05;
    }
  });
  
  return (
    <points ref={starsRef} geometry={starsGeometry}>
      <pointsMaterial size={0.25} vertexColors transparent opacity={0.7} />
    </points>
  );
}

// ============================================
// مكون الشهب (Shooting Stars)
// ============================================
function ShootingStars() {
  const [shootingStars, setShootingStars] = useState<{ x: number; y: number; z: number; progress: number }[]>([]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setShootingStars(prev => [...prev, {
          x: (Math.random() - 0.5) * 30,
          y: (Math.random() - 0.5) * 20 + 5,
          z: (Math.random() - 0.5) * 20 - 30,
          progress: 0
        }]);
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  useFrame(() => {
    setShootingStars(prev => 
      prev.map(star => ({ ...star, progress: star.progress + 0.02 }))
        .filter(star => star.progress < 1)
    );
  });
  
  return (
    <>
      {shootingStars.map((star, i) => (
        <mesh key={i} position={[star.x + star.progress * 20, star.y - star.progress * 10, star.z + star.progress * 30]}>
          <sphereGeometry args={[0.08, 4, 4]} />
          <meshStandardMaterial color="#ffaa66" emissive="#ff4422" emissiveIntensity={1} />
        </mesh>
      ))}
    </>
  );
}

// ============================================
// مكون الجزيئات المتطايرة (دخان وشرر)
// ============================================
function FloatingParticles({ carbonLevel }: { carbonLevel: number }) {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particlesCount = 800;
  const particlesGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount; i++) {
      const radius = 2.2 + Math.random() * 0.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, []);
  
  const intensity = Math.max(0, Math.min((carbonLevel - 30) / 70, 1));
  const opacity = intensity * 0.6;
  
  useFrame(({ clock }) => {
    if (particlesRef.current && carbonLevel > 40) {
      particlesRef.current.rotation.y += 0.01;
      particlesRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.5) * 0.1;
    }
  });
  
  if (carbonLevel < 40) return null;
  
  return (
    <points ref={particlesRef} geometry={particlesGeometry}>
      <pointsMaterial 
        color={carbonLevel > 75 ? '#ff3300' : carbonLevel > 60 ? '#ff6600' : '#ffaa00'}
        size={0.02}
        transparent
        opacity={opacity}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ============================================
// مكون الحلقات الدائرية (Ring Effect)
// ============================================
function Rings({ carbonLevel }: { carbonLevel: number }) {
  const ringRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.01;
      ringRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.3) * 0.2;
    }
  });
  
  const intensity = Math.min(carbonLevel / 100, 1);
  const ringColor = intensity > 0.6 ? '#ff4422' : '#44aaff';
  
  return (
    <mesh ref={ringRef}>
      <torusGeometry args={[2.3, 0.03, 64, 300]} />
      <meshStandardMaterial 
        color={ringColor} 
        emissive={ringColor} 
        emissiveIntensity={intensity * 0.5}
        transparent 
        opacity={0.4}
      />
    </mesh>
  );
}

// ============================================
// مكون الكوكب الرئيسي
// ============================================
function EarthPlanet({ carbonLevel }: { carbonLevel: number }) {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  const [earthTexture, setEarthTexture] = useState<THREE.Texture | null>(null);
  const [cloudsTexture, setCloudsTexture] = useState<THREE.Texture | null>(null);
  const [loading, setLoading] = useState(true);
  
  // تحميل الصور
  useEffect(() => {
    const textureLoader = new THREE.TextureLoader();
    let loadedCount = 0;
    
    textureLoader.load('/earth_texture.jpg', (texture) => {
      setEarthTexture(texture);
      loadedCount++;
      if (loadedCount === 2) setLoading(false);
    });
    
    textureLoader.load('/clouds.png', (texture) => {
      setCloudsTexture(texture);
      loadedCount++;
      if (loadedCount === 2) setLoading(false);
    });
  }, []);
  
  const intensity = Math.min(carbonLevel / 100, 1);
  
  const glowColor = useMemo(() => {
    if (carbonLevel < 20) return '#00ff88';
    if (carbonLevel < 40) return '#88ff00';
    if (carbonLevel < 60) return '#ffcc00';
    if (carbonLevel < 80) return '#ff6600';
    return '#ff0000';
  }, [carbonLevel]);
  
  useFrame(({ clock }) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.002;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.0025;
    }
    if (glowRef.current) {
      const pulse = Math.sin(clock.getElapsedTime() * 2) * 0.05 + 0.2;
      (glowRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = intensity * pulse;
    }
  });
  
  if (loading) {
    return (
      <Html center>
        <div style={{
          color: 'white',
          background: 'rgba(0,0,0,0.8)',
          padding: '15px 30px',
          borderRadius: '50px',
          fontSize: '16px',
          backdropFilter: 'blur(10px)'
        }}>
          🌍 Loading Earth...
        </div>
      </Html>
    );
  }
  
  return (
    <>
      {/* الكوكب الرئيسي */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[2, 128, 128]} />
        <meshStandardMaterial 
          map={earthTexture}
          metalness={0.1}
          roughness={0.5}
        />
      </mesh>
      
      {/* طبقة السحب */}
      {cloudsTexture && (
        <mesh ref={cloudsRef}>
          <sphereGeometry args={[2.01, 128, 128]} />
          <meshStandardMaterial 
            map={cloudsTexture}
            transparent
            opacity={0.12}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}
      
      {/* الغلاف المتوهج النابض */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[2.07, 64, 64]} />
        <meshStandardMaterial 
          color={glowColor}
          emissive={glowColor}
          emissiveIntensity={intensity * 0.3}
          transparent
          opacity={0.25}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* طبقة الضباب */}
      <mesh>
        <sphereGeometry args={[2.04, 64, 64]} />
        <meshStandardMaterial 
          color="#886666"
          transparent
          opacity={intensity * 0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  );
}

// ============================================
// المكون الرئيسي
// ============================================
export default function EarthScene({ carbonLevel = 25 }: { carbonLevel: number }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  const intensity = Math.min(carbonLevel / 100, 1);
  
  return (
    <div style={{ 
      width: '100%', 
      height: '100vh', 
      background: 'radial-gradient(ellipse at center, #000022 0%, #000000 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* تأثير الضباب الخلفي */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `radial-gradient(circle at ${50 + mousePosition.x * 10}% ${50 + mousePosition.y * 10}%, 
                      rgba(0,100,255,0.1) 0%, 
                      rgba(0,0,0,0) 70%)`,
        pointerEvents: 'none',
        zIndex: 1
      }} />
      
      <Canvas 
        camera={{ position: [0, 0, 9.5], fov: 45 }}
        gl={{ antialias: true, alpha: false }}
        style={{ zIndex: 2 }}
      >
        {/* إضاءة ديناميكية */}
        <ambientLight intensity={0.35} />
        <directionalLight position={[5, 3, 5]} intensity={1} />
        <pointLight position={[-3, 2, 4]} intensity={0.5} />
        <pointLight position={[0, 0, 6]} intensity={0.4} color="#4488ff" />
        
        {/* إضاءة إضافية حسب الكربون */}
        <pointLight 
          position={[2, 1, 3]} 
          intensity={intensity * 0.5} 
          color={intensity > 0.6 ? '#ff4422' : '#44ff88'} 
        />
        
        {/* الكوكب */}
        <EarthPlanet carbonLevel={carbonLevel} />
        
        {/* الحلقات */}
        <Rings carbonLevel={carbonLevel} />
        
        {/* الجزيئات المتطايرة */}
        <FloatingParticles carbonLevel={carbonLevel} />
        
        {/* الشهب */}
        <ShootingStars />
        
        {/* النجوم المتلألئة */}
        <TwinklingStars />
        
        {/* جزيئات صغيرة متطايرة */}
        <Sparkles 
          count={200}
          scale={[15, 15, 15]}
          size={0.5}
          speed={0.3}
          color={intensity > 0.6 ? "#ff6644" : "#88aaff"}
        />
        
        {/* تحكم المستخدم */}
        <OrbitControls 
          enableZoom={true}
          enablePan={false}
          autoRotate={true}
          autoRotateSpeed={0.4}
          minDistance={4}
          maxDistance={14}
          enableDamping={true}
          dampingFactor={0.05}
        />
      </Canvas>
      
      {/* مؤشر درجة الكربون مع أنيميشن */}
      <div style={{
        position: 'absolute',
        bottom: 20,
        right: 20,
        background: `rgba(0,0,0,0.7)`,
        backdropFilter: 'blur(10px)',
        padding: '10px 20px',
        borderRadius: '30px',
        color: intensity > 0.6 ? '#ff6644' : '#88ff88',
        fontSize: '14px',
        fontFamily: 'monospace',
        fontWeight: 'bold',
        zIndex: 10,
        border: `1px solid ${intensity > 0.6 ? '#ff6644' : '#88ff88'}`,
        animation: 'pulse 2s infinite',
        transition: 'all 0.3s ease'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>{carbonLevel > 70 ? '🔥' : carbonLevel > 40 ? '⚠️' : '🌿'}</span>
          <span>Carbon Score: {carbonLevel}</span>
        </div>
        <div style={{
          width: '100%',
          height: '3px',
          background: 'rgba(255,255,255,0.2)',
          borderRadius: '2px',
          marginTop: '5px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${carbonLevel}%`,
            height: '100%',
            background: `linear-gradient(90deg, #88ff88, ${intensity > 0.6 ? '#ff6644' : '#88ff88'})`,
            transition: 'width 0.5s ease'
          }} />
        </div>
      </div>
      
      {/* مؤشر مستوى التلوث */}
      <div style={{
        position: 'absolute',
        bottom: 20,
        left: 20,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(10px)',
        padding: '8px 16px',
        borderRadius: '20px',
        color: 'white',
        fontSize: '12px',
        zIndex: 10,
        display: 'flex',
        gap: '15px'
      }}>
        <div>🌍 CO₂: {Math.round(carbonLevel * 2)} kg</div>
        <div>🌳 Trees: {Math.floor((100 - carbonLevel) / 2)}</div>
      </div>
      
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}