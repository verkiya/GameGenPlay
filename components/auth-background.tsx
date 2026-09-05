"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

// === GAME ITEM BUILDERS ===

function createSword(): THREE.Group {
  const group = new THREE.Group()
  const bladeMat = new THREE.MeshStandardMaterial({
    color: 0xccccee, metalness: 0.95, roughness: 0.1, transparent: true, opacity: 0.4,
    emissive: 0x6366f1, emissiveIntensity: 0.1,
  })
  const wireMat = new THREE.MeshStandardMaterial({
    color: 0x818cf8, wireframe: true, transparent: true, opacity: 0.5,
    emissive: 0x818cf8, emissiveIntensity: 0.4,
  })
  const handleMat = new THREE.MeshStandardMaterial({
    color: 0x92400e, metalness: 0.3, roughness: 0.7, transparent: true, opacity: 0.5,
    emissive: 0x92400e, emissiveIntensity: 0.1,
  })

  const blade = new THREE.Mesh(new THREE.ConeGeometry(0.12, 1.4, 4), bladeMat)
  blade.position.y = 0.7
  group.add(blade)
  const bladeW = new THREE.Mesh(new THREE.ConeGeometry(0.13, 1.42, 4), wireMat)
  bladeW.position.y = 0.7
  group.add(bladeW)
  group.add(new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.06, 0.08), new THREE.MeshStandardMaterial({
    color: 0xeab308, metalness: 0.8, roughness: 0.2, transparent: true, opacity: 0.5,
    emissive: 0xeab308, emissiveIntensity: 0.2,
  })))
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.4, 6), handleMat)
  handle.position.y = -0.22
  group.add(handle)
  const pommel = new THREE.Mesh(new THREE.SphereGeometry(0.07, 6, 6), wireMat.clone())
  pommel.position.y = -0.45
  group.add(pommel)
  return group
}

function createGamepad(): THREE.Group {
  const group = new THREE.Group()
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x1e1e2e, metalness: 0.5, roughness: 0.4, transparent: true, opacity: 0.5,
    emissive: 0x4466ff, emissiveIntensity: 0.1,
  })
  const wireMat = new THREE.MeshStandardMaterial({
    color: 0x60a5fa, wireframe: true, transparent: true, opacity: 0.35,
    emissive: 0x60a5fa, emissiveIntensity: 0.3,
  })

  group.add(new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.12, 0.5, 2, 1, 2), bodyMat))
  group.add(new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.13, 0.52, 2, 1, 2), wireMat))

  const gripMat = bodyMat.clone()
  const lGrip = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.08, 0.35, 6), gripMat)
  lGrip.position.set(-0.35, -0.15, 0.1); lGrip.rotation.x = 0.3; group.add(lGrip)
  const rGrip = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.08, 0.35, 6), gripMat.clone())
  rGrip.position.set(0.35, -0.15, 0.1); rGrip.rotation.x = 0.3; group.add(rGrip)

  const dpad = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.05, 12),
    new THREE.MeshStandardMaterial({ color: 0x94a3b8, emissive: 0x94a3b8, emissiveIntensity: 0.3 }))
  dpad.position.set(-0.2, 0.09, -0.05); group.add(dpad)

  const btnPos = [[0.2, 0.09, -0.12], [0.28, 0.09, -0.04], [0.12, 0.09, -0.04], [0.2, 0.09, 0.04]]
  const btnCol = [0xef4444, 0x22c55e, 0x3b82f6, 0xeab308]
  btnPos.forEach(([x, y, z], i) => {
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8),
      new THREE.MeshStandardMaterial({ color: btnCol[i], emissive: btnCol[i], emissiveIntensity: 1, transparent: true, opacity: 0.9 }))
    b.position.set(x, y, z); group.add(b)
  })
  return group
}

function createGem(): THREE.Group {
  const group = new THREE.Group()
  const col = 0x22c55e
  const wireMat = new THREE.MeshStandardMaterial({
    color: col, wireframe: true, transparent: true, opacity: 0.45, emissive: col, emissiveIntensity: 0.5,
  })
  const innerMat = new THREE.MeshStandardMaterial({
    color: col, transparent: true, opacity: 0.15, emissive: col, emissiveIntensity: 0.3, metalness: 0.8, roughness: 0.1,
  })

  const top = new THREE.Mesh(new THREE.ConeGeometry(0.4, 0.5, 6), wireMat)
  top.position.y = 0.25; group.add(top)
  const bot = new THREE.Mesh(new THREE.ConeGeometry(0.4, 0.7, 6), wireMat.clone())
  bot.position.y = -0.35; bot.rotation.x = Math.PI; group.add(bot)
  group.add(new THREE.Mesh(new THREE.OctahedronGeometry(0.3, 0), innerMat))
  return group
}

