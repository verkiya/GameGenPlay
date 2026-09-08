import * as THREE from "three"

import {
  createEngine,
  createPostFX,
  materials,
  models,
  lights,
  math,
} from "./engine/index.js"

const BRAND_ORANGE = "#f97316"
const GLOW_CYAN = "#38bdf8"
const GLOW_MAGENTA = "#e81cff"

const engine = createEngine({
  background: "#0a0a0a",
  fov: 40,
  cameraPosition: [0, 2.5, 9],
  lookAt: [0, 1.2, 0],
  fog: { color: "#0a0a0a", near: 6, far: 20 },
  exposure: 0.9,
})

// --- Arcade Cabinet ---------------------------------------------------------
const cabinet = new THREE.Group()

// Materials
const bodyMat = materials.standard({ color: BRAND_ORANGE, roughness: 0.7, metalness: 0.1 })
const darkMat = materials.standard({ color: "#111111", roughness: 0.9 })
const screenMat = materials.standard({
  color: GLOW_CYAN,
  roughness: 0.2,
  emissive: new THREE.Color(GLOW_CYAN),
  emissiveIntensity: 0.8,
})
const btnMat1 = materials.standard({ color: GLOW_MAGENTA, roughness: 0.5 })
const btnMat2 = materials.standard({ color: "#2dd4bf", roughness: 0.5 })

// Base cabinet block
const base = new THREE.Mesh(new THREE.BoxGeometry(1.8, 2.4, 1.6), bodyMat)
base.position.y = 1.2
base.castShadow = true
base.receiveShadow = true
cabinet.add(base)

// Screen cutout (black bezel)
const bezel = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.2, 0.2), darkMat)
bezel.position.set(0, 1.6, 0.8)
bezel.rotation.x = -math.DEG * 10
cabinet.add(bezel)

// Glowing screen
const screen = new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.0, 0.1), screenMat)
screen.position.set(0, 1.6, 0.86)
screen.rotation.x = -math.DEG * 10
cabinet.add(screen)

// Control panel (jutting out)
const panel = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.3, 1.0), darkMat)
panel.position.set(0, 0.8, 1.1)
panel.rotation.x = math.DEG * 12
panel.castShadow = true
cabinet.add(panel)

// Joystick base
const joyBase = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.1), bodyMat)
joyBase.position.set(-0.5, 1.0, 1.0)
joyBase.rotation.x = math.DEG * 12
cabinet.add(joyBase)

// Joystick stick
const stickMat = new THREE.MeshStandardMaterial({ color: "#94a3b8", metalness: 0.8, roughness: 0.2 })
const joyStick = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.3), stickMat)
joyStick.position.set(-0.5, 1.15, 0.97)
joyStick.rotation.x = math.DEG * 30
cabinet.add(joyStick)

// Joystick ball
const joyBall = new THREE.Mesh(new THREE.SphereGeometry(0.12), btnMat1)
joyBall.position.set(-0.5, 1.3, 0.88)
cabinet.add(joyBall)

// Buttons
const btnGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.1)
const btn1 = new THREE.Mesh(btnGeo, btnMat1)
btn1.position.set(0.3, 1.0, 1.1)
btn1.rotation.x = math.DEG * 12
cabinet.add(btn1)

const btn2 = new THREE.Mesh(btnGeo, btnMat2)
btn2.position.set(0.6, 1.02, 0.95)
btn2.rotation.x = math.DEG * 12
cabinet.add(btn2)

cabinet.position.y = 0.2
engine.add(cabinet)

// --- Environment ------------------------------------------------------------

const floor = models.ground(40, { color: "#111111", accent: "#0a0a0a" })
engine.add(floor)

const shadow = lights.blobShadow(engine.scene, cabinet, {
  radius: 1.8,
  opacity: 0.8,
})

lights.studio(engine.scene, { intensity: 0.4 })

// Glowing light cast from the screen
const screenLight = new THREE.PointLight(new THREE.Color(GLOW_CYAN), 20, 8, 2)
screenLight.position.set(0, 2.5, 3.5)
engine.add(screenLight)

// Floating particles
const dust = new THREE.Points(
  (() => {
    const count = 100
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = math.randSpread(10)
      positions[i * 3 + 1] = math.randRange(0, 8)
      positions[i * 3 + 2] = math.randSpread(8)
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    return geometry
  })(),
  new THREE.PointsMaterial({
    color: new THREE.Color(GLOW_CYAN),
    size: 0.08,
    map: materials.sparkTexture({ color: "#ffffff" }),
    transparent: true,
    opacity: 0.7,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
)
engine.add(dust)

createPostFX(engine, {
  bloom: { strength: 0.3, radius: 0.6, threshold: 0.7 },
})

// --- Motion -----------------------------------------------------------------

const stillness = matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 1
const dustPositions = dust.geometry.attributes.position.array

engine.onUpdate((dt, elapsed) => {
  // Gentle float and rotation
  cabinet.position.y = 0.2 + Math.sin(elapsed * 1.5) * 0.15 * stillness
  cabinet.rotation.y = Math.sin(elapsed * 0.7) * 0.15 * stillness
  cabinet.rotation.x = Math.sin(elapsed * 1.1) * 0.05 * stillness
  
  shadow.update(0)

  // Pulsing screen glow
  const pulse = Math.sin(elapsed * 3)
  screenMat.emissiveIntensity = 0.2 + pulse * 0.05
  screenLight.intensity = 3 + pulse * 1

  // Drift the dust particles upwards
  for (let i = 0; i < dustPositions.length; i += 3) {
    dustPositions[i + 1] += dt * 0.4 * stillness
    if (dustPositions[i + 1] > 8) dustPositions[i + 1] = 0
  }
  dust.geometry.attributes.position.needsUpdate = true
})

engine.start()

// --- Words ------------------------------------------------------------------

const copy = document.createElement("main")
copy.className = "welcome"
copy.innerHTML = `
  <h1>New game</h1>
  <p>Nothing has been built yet — describe the game you want.</p>
`
document.body.appendChild(copy)
