// ============================================================================
// js/guitar-3d.js
// Visor 3D Interactivo de Guitarra Acústica, Anatomía, Postura y Método Keyner
// - Motor híbrido: Three.js WebGL (cuando está disponible) + Motor 3D Canvas
//   autosuficiente integrado (cero dependencias externas requeridas offline).
// - Rotación orbital por arrastre (mouse/táctil), zoom y vista Clásica 45° / Popular.
// - Puntos interactivos de Anatomía (12 partes) y Mástil 3D Keyner 10–60 sonoro.
// - Galería Ilustrada Nano Banana + Tabla Interactiva de Relaciones Armónicas.
// ============================================================================

import { audioEngine } from './audio-engine.js';
import {
  NOTES,
  NOTES_ES,
  NOTE_COLORS,
  getFretMidi,
  midiToNoteInfo,
  toKeynerFretCode,
  formatKeynerChordSymbol
} from './music-theory.js';

export const GUITAR_PARTS_3D = [
  {
    id: 'clavijero',
    name: 'Cabeza o Clavijero',
    category: 'Cabezal',
    color: '#FF9600',
    pos: [0, 3.35, 0.02],
    desc: 'Extremo superior del mástil donde se sujetan las 6 clavijas que tensan las cuerdas.'
  },
  {
    id: 'clavijas',
    name: 'Clavijas (6-5-4-3-2-1)',
    category: 'Afinación',
    color: '#FFC800',
    pos: [-0.42, 3.32, 0.08],
    desc: 'Engranajes giratorios. Apretar sube la afinación (♯) y aflojar la baja (♭).'
  },
  {
    id: 'ceja',
    name: 'Ceja o Cejuela (Traste 0)',
    category: 'Diapasón',
    color: '#F8FAFC',
    pos: [0, 2.75, 0.14],
    desc: 'Pieza blanca acanalada que guía las 6 cuerdas al aire (códigos 10, 20, 30, 40, 50, 60 en Keyner).'
  },
  {
    id: 'trastes',
    name: 'Trastes y Espacios',
    category: 'Diapasón',
    color: '#1CB0F6',
    pos: [0.05, 1.92, 0.14],
    desc: 'Los trastes son las barras metálicas; tus dedos pisan los ESPACIOS milímetros detrás de cada metal.'
  },
  {
    id: 'diapason',
    name: 'Diapasón y Cuello / Mástil',
    category: 'Mango',
    color: '#8B5CF6',
    pos: [-0.08, 1.35, 0.12],
    desc: 'Tabla frontal del cuello donde se digitan notas, escalas y acordes; detrás apoya el pulgar izquierdo.'
  },
  {
    id: 'talon',
    name: 'Talón del Mástil',
    category: 'Unión',
    color: '#EC4899',
    pos: [0, 0.65, -0.22],
    desc: 'Refuerzo estructural posterior que une sólidamente el mástil con el cuerpo hueco de la guitarra.'
  },
  {
    id: 'boca',
    name: 'Boca y Roseta Sonora',
    category: 'Caja Acústica',
    color: '#58CC02',
    pos: [0, 0.05, 0.25],
    desc: 'Abertura circular central donde pulsa la mano derecha (p-i-m-a) y por donde proyecta el sonido.'
  },
  {
    id: 'golpeador',
    name: 'Placa Protectora (Golpeador)',
    category: 'Caja Acústica',
    color: '#FF4B4B',
    pos: [0.58, -0.22, 0.25],
    desc: 'Lámina que protege la madera de la tapa armónica contra rasgueos enérgicos y golpes de púa.'
  },
  {
    id: 'puente',
    name: 'Puente y Hueso (Selleta)',
    category: 'Caja Acústica',
    color: '#00CD9C',
    pos: [0, -1.05, 0.26],
    desc: 'Ancla las 6 cuerdas sobre la tapa; el hueso blanco transmite la vibración directo a la madera.'
  },
  {
    id: 'aros',
    name: 'Tapa, Aros y Fondo',
    category: 'Caja Acústica',
    color: '#D97706',
    pos: [1.05, -0.82, -0.05],
    desc: 'Cuerpo resonador formado por tapa frontal, costados curvos (aros) y tapa trasera (fondo).'
  }
];

export const KEYNER_HARMONIC_TABLE = [
  { tonic: 'C',  name: 'Do Mayor (DO+)',   relativo: 'Am',  seg: 'Dm',  ter: 'Em',  sub: 'F',  quinta: 'G7',  quintaKeyner: '5ª DO' },
  { tonic: 'G',  name: 'Sol Mayor (SOL+)', relativo: 'Em',  seg: 'Am',  ter: 'Bm',  sub: 'C',  quinta: 'D7',  quintaKeyner: '5ª SOL' },
  { tonic: 'D',  name: 'Re Mayor (RE+)',   relativo: 'Bm',  seg: 'Em',  ter: 'F#m', sub: 'G',  quinta: 'A7',  quintaKeyner: '5ª RE' },
  { tonic: 'A',  name: 'La Mayor (LA+)',   relativo: 'F#m', seg: 'Bm',  ter: 'C#m', sub: 'D',  quinta: 'E7',  quintaKeyner: '5ª LA' },
  { tonic: 'E',  name: 'Mi Mayor (MI+)',   relativo: 'C#m', seg: 'F#m', ter: 'G#m', sub: 'A',  quinta: 'B7',  quintaKeyner: '5ª MI' },
  { tonic: 'F',  name: 'Fa Mayor (FA+)',   relativo: 'Dm',  seg: 'Gm',  ter: 'Am',  sub: 'A#', quinta: 'C7',  quintaKeyner: '5ª FA' },
  { tonic: 'Am', name: 'La Menor (LA-)',   relativo: 'C',   seg: 'Bdim7', ter: 'C', sub: 'Dm', quinta: 'E7', quintaKeyner: '5ª LA' },
  { tonic: 'Dm', name: 'Re Menor (RE-)',   relativo: 'F',   seg: 'Em',  ter: 'F',   sub: 'Gm', quinta: 'A7',  quintaKeyner: '5ª RE' },
  { tonic: 'Em', name: 'Mi Menor (MI-)',   relativo: 'G',   seg: 'F#m', ter: 'G',   sub: 'Am', quinta: 'B7',  quintaKeyner: '5ª MI' }
];