function createCrown(): THREE.Group {
  const group = new THREE.Group()
  const mat = new THREE.MeshStandardMaterial({
    color: 0xeab308, wireframe: true, transparent: true, opacity: 0.45, emissive: 0xeab308, emissiveIntensity: 0.4,
  })
  const solidMat = new THREE.MeshStandardMaterial({
    color: 0xeab308, transparent: true, opacity: 0.2, emissive: 0xeab308, emissiveIntensity: 0.15, metalness: 0.9, roughness: 0.1,
  })
  const band = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.06, 8, 16), solidMat)
  band.rotation.x = Math.PI / 2; group.add(band)
  group.add(new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.065, 8, 16), (() => { const m = mat.clone(); m.wireframe = true; return m })()).also = (m: THREE.Mesh) => { m.rotation.x = Math.PI / 2 })
  const bandW = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.065, 8, 16), mat)
  bandW.rotation.x = Math.PI / 2; group.add(bandW)

  const jColors = [0xef4444, 0x3b82f6, 0x22c55e, 0xa855f7, 0xf97316]
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2
    const spike = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.35, 4), mat.clone())
    spike.position.set(Math.cos(a) * 0.33, 0.18, Math.sin(a) * 0.33); group.add(spike)
    const jewel = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 6),
      new THREE.MeshStandardMaterial({ color: jColors[i], emissive: jColors[i], emissiveIntensity: 1.2, transparent: true, opacity: 0.9 }))
    jewel.position.set(Math.cos(a) * 0.33, 0.38, Math.sin(a) * 0.33); group.add(jewel)
  }
  return group
}

function createPotion(): THREE.Group {
  const group = new THREE.Group()
  const purple = 0xa855f7
  const glassMat = new THREE.MeshStandardMaterial({
    color: 0xccccee, transparent: true, opacity: 0.15, metalness: 0.3, roughness: 0.1,
    emissive: purple, emissiveIntensity: 0.05,
  })
  const wireGlass = new THREE.MeshStandardMaterial({
    color: purple, wireframe: true, transparent: true, opacity: 0.3, emissive: purple, emissiveIntensity: 0.2,
  })
  const liquidMat = new THREE.MeshStandardMaterial({
    color: purple, transparent: true, opacity: 0.5, emissive: purple, emissiveIntensity: 0.6,
  })

  // Bottle body
  const bottle = new THREE.Mesh(new THREE.SphereGeometry(0.3, 12, 12), glassMat)
  group.add(bottle)
  group.add(new THREE.Mesh(new THREE.SphereGeometry(0.31, 12, 12), wireGlass))

  // Neck
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 0.25, 8), glassMat.clone())
  neck.position.y = 0.35; group.add(neck)
  group.add((() => { const m = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.125, 0.26, 8), wireGlass.clone()); m.position.y = 0.35; return m })())

  // Cork
  const cork = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.08, 6),
    new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.9, transparent: true, opacity: 0.6 }))
  cork.position.y = 0.5; group.add(cork)

  // Liquid inside
  const liquid = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 10), liquidMat)
  liquid.position.y = -0.05; group.add(liquid)

  return group
}

function createShield(): THREE.Group {
  const group = new THREE.Group()
  const blue = 0x3b82f6
  const shieldMat = new THREE.MeshStandardMaterial({
    color: 0x1e3a5f, metalness: 0.7, roughness: 0.3, transparent: true, opacity: 0.4,
    emissive: blue, emissiveIntensity: 0.1, side: THREE.DoubleSide,
  })
  const wireMat = new THREE.MeshStandardMaterial({
    color: blue, wireframe: true, transparent: true, opacity: 0.4, emissive: blue, emissiveIntensity: 0.3,
  })

  // Shield face
  const face = new THREE.Mesh(new THREE.CircleGeometry(0.5, 6), shieldMat)
  group.add(face)
  group.add(new THREE.Mesh(new THREE.CircleGeometry(0.52, 6), wireMat))

  // Rim
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.04, 6, 6), new THREE.MeshStandardMaterial({
    color: 0xeab308, metalness: 0.9, roughness: 0.1, transparent: true, opacity: 0.5, emissive: 0xeab308, emissiveIntensity: 0.2,
  }))
  group.add(rim)

  // Emblem (star in center)
  const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.12, 0),
    new THREE.MeshStandardMaterial({ color: 0xeab308, emissive: 0xeab308, emissiveIntensity: 0.8, transparent: true, opacity: 0.8 }))
  star.position.z = 0.05; group.add(star)

  return group
}

function createCoin(): THREE.Group {
  const group = new THREE.Group()
  const gold = 0xeab308
  const coinMat = new THREE.MeshStandardMaterial({
    color: gold, metalness: 0.95, roughness: 0.05, transparent: true, opacity: 0.4,
    emissive: gold, emissiveIntensity: 0.2,
  })
  const wireMat = new THREE.MeshStandardMaterial({
    color: gold, wireframe: true, transparent: true, opacity: 0.4, emissive: gold, emissiveIntensity: 0.3,
  })

  const coin = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.05, 16), coinMat)
  coin.rotation.x = Math.PI / 2; group.add(coin)
  const coinW = new THREE.Mesh(new THREE.CylinderGeometry(0.31, 0.31, 0.06, 16), wireMat)
  coinW.rotation.x = Math.PI / 2; group.add(coinW)

  // $ emblem
  const emblem = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.02, 4, 6),
    new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xfef08a, emissiveIntensity: 0.8, transparent: true, opacity: 0.7 }))
  emblem.position.z = 0.035; group.add(emblem)

  return group
}

function createHeart(): THREE.Group {
  const group = new THREE.Group()
  const pink = 0xec4899
  const mat = new THREE.MeshStandardMaterial({
    color: pink, transparent: true, opacity: 0.5, emissive: pink, emissiveIntensity: 0.5, metalness: 0.3, roughness: 0.4,
  })
  const wireMat = new THREE.MeshStandardMaterial({
    color: pink, wireframe: true, transparent: true, opacity: 0.4, emissive: pink, emissiveIntensity: 0.3,
  })

  // Two spheres for the top
  const l = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 12), mat)
  l.position.set(-0.14, 0.1, 0); group.add(l)
  const r = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 12), mat.clone())
  r.position.set(0.14, 0.1, 0); group.add(r)

  // Bottom cone
  const cone = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.4, 12), mat.clone())
  cone.position.y = -0.15; cone.rotation.x = Math.PI; group.add(cone)

  // Wireframe overlay
  const lw = new THREE.Mesh(new THREE.SphereGeometry(0.21, 8, 8), wireMat)
  lw.position.set(-0.14, 0.1, 0); group.add(lw)
  const rw = new THREE.Mesh(new THREE.SphereGeometry(0.21, 8, 8), wireMat.clone())
  rw.position.set(0.14, 0.1, 0); group.add(rw)

  return group
}

function createStar(): THREE.Group {
  const group = new THREE.Group()
  const yellow = 0xfbbf24
  const mat = new THREE.MeshStandardMaterial({
    color: yellow, transparent: true, opacity: 0.45, emissive: yellow, emissiveIntensity: 0.6,
  })
  const wireMat = new THREE.MeshStandardMaterial({
    color: yellow, wireframe: true, transparent: true, opacity: 0.4, emissive: yellow, emissiveIntensity: 0.4,
  })

  // 5 cones radiating outward
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2
    const spike = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.35, 4), mat.clone())
    spike.position.set(Math.cos(a) * 0.15, Math.sin(a) * 0.15, 0)
    spike.rotation.z = a - Math.PI / 2
    group.add(spike)
  }

  // Center sphere
  group.add(new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 8), mat.clone()))
  group.add(new THREE.Mesh(new THREE.SphereGeometry(0.25, 8, 8), wireMat))

  return group
}