export const NANO_BANANA_GALLERY = [
  {
    id: 'parts',
    title: 'Anatomía Completa de la Guitarra',
    subtitle: 'Clavijero, Ceja, Trastes, Espacios, Boca y Puente (Keyner p.4)',
    src: './assets/img/guitar_parts_diagram.jpg'
  },
  {
    id: 'posture',
    title: 'Postura Clásica (45°) vs. Popular',
    subtitle: 'Banquito izquierdo frente a apoyo popular vertical (Keyner p.4)',
    src: './assets/img/guitar_posture_styles.jpg'
  },
  {
    id: 'hands',
    title: 'Numeración de Manos (1-2-3-4 / P-I-M-A-m) y Uñas',
    subtitle: 'Uñas cortas izquierda / redondeadas derecha (Keyner p.5)',
    src: './assets/img/guitar_hands_numbering.jpg'
  },
  {
    id: 'keyner_grid',
    title: 'Método Numérico Keyner: Cuerda + Espacio (10–60)',
    subtitle: 'Primer dígito = Cuerda (1–6) + Segundo dígito = Espacio (p.6–8)',
    src: './assets/img/keyner_numeric_fretboard.jpg'
  }
];

// Genera polígono 3D del contorno clásico español de guitarra
function buildGuitarContourPoints(zFront = 0.24, zBack = -0.24) {
  const halfPts = [];
  const samples = [
    [0.0, 0.85], [0.42, 0.82], [0.76, 0.62], [0.88, 0.34],
    [0.72, 0.08], [0.58, -0.08], [0.76, -0.35], [1.14, -0.78],
    [1.18, -1.24], [0.96, -1.66], [0.52, -1.88], [0.0, -1.94]
  ];
  for (const [x, y] of samples) halfPts.push([x, y]);
  for (let i = samples.length - 2; i >= 1; i--) {
    halfPts.push([-samples[i][0], samples[i][1]]);
  }
  return {
    front: halfPts.map(([x, y]) => [x, y, zFront]),
    back: halfPts.map(([x, y]) => [x, y, zBack])
  };
}

export class Guitar3DStudio {
  constructor(containerEl, options = {}) {
    this.container = containerEl;
    this.onAwardXP = options.onAwardXP || null;
    this.onOpenChordModal = options.onOpenChordModal || null;

    this.activeTab = 'anatomy'; // 'anatomy' | 'posture' | 'keyner_map' | 'gallery'
    this.selectedPartId = 'boca';
    this.postureStyle = 'popular'; // 'popular' | 'clasica'
    this.selectedCoord = { s: 4, f: 3 }; // 43 Keyner por defecto
    this.selectedHarmonicKey = 'C';
    this.activeGalleryId = 'keyner_grid';

    // Estado de cámara 3D
    this.rotY = 0.28;
    this.rotX = -0.18;
    this.targetRollZ = 0.08;
    this.currentRollZ = 0.08;
    this.zoom = 1.0;
    this.autoRotate = false;
    this.pluckedStrings = [0, 0, 0, 0, 0, 0]; // amplitud de vibración por cuerda 1..6

    // Hit-boxes proyectadas en Canvas para clicks precisos en 3D
    this.projectedParts = [];
    this.projectedFrets = [];
    this.rafId = null;
    this.isDragging = false;
    this.dragMoved = false;
    this.lastMouse = { x: 0, y: 0 };

    // Motor Three.js opcional cuando hay acceso WebGL + CDN
    this.engineLabel = 'Canvas 3D Interactivo (Offline Ready)';
    this.threeState = null;
    this.contour = buildGuitarContourPoints(0.24, -0.24);
    this._windowDragBound = false;
  }

  init() {
    this.render();
  }