function createTreasureChest(): THREE.Group {
  const group = new THREE.Group()
  const wood = 0x92400e
  const gold = 0xeab308
  const bodyMat = new THREE.MeshStandardMaterial({ color: wood, roughness: 0.8, metalness: 0.1, transparent: true, opacity: 0.5, emissive: wood, emissiveIntensity: 0.1 })
  const wireMat = new THREE.MeshStandardMaterial({ color: gold, wireframe: true, transparent: true, opacity: 0.4, emissive: gold, emissiveIntensity: 0.3 })
  const metalMat = new THREE.MeshStandardMaterial({ color: gold, metalness: 0.9, roughness: 0.1, transparent: true, opacity: 0.5, emissive: gold, emissiveIntensity: 0.2 })

  // Base box
  const base = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.3, 0.4), bodyMat)
  group.add(base)
  group.add(new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.32, 0.42), wireMat))

  // Lid (half cylinder)
  const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.6, 8, 1, false, 0, Math.PI), bodyMat.clone())
  lid.rotation.z = Math.PI / 2; lid.rotation.y = Math.PI / 2; lid.position.y = 0.15; group.add(lid)

  // Lock
  const lock = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.1, 0.06), metalMat)
  lock.position.set(0, 0.05, 0.22); group.add(lock)

  // Gold trim bands
  const band1 = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.04, 0.44), metalMat.clone())
  band1.position.y = -0.05; group.add(band1)
  const band2 = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.04, 0.44), metalMat.clone())
  band2.position.y = 0.1; group.add(band2)

  return group
}

function createRocket(): THREE.Group {
  const group = new THREE.Group()
  const red = 0xef4444
  const white = 0xddddee
  const bodyMat = new THREE.MeshStandardMaterial({ color: white, metalness: 0.6, roughness: 0.2, transparent: true, opacity: 0.45, emissive: white, emissiveIntensity: 0.05 })
  const wireMat = new THREE.MeshStandardMaterial({ color: red, wireframe: true, transparent: true, opacity: 0.4, emissive: red, emissiveIntensity: 0.3 })
  const finMat = new THREE.MeshStandardMaterial({ color: red, transparent: true, opacity: 0.5, emissive: red, emissiveIntensity: 0.3, metalness: 0.5, roughness: 0.3 })

  // Body
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.18, 0.8, 8), bodyMat)
  group.add(body)
  group.add(new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.19, 0.82, 8), wireMat))

  // Nose cone
  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.35, 8), finMat)
  nose.position.y = 0.57; group.add(nose)

  // Fins (3 around the base)
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2
    const fin = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.25, 0.15), finMat.clone())
    fin.position.set(Math.cos(a) * 0.18, -0.3, Math.sin(a) * 0.18)
    fin.rotation.y = -a
    group.add(fin)
  }

  // Engine flame
  const flame = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.3, 6),
    new THREE.MeshStandardMaterial({ color: 0xff6b2b, emissive: 0xff6b2b, emissiveIntensity: 2, transparent: true, opacity: 0.7 }))
  flame.position.y = -0.55; flame.rotation.x = Math.PI; group.add(flame)

  return group
}

function createBomb(): THREE.Group {
  const group = new THREE.Group()
  const dark = 0x1a1a2e
  const bodyMat = new THREE.MeshStandardMaterial({ color: dark, metalness: 0.7, roughness: 0.3, transparent: true, opacity: 0.5, emissive: 0x333333, emissiveIntensity: 0.1 })
  const wireMat = new THREE.MeshStandardMaterial({ color: 0x6b7280, wireframe: true, transparent: true, opacity: 0.35, emissive: 0x6b7280, emissiveIntensity: 0.2 })

  // Sphere body
  group.add(new THREE.Mesh(new THREE.SphereGeometry(0.3, 12, 12), bodyMat))
  group.add(new THREE.Mesh(new THREE.SphereGeometry(0.32, 10, 10), wireMat))

  // Top nub
  const nub = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.1, 6), bodyMat.clone())
  nub.position.y = 0.32; group.add(nub)

  // Fuse
  const fuse = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.2, 4),
    new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.9, transparent: true, opacity: 0.6 }))
  fuse.position.set(0.02, 0.42, 0); fuse.rotation.z = 0.3; group.add(fuse)

  // Spark
  const spark = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 6),
    new THREE.MeshStandardMaterial({ color: 0xfbbf24, emissive: 0xff6b2b, emissiveIntensity: 3, transparent: true, opacity: 0.9 }))
  spark.position.set(0.06, 0.52, 0); group.add(spark)

  return group
}

function createKey(): THREE.Group {
  const group = new THREE.Group()
  const gold = 0xeab308
  const mat = new THREE.MeshStandardMaterial({ color: gold, metalness: 0.9, roughness: 0.1, transparent: true, opacity: 0.45, emissive: gold, emissiveIntensity: 0.3 })
  const wireMat = new THREE.MeshStandardMaterial({ color: gold, wireframe: true, transparent: true, opacity: 0.35, emissive: gold, emissiveIntensity: 0.3 })

  // Handle (torus)
  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.03, 6, 12), mat)
  handle.position.y = 0.3; group.add(handle)
  group.add(new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.035, 6, 12), wireMat).also = (m: THREE.Mesh) => { m.position.y = 0.3 })
  const handleW = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.035, 6, 12), wireMat)
  handleW.position.y = 0.3; group.add(handleW)

  // Shaft
  const shaft = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.5, 0.02), mat.clone())
  shaft.position.y = -0.1; group.add(shaft)

  // Teeth
  const tooth1 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.04, 0.02), mat.clone())
  tooth1.position.set(0.04, -0.3, 0); group.add(tooth1)
  const tooth2 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.04, 0.02), mat.clone())
  tooth2.position.set(0.03, -0.22, 0); group.add(tooth2)

  return group
}

function createDice(): THREE.Group {
  const group = new THREE.Group()
  const white = 0xf0f0f0
  const bodyMat = new THREE.MeshStandardMaterial({ color: white, metalness: 0.1, roughness: 0.3, transparent: true, opacity: 0.4, emissive: white, emissiveIntensity: 0.05 })
  const wireMat = new THREE.MeshStandardMaterial({ color: 0xef4444, wireframe: true, transparent: true, opacity: 0.35, emissive: 0xef4444, emissiveIntensity: 0.2 })
  const dotMat = new THREE.MeshStandardMaterial({ color: 0x111111, emissive: 0xef4444, emissiveIntensity: 0.5, transparent: true, opacity: 0.8 })

  // Cube
  const cube = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4), bodyMat)
  group.add(cube)
  group.add(new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.42, 0.42), wireMat))

  // Dots on one face
  const dotPositions = [[0, 0], [-0.1, 0.1], [0.1, -0.1]]
  dotPositions.forEach(([x, y]) => {
    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.03, 6, 6), dotMat.clone())
    dot.position.set(x, y, 0.21)
    group.add(dot)
  })

  return group
}

function createTrophy(): THREE.Group {
  const group = new THREE.Group()
  const gold = 0xeab308
  const mat = new THREE.MeshStandardMaterial({ color: gold, metalness: 0.95, roughness: 0.05, transparent: true, opacity: 0.4, emissive: gold, emissiveIntensity: 0.25 })
  const wireMat = new THREE.MeshStandardMaterial({ color: gold, wireframe: true, transparent: true, opacity: 0.4, emissive: gold, emissiveIntensity: 0.35 })

  // Cup (inverted cone + cylinder top)
  const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.1, 0.4, 8), mat)
  cup.position.y = 0.2; group.add(cup)
  group.add(new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.11, 0.42, 8), wireMat).also = (m: THREE.Mesh) => { m.position.y = 0.2 })
  const cupW = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.11, 0.42, 8), wireMat)
  cupW.position.y = 0.2; group.add(cupW)

  // Stem
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.2, 6), mat.clone())
  stem.position.y = -0.1; group.add(stem)

  // Base
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.2, 0.06, 8), mat.clone())
  base.position.y = -0.23; group.add(base)

  // Handles
  const handleMat = mat.clone()
  const lHandle = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.02, 4, 8, Math.PI), handleMat)
  lHandle.position.set(-0.3, 0.2, 0); lHandle.rotation.y = Math.PI / 2; group.add(lHandle)
  const rHandle = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.02, 4, 8, Math.PI), handleMat.clone())
  rHandle.position.set(0.3, 0.2, 0); rHandle.rotation.y = -Math.PI / 2; group.add(rHandle)

  // Star on top
  const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.06, 0),
    new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xfef08a, emissiveIntensity: 1.5, transparent: true, opacity: 0.9 }))
  star.position.y = 0.45; group.add(star)

  return group
}

function createFlag(): THREE.Group {
  const group = new THREE.Group()
  const red = 0xef4444
  const poleMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.2, transparent: true, opacity: 0.4 })
  const flagMat = new THREE.MeshStandardMaterial({ color: red, transparent: true, opacity: 0.5, emissive: red, emissiveIntensity: 0.4, side: THREE.DoubleSide })
  const wireMat = new THREE.MeshStandardMaterial({ color: red, wireframe: true, transparent: true, opacity: 0.3, emissive: red, emissiveIntensity: 0.2, side: THREE.DoubleSide })

  // Pole
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.9, 4), poleMat)
  group.add(pole)

  // Flag cloth
  const flag = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.25, 3, 2), flagMat)
  flag.position.set(0.22, 0.28, 0); group.add(flag)
  const flagW = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.27, 3, 2), wireMat)
  flagW.position.set(0.22, 0.28, 0); group.add(flagW)

  // Pole ball top
  const ball = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 6),
    new THREE.MeshStandardMaterial({ color: 0xeab308, emissive: 0xeab308, emissiveIntensity: 0.6, transparent: true, opacity: 0.7 }))
  ball.position.y = 0.47; group.add(ball)

  return group
}