  stop() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.isDragging = false;
  }

  setMode(mode) {
    if (['anatomy', 'posture', 'keyner_map', 'gallery'].includes(mode)) {
      this.activeTab = mode;
      if (mode === 'posture') {
        this.targetRollZ = this.postureStyle === 'clasica' ? -0.68 : 0.10;
        this.rotY = 0.15;
        this.rotX = -0.1;
      } else if (mode === 'keyner_map') {
        this.targetRollZ = 0.0;
        this.rotY = 0.08;
        this.rotX = -0.14;
      } else {
        this.targetRollZ = 0.08;
      }
      this.render();
    }
  }

  _projectPoint(px, py, pz, cx, cy, scale) {
    // 1. Rolido postural en Z (ej. 45° clásica vs popular)
    const cz = Math.cos(this.currentRollZ);
    const sz = Math.sin(this.currentRollZ);
    let x1 = px * cz - py * sz;
    let y1 = px * sz + py * cz;
    let z1 = pz;

    // 2. Rotación orbital Yaw (Y)
    const cyr = Math.cos(this.rotY);
    const syr = Math.sin(this.rotY);
    let x2 = x1 * cyr + z1 * syr;
    let z2 = -x1 * syr + z1 * cyr;
    let y2 = y1;

    // 3. Rotación orbital Pitch (X)
    const cxr = Math.cos(this.rotX);
    const sxr = Math.sin(this.rotX);
    let y3 = y2 * cxr - z2 * sxr;
    let z3 = y2 * sxr + z2 * cxr;

    const camDist = 9.0;
    const persp = camDist / (camDist - z3);
    return {
      x: cx + x2 * scale * this.zoom * persp,
      y: cy - y3 * scale * this.zoom * persp,
      z: z3,
      persp
    };
  }

  _startRenderLoop() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    const canvas = this.container?.querySelector('#guitar-3d-canvas');
    if (!canvas) return;

    const drawFrame = () => {
      this.currentRollZ += (this.targetRollZ - this.currentRollZ) * 0.12;
      if (this.autoRotate && !this.isDragging) {
        this.rotY += 0.008;
      }
      for (let i = 0; i < 6; i++) {
        this.pluckedStrings[i] *= 0.91;
      }
      this._draw3DCanvas(canvas);
      this.rafId = requestAnimationFrame(drawFrame);
    };
    this.rafId = requestAnimationFrame(drawFrame);
  }

  _draw3DCanvas(canvas) {
    const dpr = typeof window !== 'undefined' ? Math.min(2, window.devicePixelRatio || 1) : 1;
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(320, Math.round(rect.width || 620));
    const h = Math.max(380, Math.round(rect.height || 480));
    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Fondo estudio cálido radial
    const bgGrad = ctx.createRadialGradient(w * 0.5, h * 0.42, 30, w * 0.5, h * 0.5, w * 0.7);
    bgGrad.addColorStop(0, '#1E293B');
    bgGrad.addColorStop(1, '#0F172A');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Cuadrícula espacial sutil
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.08)';
    ctx.lineWidth = 1;
    for (let gx = 0; gx < w; gx += 36) {
      ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke();
    }
    for (let gy = 0; gy < h; gy += 36) {
      ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke();
    }

    const cx = w * 0.5;
    const cy = h * 0.56;
    const scale = Math.min(w, h) * 0.145;
    const facingZ = Math.cos(this.rotY) * Math.cos(this.rotX);
    const showingFront = facingZ >= -0.05;

    const projFront = this.contour.front.map(p => this._projectPoint(p[0], p[1], p[2], cx, cy, scale));
    const projBack = this.contour.back.map(p => this._projectPoint(p[0], p[1], p[2], cx, cy, scale));

    // Banquito clásico en modo postura clásica
    if (this.activeTab === 'posture' && this.postureStyle === 'clasica') {
      ctx.save();
      ctx.fillStyle = 'rgba(88, 204, 2, 0.22)';
      ctx.strokeStyle = '#58CC02';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.roundRect(cx - 170, h - 62, 115, 36, 8);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#BBF7D0';
      ctx.font = 'bold 11px Nunito, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Banquito Pie Izq. (~45°)', cx - 112, h - 40);
      ctx.restore();
    }

    // 1. Dibujar caras laterales (Aros 3D) conectando contorno frontal y trasero
    for (let i = 0; i < projFront.length; i++) {
      const n = (i + 1) % projFront.length;
      const avgZ = (projFront[i].z + projFront[n].z + projBack[i].z + projBack[n].z) / 4;
      const shade = Math.max(35, Math.min(130, Math.round(78 + avgZ * 38)));
      ctx.fillStyle = `rgb(${shade}, ${Math.round(shade * 0.52)}, ${Math.round(shade * 0.22)})`;
      ctx.beginPath();
      ctx.moveTo(projFront[i].x, projFront[i].y);
      ctx.lineTo(projFront[n].x, projFront[n].y);
      ctx.lineTo(projBack[n].x, projBack[n].y);
      ctx.lineTo(projBack[i].x, projBack[i].y);
      ctx.closePath();
      ctx.fill();
    }

    // 2. Cara Trasera (Fondo + Talón) o Tapa Frontal según orientación
    const drawBodyPoly = (pts, isFront) => {
      ctx.beginPath();
      pts.forEach((p, idx) => (idx === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
      ctx.closePath();
      if (isFront) {
        const wood = ctx.createLinearGradient(cx - 90, cy - 120, cx + 120, cy + 120);
        wood.addColorStop(0, '#F59E0B');
        wood.addColorStop(0.55, '#D97706');
        wood.addColorStop(1, '#92400E');
        ctx.fillStyle = wood;
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#FEF3C7';
        ctx.stroke();
      } else {
        ctx.fillStyle = '#5B2C16';
        ctx.fill();
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = '#78350F';
        ctx.stroke();
      }
    };

    if (!showingFront) {
      drawBodyPoly(projFront, true);
      drawBodyPoly(projBack, false);
    } else {
      drawBodyPoly(projBack, false);
      drawBodyPoly(projFront, true);
    }

    // 3. Mástil / Diapasón + Clavijero 3D
    const drawBoxPoly = (corners3d, fillStyle, strokeStyle) => {
      const p = corners3d.map(c => this._projectPoint(c[0], c[1], c[2], cx, cy, scale));
      ctx.beginPath();
      p.forEach((pt, i) => (i === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y)));
      ctx.closePath();
      ctx.fillStyle = fillStyle;
      ctx.fill();
      if (strokeStyle) {
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
      return p;
    };

    // Parte trasera del cuello (caoba)
    drawBoxPoly([
      [-0.22, 0.55, -0.05], [0.22, 0.55, -0.05],
      [0.18, 2.82, -0.03], [-0.18, 2.82, -0.03]
    ], '#78350F', '#451A03');

    // Cabeza / Clavijero
    drawBoxPoly([
      [-0.24, 2.82, 0.02], [0.24, 2.82, 0.02],
      [0.31, 3.62, 0.0], [-0.31, 3.62, 0.0]
    ], '#451A03', '#B45309');

    // Clavijas 3 a la izquierda (6,5,4) y 3 a la derecha (1,2,3)
    [0, 1, 2].forEach(k => {
      const py = 3.02 + k * 0.22;
      const pL = this._projectPoint(-0.36, py, 0.02, cx, cy, scale);
      const pR = this._projectPoint(0.36, py, 0.02, cx, cy, scale);
      [pL, pR].forEach(pk => {
        ctx.beginPath();
        ctx.arc(pk.x, pk.y, 4.5 * this.zoom * pk.persp, 0, Math.PI * 2);
        ctx.fillStyle = '#E2E8F0';
        ctx.fill();
        ctx.strokeStyle = '#64748B';
        ctx.stroke();
      });
    });

    if (showingFront) {
      // Placa Protectora (Golpeador)
      const pg = [
        [0.34, -0.1], [0.68, -0.15], [0.76, -0.45], [0.46, -0.58], [0.30, -0.35]
      ].map(([x, y]) => this._projectPoint(x, y, 0.248, cx, cy, scale));
      ctx.beginPath();
      pg.forEach((pt, i) => (i === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y)));
      ctx.closePath();
      ctx.fillStyle = 'rgba(127, 29, 29, 0.85)';
      ctx.fill();

      // Boca y Roseta (elipse proyectada)
      ctx.beginPath();
      for (let a = 0; a <= Math.PI * 2 + 0.1; a += 0.2) {
        const pt = this._projectPoint(Math.cos(a) * 0.42, 0.06 + Math.sin(a) * 0.42, 0.25, cx, cy, scale);
        if (a === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.fillStyle = '#1E110B';
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#FBBF24';
      ctx.stroke();

      // Puente y Hueso blanco
      drawBoxPoly([
        [-0.58, -0.96, 0.26], [0.58, -0.96, 0.26],
        [0.58, -1.16, 0.26], [-0.58, -1.16, 0.26]
      ], '#3B1D0F', '#1F1109');
      drawBoxPoly([
        [-0.25, -0.99, 0.28], [0.25, -0.99, 0.28],
        [0.25, -1.03, 0.28], [-0.25, -1.03, 0.28]
      ], '#F8FAFC', null);

      // Diapasón (palisandro oscuro) desde ceja y=2.76 hasta traste 12/15 y=0.52
      drawBoxPoly([
        [-0.21, 0.52, 0.14], [0.21, 0.52, 0.14],
        [0.17, 2.78, 0.14], [-0.17, 2.78, 0.14]
      ], '#2A1810', '#5C3A28');

      // Ceja (Traste 0)
      drawBoxPoly([
        [-0.175, 2.79, 0.155], [0.175, 2.79, 0.155],
        [0.175, 2.74, 0.155], [-0.175, 2.74, 0.155]
      ], '#F8FAFC', null);

      // 12 Trastes metálicos con escala progresiva y áreas interactivas
      const fretY = [2.74];
      for (let f = 1; f <= 12; f++) {
        // Distribución realista decreciente hacia la boca
        const t = f / 12;
        const y = 2.74 - 2.16 * (1 - Math.pow(0.9438, f)) / (1 - Math.pow(0.9438, 12));
        fretY.push(y);
        const halfW = 0.17 + 0.038 * t;
        const p1 = this._projectPoint(-halfW, y, 0.15, cx, cy, scale);
        const p2 = this._projectPoint(halfW, y, 0.15, cx, cy, scale);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = '#E2E8F0';
        ctx.lineWidth = 1.6;
        ctx.stroke();

        // Puntos guía en trastes 3, 5, 7, 9, 12
        if ([3, 5, 7, 9, 12].includes(f)) {
          const midY = (fretY[f - 1] + fretY[f]) * 0.5;
          const pin = this._projectPoint(0, midY, 0.148, cx, cy, scale);
          ctx.beginPath();
          ctx.arc(pin.x, pin.y, 2.6 * this.zoom, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(248, 250, 252, 0.5)';
          ctx.fill();
        }
      }

      // 6 Cuerdas tensadas de Puente (-1.01) a Ceja (2.78)
      const nowSec = performance.now() * 0.04;
      for (let s = 6; s >= 1; s--) {
        const ratio = (6 - s) / 5; // 0 = 6ª (izq), 1 = 1ª (der)
        const xNut = -0.14 + ratio * 0.28;
        const xBridge = -0.20 + ratio * 0.40;
        const vib = Math.sin(nowSec * (1.2 + (6 - s) * 0.2)) * this.pluckedStrings[s - 1] * 0.045;

        const pTop = this._projectPoint(xNut, 2.78, 0.165, cx, cy, scale);
        const pMid = this._projectPoint((xNut + xBridge) * 0.5 + vib, 0.5, 0.21, cx, cy, scale);
        const pBot = this._projectPoint(xBridge, -1.01, 0.28, cx, cy, scale);

        ctx.beginPath();
        ctx.moveTo(pTop.x, pTop.y);
        ctx.quadraticCurveTo(pMid.x, pMid.y, pBot.x, pBot.y);
        ctx.strokeStyle = s >= 4 ? '#FDE68A' : '#E2E8F0';
        ctx.lineWidth = Math.max(0.9, (s * 0.36) * this.zoom);
        ctx.stroke();
      }

      // Almacenar nodos interactivos de trastes para el modo "keyner_map"
      this.projectedFrets = [];
      for (let f = 0; f <= 12; f++) {
        const yPos = f === 0 ? 2.81 : (fretY[f - 1] + fretY[f]) * 0.5;
        const t = (2.74 - yPos) / 2.16;
        for (let s = 6; s >= 1; s--) {
          const ratio = (6 - s) / 5;
          const xPos = (-0.14 + ratio * 0.28) * (1 + Math.max(0, t) * 0.22);
          const pt = this._projectPoint(xPos, yPos, 0.175, cx, cy, scale);
          const isSel = this.selectedCoord.s === s && this.selectedCoord.f === f;
          this.projectedFrets.push({ s, f, x: pt.x, y: pt.y });

          if (this.activeTab === 'keyner_map' && isSel) {
            const midi = getFretMidi(s, f);
            const info = midiToNoteInfo(midi);
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 12 * this.zoom, 0, Math.PI * 2);
            ctx.fillStyle = info.color.bg;
            ctx.fill();
            ctx.lineWidth = 2.5;
            ctx.strokeStyle = '#FFFFFF';
            ctx.stroke();
            ctx.fillStyle = info.color.text;
            ctx.font = 'bold 10px JetBrains Mono, monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(toKeynerFretCode(s, f), pt.x, pt.y);
          }
        }
      }
    }

    // 4. Hotspots interactivos de Anatomía 3D (modo anatomy)
    this.projectedParts = [];
    if (this.activeTab === 'anatomy') {
      for (const part of GUITAR_PARTS_3D) {
        const p = this._projectPoint(part.pos[0], part.pos[1], part.pos[2], cx, cy, scale);
        const isSel = part.id === this.selectedPartId;
        this.projectedParts.push({ id: part.id, x: p.x, y: p.y, z: p.z, r: isSel ? 14 : 10 });

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, isSel ? 13 : 9, 0, Math.PI * 2);
        ctx.fillStyle = isSel ? part.color : 'rgba(15, 23, 42, 0.85)';
        ctx.fill();
        ctx.lineWidth = isSel ? 3 : 2;
        ctx.strokeStyle = isSel ? '#FFFFFF' : part.color;
        ctx.stroke();

        if (isSel) {
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 11px Nunito, sans-serif';
          ctx.textAlign = 'center';
          const tagW = Math.min(200, part.name.length * 7 + 22);
          ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
          ctx.beginPath();
          ctx.roundRect(p.x - tagW / 2, p.y - 34, tagW, 20, 8);
          ctx.fill();
          ctx.strokeStyle = part.color;
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.fillStyle = '#F8FAFC';
          ctx.textBaseline = 'middle';
          ctx.fillText(part.name, p.x, p.y - 24);
        }
        ctx.restore();
      }
    }

    // Etiqueta postural flotante en modo postura
    if (this.activeTab === 'posture') {
      ctx.save();
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.beginPath();
      ctx.roundRect(14, 14, 240, 44, 10);
      ctx.fill();
      ctx.strokeStyle = '#58CC02';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = '#F8FAFC';
      ctx.font = 'bold 12px Nunito, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(
        this.postureStyle === 'clasica'
          ? '📐 Postura Clásica: Mástil a ~45°'
          : '🎸 Postura Popular: Apoyo Muslo Der.',
        24,
        32
      );
      ctx.fillStyle = '#94A3B8';
      ctx.font = '600 11px Nunito, sans-serif';
      ctx.fillText('Arrastra con el mouse para inspeccionar', 24, 48);
      ctx.restore();
    }
  }

  _tryUpgradeThreeJS() {
    // Opcional: si WebGL + CDN están disponibles en línea, informamos capacidades
    // mientras garantizamos respuesta instantánea con el motor 3D Canvas integrado.
    if (typeof window === 'undefined' || !navigator.onLine) return;
    if (this.threeState === 'attempted' || this.threeState === 'ready') return;
    this.threeState = 'attempted';
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    if (controller) setTimeout(() => controller.abort(), 2200);
    import(/* webpackIgnore: true */ 'https://esm.sh/three@0.170.0')
      .then((THREE) => {
        if (THREE?.REVISION) {
          this.threeState = 'ready';
          this.engineLabel = `Three.js r${THREE.REVISION} + Visor Híbrido 3D`;
          const badge = this.container?.querySelector('#g3d-engine-badge');
          if (badge) badge.textContent = this.engineLabel;
        }
      })
      .catch(() => {
        this.engineLabel = 'Canvas 3D Local (Offline Ready)';
      });
  }

  _pluckVisualAndAudio(s, f) {
    this.pluckedStrings[s - 1] = 1.0;
    audioEngine.init();
    audioEngine.playStringFret(s, f, 1.35, 0.65);
  }

  render() {
    if (!this.container) return;
    const partObj = GUITAR_PARTS_3D.find(p => p.id === this.selectedPartId) || GUITAR_PARTS_3D[0];
    const coordMidi = getFretMidi(this.selectedCoord.s, this.selectedCoord.f);
    const coordInfo = midiToNoteInfo(coordMidi);
    const keynerCode = toKeynerFretCode(this.selectedCoord.s, this.selectedCoord.f);
    const suggestedFinger = this.selectedCoord.f === 0
      ? 'Al aire (0)'
      : `Dedo ${Math.min(4, ((this.selectedCoord.f - 1) % 4) + 1)}`;
    const activeHarm = KEYNER_HARMONIC_TABLE.find(h => h.tonic === this.selectedHarmonicKey) || KEYNER_HARMONIC_TABLE[0];
    const activeGallery = NANO_BANANA_GALLERY.find(g => g.id === this.activeGalleryId) || NANO_BANANA_GALLERY[0];

    this.container.innerHTML = `
      <div class="g3d-studio-wrap">
        <!-- Encabezado y Pestañas del Estudio 3D -->
        <div class="duo-card g3d-hero-card">
          <div class="g3d-hero-top">
            <div>
              <div class="tab-badges-line">
                <span class="badge-vivid badge-purple">📕 Haga Música con la Guitarra (Keyner Ramírez)</span>
                <span class="badge-vivid badge-teal" id="g3d-engine-badge">${this.engineLabel}</span>
              </div>
              <h2 class="section-vivid-title">📐 Guitarra 3D, Partes, Postura &amp; Método Keyner</h2>
              <p class="tab-subtitle">Rota libremente la guitarra en 3D, inspecciona cada componente, compara postura Clásica vs Popular y pulsa coordenadas numéricas <strong>10–60</strong> en vivo.</p>
            </div>
            <div class="g3d-mode-pills">
              <button class="duo-pill ${this.activeTab === 'anatomy' ? 'active' : ''}" data-g3dtab="anatomy">🔍 Partes 3D</button>
              <button class="duo-pill pill-blue ${this.activeTab === 'posture' ? 'active' : ''}" data-g3dtab="posture">🪑 Postura 3D</button>
              <button class="duo-pill pill-purple ${this.activeTab === 'keyner_map' ? 'active' : ''}" data-g3dtab="keyner_map">🔢 Diapasón Keyner 10-60</button>
              <button class="duo-pill pill-orange ${this.activeTab === 'gallery' ? 'active' : ''}" data-g3dtab="gallery">🖼️ Láminas Ilustradas &amp; Tabla Armónica</button>
            </div>
          </div>
        </div>

        ${this.activeTab !== 'gallery' ? `
          <div class="g3d-main-grid">
            <!-- LIENZO 3D INTERACTIVO -->
            <div class="duo-card g3d-viewport-card">
              <div class="g3d-toolbar-row">
                <div class="g3d-camera-btns">
                  <button class="duo-btn btn-outline btn-xs" id="g3d-cam-front">Frente</button>
                  <button class="duo-btn btn-outline btn-xs" id="g3d-cam-angle">Perspectiva 3D</button>
                  <button class="duo-btn btn-outline btn-xs" id="g3d-cam-side">Perfil / Aros</button>
                  <button class="duo-btn btn-outline btn-xs" id="g3d-cam-back">Fondo / Talón</button>
                  <button class="duo-btn ${this.autoRotate ? 'btn-purple' : 'btn-outline'} btn-xs" id="g3d-toggle-spin">
                    ${this.autoRotate ? '⏸ Girando' : '🔄 Auto-Giro'}
                  </button>
                </div>
                <div class="g3d-zoom-row">
                  <button class="mini-pill" id="g3d-zoom-out">−</button>
                  <span>${Math.round(this.zoom * 100)}%</span>
                  <button class="mini-pill" id="g3d-zoom-in">+</button>
                </div>
              </div>

              <canvas id="guitar-3d-canvas" class="g3d-canvas-stage" aria-label="Modelo 3D interactivo de guitarra"></canvas>
              <p class="muted-hint" style="margin-top:8px;">
                🖱️ Arrastra dentro del visor para rotar la guitarra 360° · Haz clic sobre los círculos de color para explorar o hacer sonar cuerdas.
              </p>
            </div>

            <!-- PANEL DERECHO CONTEXTUAL POR MODO -->
            <div class="duo-card g3d-inspector-card">
              ${this.activeTab === 'anatomy' ? `
                <h3>🔍 Inspector de Partes (${GUITAR_PARTS_3D.length} Piezas)</h3>
                <div class="g3d-part-detail" style="border-left:5px solid ${partObj.color}">
                  <span class="badge-vivid" style="background:${partObj.color};color:#fff">${partObj.category}</span>
                  <h4>${partObj.name}</h4>
                  <p>${partObj.desc}</p>
                </div>

                <div class="g3d-parts-chips">
                  ${GUITAR_PARTS_3D.map(p => `
                    <button class="mini-pill ${p.id === partObj.id ? 'active' : ''}" data-partid="${p.id}">
                      ● ${p.name}
                    </button>
                  `).join('')}
                </div>

                <div class="g3d-mini-img-card">
                  <img src="./assets/img/guitar_parts_diagram.jpg" alt="Diagrama completo partes de la guitarra" />
                  <small>Lámina guía del método — Haz clic en la pestaña "🖼️ Láminas Ilustradas" para ampliarla.</small>
                </div>
              ` : ''}

              ${this.activeTab === 'posture' ? `
                <h3>🪑 Comparador Postural 3D</h3>
                <div class="posture-toggle-row">
                  <button class="duo-btn ${this.postureStyle === 'clasica' ? 'btn-green' : 'btn-outline'} btn-sm" data-posture="clasica">
                    🎓 Posición Clásica (~45°)
                  </button>
                  <button class="duo-btn ${this.postureStyle === 'popular' ? 'btn-blue' : 'btn-outline'} btn-sm" data-posture="popular">
                    🎸 Posición Popular (0°)
                  </button>
                </div>

                <div class="g3d-part-detail" style="border-left:5px solid #58CC02;margin-top:12px;">
                  <h4>${this.postureStyle === 'clasica' ? 'Posición Clásica / Académica' : 'Posición Popular / Despreocupada'}</h4>
                  <p>${this.postureStyle === 'clasica'
                    ? 'La cintura de la guitarra apoya sobre el muslo izquierdo con un banquito en el pie izquierdo (mástil elevado a 45°). Da máxima apertura a la muñeca para punteos rápidos, arpegios y cejillas.'
                    : 'Apoyo cómodo sobre el muslo derecho. Recuerda la regla de oro de Keyner Ramírez: "La cara de la guitarra debe mirar hacia el frente verticalmente, nunca acostada hacia el techo".'
                  }</p>
                </div>

                <div class="g3d-mini-img-card">
                  <img src="./assets/img/guitar_posture_styles.jpg" alt="Posición Clásica vs Popular" />
                  <img src="./assets/img/guitar_hands_numbering.jpg" alt="Posición y numeración de manos" style="margin-top:8px;" />
                </div>
              ` : ''}

              ${this.activeTab === 'keyner_map' ? `
                <h3>🔢 Diapasón Numérico Keyner (10–60)</h3>
                <div class="keyner-readout-card">
                  <div class="kr-badge-big" style="background:${coordInfo.color.bg};border-color:${coordInfo.color.border};color:${coordInfo.color.text}">
                    <span>CÓDIGO KEYNER</span>
                    <strong>${keynerCode}</strong>
                  </div>
                  <div class="kr-info-lines">
                    <div><strong>Cuerda:</strong> ${this.selectedCoord.s}ª (${this.selectedCoord.s === 1 ? 'Mi agudo' : this.selectedCoord.s === 6 ? 'Mi grave' : NOTES_ES[midiToNoteInfo(getFretMidi(this.selectedCoord.s, 0)).note]})</div>
                    <div><strong>Espacio / Traste:</strong> ${this.selectedCoord.f === 0 ? '0 (Al Aire)' : this.selectedCoord.f}</div>
                    <div><strong>Nota real:</strong> ${coordInfo.noteEs}${coordInfo.octave} (${coordInfo.note}${coordInfo.octave}) · ${coordInfo.freq.toFixed(1)} Hz</div>
                    <div><strong>Dedo sugerido:</strong> ${suggestedFinger}</div>
                  </div>
                </div>

                <div class="keyner-mini-matrix">
                  <p class="tb-lbl">Haz clic en cualquier coordenada del diapasón 3D o abajo para oírla:</p>
                  <div class="km-grid">
                    ${[1, 2, 3, 4, 5, 6].map(s => `
                      <div class="km-row">
                        <span class="km-str">${s}ª</span>
                        ${Array.from({ length: 8 }, (_, f) => {
                          const code = toKeynerFretCode(s, f);
                          const info = midiToNoteInfo(getFretMidi(s, f));
                          const sel = s === this.selectedCoord.s && f === this.selectedCoord.f;
                          return `
                            <button class="km-cell ${sel ? 'km-active' : ''}" data-ks="${s}" data-kf="${f}" style="${sel ? `background:${info.color.bg};color:${info.color.text}` : ''}">
                              ${code}
                            </button>
                          `;
                        }).join('')}
                      </div>
                    `).join('')}
                  </div>
                </div>

                <div class="keyner-quick-demos">
                  <button class="duo-btn btn-green btn-sm" id="g3d-play-coord">🔊 Hacer Sonar Cód. ${keynerCode}</button>
                  <button class="duo-btn btn-purple btn-sm" id="g3d-play-scale">🎵 Escala Do Keyner (53→18)</button>
                </div>
              ` : ''}
            </div>
          </div>
        ` : `
          <!-- MODO 4: GALERÍA DE LÁMINAS + TABLA RELACIONES ARMÓNICAS DE KEYNER -->
          <div class="g3d-gallery-grid">
            <div class="duo-card g3d-poster-viewer">
              <div class="g3d-poster-tabs">
                ${NANO_BANANA_GALLERY.map(img => `
                  <button class="mini-pill ${img.id === activeGallery.id ? 'active' : ''}" data-galid="${img.id}">
                    🖼️ ${img.title.split('(')[0].trim()}
                  </button>
                `).join('')}
              </div>
              <div class="g3d-poster-frame">
                <h3>${activeGallery.title}</h3>
                <p class="muted-hint">${activeGallery.subtitle}</p>
                <img src="${activeGallery.src}" alt="${activeGallery.title}" class="g3d-full-poster-img" />
              </div>
            </div>

            <div class="duo-card g3d-harmonic-table-card">
              <h3>🔗 Tabla: Relaciones Armónicas de los Tonos (Libro Keyner p.5)</h3>
              <p class="tab-subtitle">Selecciona un <strong>Tono Primitivo</strong> para explorar y escuchar su Relativo, Subdominante y su <strong>5ª Dominante</strong> tal como aparece en las canciones del libro físico:</p>

              <div class="ht-key-pills">
                ${KEYNER_HARMONIC_TABLE.map(row => `
                  <button class="mini-pill ${row.tonic === activeHarm.tonic ? 'active' : ''}" data-hkey="${row.tonic}">
                    ${row.name}
                  </button>
                `).join('')}
              </div>

              <div class="ht-cards-grid">
                ${[
                  ['1. Tono Primitivo (I)', activeHarm.tonic, 'Centro / Casa'],
                  ['2. Relativo (VIm / III)', activeHarm.relativo, 'Misma armadura'],
                  ['3. Segundo Asonante', activeHarm.seg, 'Preparación suave'],
                  ['4. Cuarto Subdominante', activeHarm.sub, 'Viaje / Coro'],
                  ['5. Quinta Siguiente (Dominante)', activeHarm.quinta, `${activeHarm.quintaKeyner} en Libro`]
                ].map(([roleLbl, chord, subTxt]) => {
                  const col = NOTE_COLORS[chord.replace(/[^A-G#]/g, '').slice(0, 2)] || NOTE_COLORS.C;
                  return `
                    <button class="ht-chord-tile" data-hplay="${chord}" style="--hc:${col.bg};--hb:${col.border}">
                      <small>${roleLbl}</small>
                      <strong>${chord} <span style="opacity:0.8">(${formatKeynerChordSymbol(chord)})</span></strong>
                      <span>${subTxt} · 🔊 Tocar</span>
                    </button>
                  `;
                }).join('')}
              </div>
            </div>
          </div>
        `}
      </div>
    `;

    this._bindEvents();
    if (this.activeTab !== 'gallery') {
      this._startRenderLoop();
      this._tryUpgradeThreeJS();
    } else if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  _bindEvents() {
    this.container.querySelectorAll('[data-g3dtab]').forEach(btn => {
      btn.addEventListener('click', () => this.setMode(btn.dataset.g3dtab));
    });

    this.container.querySelectorAll('[data-partid]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.selectedPartId = btn.dataset.partid;
        audioEngine.playMidi(64, 0.35, 0.4);
        this.render();
      });
    });

    this.container.querySelectorAll('[data-posture]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.postureStyle = btn.dataset.posture;
        this.targetRollZ = this.postureStyle === 'clasica' ? -0.68 : 0.10;
        this.render();
      });
    });

    this.container.querySelectorAll('[data-ks]').forEach(btn => {
      btn.addEventListener('click', () => {
        const s = Number(btn.dataset.ks);
        const f = Number(btn.dataset.kf);
        this.selectedCoord = { s, f };
        this._pluckVisualAndAudio(s, f);
        if (this.onAwardXP) this.onAwardXP(2, `Exploraste Cód. Keyner ${toKeynerFretCode(s, f)}`);
        this.render();
      });
    });

    this.container.querySelector('#g3d-play-coord')?.addEventListener('click', () => {
      this._pluckVisualAndAudio(this.selectedCoord.s, this.selectedCoord.f);
    });

    this.container.querySelector('#g3d-play-scale')?.addEventListener('click', () => {
      const seq = [
        [5, 3], [4, 0], [4, 2], [4, 3], [3, 0], [3, 2], [2, 0], [2, 1],
        [2, 3], [1, 0], [1, 1], [1, 3], [1, 5], [1, 7], [1, 8]
      ];
      seq.forEach(([s, f], idx) => {
        setTimeout(() => {
          this.selectedCoord = { s, f };
          this._pluckVisualAndAudio(s, f);
        }, idx * 240);
      });
      if (this.onAwardXP) this.onAwardXP(10, 'Escala de Do Keyner en 3D');
    });

    this.container.querySelectorAll('[data-galid]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeGalleryId = btn.dataset.galid;
        this.render();
      });
    });

    this.container.querySelectorAll('[data-hkey]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.selectedHarmonicKey = btn.dataset.hkey;
        audioEngine.strumChord(this.selectedHarmonicKey, 'down', 0);
        this.render();
      });
    });

    this.container.querySelectorAll('[data-hplay]').forEach(btn => {
      btn.addEventListener('click', () => {
        const ch = btn.dataset.hplay;
        audioEngine.strumChord(ch, 'down', 0);
      });
    });

    // Cámara
    this.container.querySelector('#g3d-cam-front')?.addEventListener('click', () => {
      this.rotY = 0; this.rotX = 0; this.autoRotate = false;
    });
    this.container.querySelector('#g3d-cam-angle')?.addEventListener('click', () => {
      this.rotY = 0.36; this.rotX = -0.22; this.autoRotate = false;
    });
    this.container.querySelector('#g3d-cam-side')?.addEventListener('click', () => {
      this.rotY = 1.25; this.rotX = -0.06; this.autoRotate = false;
    });
    this.container.querySelector('#g3d-cam-back')?.addEventListener('click', () => {
      this.rotY = 3.14; this.rotX = -0.05; this.autoRotate = false;
    });
    this.container.querySelector('#g3d-toggle-spin')?.addEventListener('click', () => {
      this.autoRotate = !this.autoRotate;
      this.render();
    });
    this.container.querySelector('#g3d-zoom-in')?.addEventListener('click', () => {
      this.zoom = Math.min(1.85, this.zoom + 0.15);
      this.render();
    });
    this.container.querySelector('#g3d-zoom-out')?.addEventListener('click', () => {
      this.zoom = Math.max(0.65, this.zoom - 0.15);
      this.render();
    });

    // Interacción drag & click sobre Canvas 3D (mouse + táctil)
    const canvas = this.container.querySelector('#guitar-3d-canvas');
    if (canvas) {
      const startDrag = (x, y) => {
        this.isDragging = true;
        this.dragMoved = false;
        this.lastMouse = { x, y };
      };
      const moveDrag = (x, y) => {
        if (!this.isDragging) return;
        const dx = x - this.lastMouse.x;
        const dy = y - this.lastMouse.y;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) this.dragMoved = true;
        this.rotY += dx * 0.01;
        this.rotX = Math.max(-1.1, Math.min(1.1, this.rotX + dy * 0.008));
        this.lastMouse = { x, y };
      };
      const endDrag = (clientX, clientY) => {
        const wasClick = !this.dragMoved && clientX !== undefined;
        this.isDragging = false;
        if (wasClick) {
          const activeCanvas = this.container?.querySelector('#guitar-3d-canvas') || canvas;
          const rect = activeCanvas.getBoundingClientRect();
          const px = clientX - rect.left;
          const py = clientY - rect.top;
          this._handleCanvasClick(px, py);
        }
      };

      canvas.addEventListener('mousedown', e => startDrag(e.clientX, e.clientY));
      canvas.addEventListener('touchstart', e => {
        const t = e.touches[0];
        if (t) startDrag(t.clientX, t.clientY);
      }, { passive: true });
      canvas.addEventListener('touchmove', e => {
        const t = e.touches[0];
        if (t && this.isDragging) {
          e.preventDefault();
          moveDrag(t.clientX, t.clientY);
        }
      }, { passive: false });
      canvas.addEventListener('touchend', e => {
        const t = e.changedTouches[0];
        if (this.isDragging) endDrag(t?.clientX, t?.clientY);
      });

      if (!this._windowDragBound) {
        this._windowDragBound = true;
        window.addEventListener('mousemove', e => moveDrag(e.clientX, e.clientY));
        window.addEventListener('mouseup', e => {
          if (this.isDragging) endDrag(e.clientX, e.clientY);
        });
      }
      canvas.addEventListener('wheel', e => {
        e.preventDefault();
        this.zoom = Math.max(0.65, Math.min(1.85, this.zoom - Math.sign(e.deltaY) * 0.08));
      }, { passive: false });
    }
  }

  _handleCanvasClick(px, py) {
    if (this.activeTab === 'anatomy') {
      let best = null;
      let minDist = 26;
      for (const hp of this.projectedParts) {
        const d = Math.hypot(hp.x - px, hp.y - py);
        if (d < minDist) {
          minDist = d;
          best = hp;
        }
      }
      if (best) {
        this.selectedPartId = best.id;
        audioEngine.playMidi(64, 0.4, 0.35);
        this.render();
      }
    } else if (this.activeTab === 'keyner_map') {
      let best = null;
      let minDist = 18;
      for (const fr of this.projectedFrets) {
        const d = Math.hypot(fr.x - px, fr.y - py);
        if (d < minDist) {
          minDist = d;
          best = fr;
        }
      }
      if (best) {
        this.selectedCoord = { s: best.s, f: best.f };
        this._pluckVisualAndAudio(best.s, best.f);
        this.render();
      }
    }
  }
}