function createMusicNote(): THREE.Group {
  const group = new THREE.Group()
  const cyan = 0x06b6d4
  const mat = new THREE.MeshStandardMaterial({ color: cyan, transparent: true, opacity: 0.5, emissive: cyan, emissiveIntensity: 0.5, metalness: 0.4, roughness: 0.3 })
  const wireMat = new THREE.MeshStandardMaterial({ color: cyan, wireframe: true, transparent: true, opacity: 0.35, emissive: cyan, emissiveIntensity: 0.3 })

  // Note head
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), mat)
  head.scale.set(1.3, 1, 1); group.add(head)
  group.add(new THREE.Mesh(new THREE.SphereGeometry(0.14, 6, 6), wireMat))

  // Stem
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.5, 4), mat.clone())
  stem.position.set(0.1, 0.25, 0); group.add(stem)

  // Flag on stem
  const flag = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 0.2, 2, 2),
    new THREE.MeshStandardMaterial({ color: cyan, emissive: cyan, emissiveIntensity: 0.4, transparent: true, opacity: 0.4, side: THREE.DoubleSide }))
  flag.position.set(0.17, 0.4, 0); group.add(flag)

  return group
}

function createAirplane(color: number): THREE.Group {
  const group = new THREE.Group()
  const bodyMat = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.5, metalness: 0.7, roughness: 0.2 })
  const wingMat = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.3, metalness: 0.5, roughness: 0.3, transparent: true, opacity: 0.85 })

  const body = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.6, 6), bodyMat)
  body.geometry.rotateX(Math.PI / 2); group.add(body)
  const wings = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.015, 0.18), wingMat)
  wings.position.z = -0.05; group.add(wings)
  const tail = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.18, 0.12), wingMat.clone())
  tail.position.set(0, 0.08, -0.25); group.add(tail)
  const glow = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8),
    new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: color, emissiveIntensity: 3, transparent: true, opacity: 0.95 }))
  glow.position.z = 0.32; group.add(glow)
  return group
}

// === MAIN COMPONENT ===

export function AuthBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x080810, 0.015)

    const camera = new THREE.PerspectiveCamera(65, container.clientWidth / container.clientHeight, 0.1, 100)
    camera.position.set(-4, 1.5, 8)
    camera.lookAt(-1, 0.5, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.1
    container.appendChild(renderer.domElement)

    // --- Lighting ---
    scene.add(new THREE.AmbientLight(0x333355, 3))
    const redLight = new THREE.PointLight(0xef4444, 5, 35)
    redLight.position.set(3, 4, 3); scene.add(redLight)
    const blueLight = new THREE.PointLight(0x3b82f6, 3, 30)
    blueLight.position.set(-4, 2, -2); scene.add(blueLight)
    const greenLight = new THREE.PointLight(0x22c55e, 2.5, 25)
    greenLight.position.set(0, -2, 5); scene.add(greenLight)
    const goldLight = new THREE.PointLight(0xeab308, 2.5, 22)
    goldLight.position.set(4, -1, 2); scene.add(goldLight)

    // --- Game Items ---
    interface GameItem { group: THREE.Group; baseY: number; floatSpd: number; floatAmp: number }
    const gameItems: GameItem[] = []

    const items: { builder: () => THREE.Group; pos: [number, number, number]; scale: number; fSpd: number; fAmp: number }[] = [
      // Far left (visible at screen edge)
      { builder: createSword, pos: [-7, 1.5, 2], scale: 1.6, fSpd: 0.7, fAmp: 0.35 },
      { builder: createFlag, pos: [-6.5, 3.5, 0], scale: 1.4, fSpd: 0.65, fAmp: 0.3 },
      { builder: createShield, pos: [-6, -1.5, 3], scale: 1.3, fSpd: 0.55, fAmp: 0.22 },
      // Left
      { builder: createBomb, pos: [-4.5, 0.5, 4], scale: 1.3, fSpd: 0.85, fAmp: 0.28 },
      { builder: createMusicNote, pos: [-4, 3.8, 1], scale: 1.3, fSpd: 0.9, fAmp: 0.32 },
      { builder: createTreasureChest, pos: [-5, -2, 5], scale: 1.2, fSpd: 0.5, fAmp: 0.18 },
      // Center-left (the main showcase area)
      { builder: createPotion, pos: [-2.5, 2.5, 3], scale: 1.3, fSpd: 0.8, fAmp: 0.28 },
      { builder: createCrown, pos: [-1.5, -1, 4], scale: 1.4, fSpd: 0.6, fAmp: 0.2 },
      { builder: createGamepad, pos: [-0.5, 0.8, 3], scale: 1.5, fSpd: 0.5, fAmp: 0.25 },
      { builder: createGem, pos: [0, 3.5, 1], scale: 1.1, fSpd: 0.9, fAmp: 0.35 },
      { builder: createDice, pos: [-1, -2.5, 5], scale: 1.2, fSpd: 1.0, fAmp: 0.25 },
      // Center (slightly right but still left of Clerk)
      { builder: createKey, pos: [1, 2.8, 2], scale: 1.3, fSpd: 0.75, fAmp: 0.3 },
      { builder: createHeart, pos: [1.5, -0.8, 4], scale: 1.2, fSpd: 0.75, fAmp: 0.35 },
      { builder: createCoin, pos: [1.8, 1, 3], scale: 1.1, fSpd: 1.1, fAmp: 0.3 },
      { builder: createRocket, pos: [0.5, 4, 0], scale: 1.2, fSpd: 0.7, fAmp: 0.4 },
      // Top and bottom edges (spread vertically)
      { builder: createStar, pos: [-3, 4.5, 2], scale: 1.0, fSpd: 0.95, fAmp: 0.25 },
      { builder: createTrophy, pos: [0, -3, 5], scale: 1.3, fSpd: 0.6, fAmp: 0.22 },
      { builder: createCoin, pos: [-5.5, -3.5, 6], scale: 0.9, fSpd: 1.3, fAmp: 0.2 },
    ]

    items.forEach((cfg) => {
      const g = cfg.builder()
      g.position.set(...cfg.pos)
      g.scale.setScalar(cfg.scale)
      scene.add(g)
      gameItems.push({ group: g, baseY: cfg.pos[1], floatSpd: cfg.fSpd, floatAmp: cfg.fAmp })
    })

    // --- Airplanes ---
    interface Airplane { group: THREE.Group; radius: number; speed: number; y: number; tilt: number; phase: number }
    const apConfigs = [
      { color: 0xef4444, radius: 5.5, speed: 0.28, y: 1.5, tilt: 0.3, phase: 0 },
      { color: 0x22c55e, radius: 7, speed: -0.18, y: -0.5, tilt: -0.2, phase: Math.PI * 0.7 },
      { color: 0x60a5fa, radius: 4.5, speed: 0.4, y: 3.2, tilt: 0.5, phase: Math.PI * 1.3 },
      { color: 0xeab308, radius: 6, speed: -0.25, y: 0.8, tilt: -0.35, phase: Math.PI * 0.4 },
    ]
    const airplanes: Airplane[] = apConfigs.map((cfg) => {
      const p = createAirplane(cfg.color)
      p.scale.setScalar(1.1)
      scene.add(p)
      return { group: p, radius: cfg.radius, speed: cfg.speed, y: cfg.y, tilt: cfg.tilt, phase: cfg.phase }
    })

    // --- Trails ---
    const trailLen = 40
    const trailGeo = new THREE.BufferGeometry()
    const trailPos = new Float32Array(trailLen * airplanes.length * 3)
    trailGeo.setAttribute("position", new THREE.BufferAttribute(trailPos, 3))
    const trails = new THREE.Points(trailGeo, new THREE.PointsMaterial({
      color: 0xaaaacc, size: 0.02, transparent: true, opacity: 0.25, sizeAttenuation: true,
    }))
    scene.add(trails)
    const trailHistory: THREE.Vector3[][] = airplanes.map(() =>
      Array.from({ length: trailLen }, () => new THREE.Vector3(0, -100, 0))
    )

    // --- Ambient particles (multi-color) ---
    const pCount = 200
    const pGeo = new THREE.BufferGeometry()
    const pArr = new Float32Array(pCount * 3)
    const pColors = new Float32Array(pCount * 3)
    const starColors = [
      new THREE.Color(0xef4444), new THREE.Color(0x3b82f6), new THREE.Color(0x22c55e),
      new THREE.Color(0xeab308), new THREE.Color(0xa855f7), new THREE.Color(0xaaaacc),
    ]
    for (let i = 0; i < pCount; i++) {
      pArr[i * 3] = (Math.random() - 0.5) * 28
      pArr[i * 3 + 1] = (Math.random() - 0.5) * 16
      pArr[i * 3 + 2] = (Math.random() - 0.5) * 28
      const c = starColors[Math.floor(Math.random() * starColors.length)]
      pColors[i * 3] = c.r; pColors[i * 3 + 1] = c.g; pColors[i * 3 + 2] = c.b
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pArr, 3))
    pGeo.setAttribute("color", new THREE.BufferAttribute(pColors, 3))
    const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({
      size: 0.03, transparent: true, opacity: 0.5, sizeAttenuation: true, vertexColors: true,
    }))
    scene.add(particles)

    // --- Grid floor ---
    const grid = new THREE.GridHelper(30, 30, 0x1a1a2e, 0x111122)
    grid.position.y = -3; grid.material.transparent = true; grid.material.opacity = 0.08
    scene.add(grid)

    // --- Animate ---
    const clock = new THREE.Clock()
    let raf: number
    let fc = 0

    function animate() {
      raf = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()
      fc++

      // Float and rotate game items
      gameItems.forEach((item, i) => {
        item.group.rotation.y = t * (0.15 + i * 0.06)
        item.group.rotation.x = Math.sin(t * 0.25 + i * 1.2) * 0.12
        item.group.position.y = item.baseY + Math.sin(t * item.floatSpd + i * 1.5) * item.floatAmp
      })

      // Airplanes
      airplanes.forEach((ap, i) => {
        const a = t * ap.speed + ap.phase
        const x = Math.cos(a) * ap.radius
        const z = Math.sin(a) * ap.radius
        const y = ap.y + Math.sin(t * 0.4 + ap.phase) * 0.5
        ap.group.position.set(x, y, z)
        const na = a + 0.05 * Math.sign(ap.speed)
        ap.group.lookAt(Math.cos(na) * ap.radius, y, Math.sin(na) * ap.radius)
        ap.group.rotation.z = ap.tilt * Math.sin(t * ap.speed * 2)
        if (fc % 3 === 0) { trailHistory[i].pop(); trailHistory[i].unshift(new THREE.Vector3(x, y, z)) }
      })

      const pa = trailGeo.getAttribute("position") as THREE.BufferAttribute
      for (let i = 0; i < airplanes.length; i++) {
        for (let j = 0; j < trailLen; j++) {
          const idx = (i * trailLen + j) * 3
          pa.array[idx] = trailHistory[i][j].x; pa.array[idx + 1] = trailHistory[i][j].y; pa.array[idx + 2] = trailHistory[i][j].z
        }
      }
      pa.needsUpdate = true

      // Camera drift (centered on left side where items are)
      camera.position.x = -1 + Math.sin(t * 0.05) * 1.5
      camera.position.y = 1.5 + Math.sin(t * 0.08) * 0.5
      camera.lookAt(-1, 0.5, 0)

      // Orbiting lights
      redLight.position.x = Math.sin(t * 0.2) * 6; redLight.position.z = Math.cos(t * 0.2) * 6
      blueLight.position.x = Math.cos(t * 0.15) * 7; blueLight.position.z = Math.sin(t * 0.15) * 5
      greenLight.position.x = Math.sin(t * 0.12 + 2) * 5; greenLight.position.z = Math.cos(t * 0.12 + 2) * 4
      goldLight.position.x = Math.cos(t * 0.1 + 1) * 6; goldLight.position.z = Math.sin(t * 0.1 + 1) * 5

      particles.rotation.y = t * 0.008

      renderer.render(scene, camera)
    }
    animate()

    function handleResize() {
      if (!container) return
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }
    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", handleResize)
      renderer.dispose()
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Points) {
          obj.geometry.dispose()
          if (Array.isArray(obj.material)) { obj.material.forEach((m) => m.dispose()) } else { obj.material.dispose() }
        }
      })
      if (container.contains(renderer.domElement)) { container.removeChild(renderer.domElement) }
    }
  }, [])

  return <div ref={containerRef} className="absolute inset-0 overflow-hidden bg-zinc-950" style={{ zIndex: 0 }} />
}
