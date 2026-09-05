"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export function MainBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    // Rich gradient sky background
    scene.background = new THREE.Color(0x1a1040)
    scene.fog = new THREE.FogExp2(0x1a1040, 0.012)

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 200)
    camera.position.set(0, 10, 35)
    camera.lookAt(0, 2, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFShadowMap
    container.appendChild(renderer.domElement)

    // Vibrant Lighting
    const ambientLight = new THREE.AmbientLight(0x4422ff, 0.4)
    scene.add(ambientLight)

    // Warm sunset from the right
    const sunLight = new THREE.DirectionalLight(0xff8844, 1.5)
    sunLight.position.set(20, 25, 10)
    sunLight.castShadow = true
    sunLight.shadow.mapSize.width = 1024
    sunLight.shadow.mapSize.height = 1024
    scene.add(sunLight)

    // Cool fill from the left
    const fillLight = new THREE.DirectionalLight(0x4488ff, 0.8)
    fillLight.position.set(-15, 10, -10)
    scene.add(fillLight)

    // Magenta rim light from below
    const rimLight = new THREE.PointLight(0xff44cc, 3, 60)
    rimLight.position.set(0, -5, 10)
    scene.add(rimLight)

    // Main group for the island
    const worldGroup = new THREE.Group()
    scene.add(worldGroup)

    // Materials - VIBRANT flat-shaded low-poly
    const grassMat = new THREE.MeshStandardMaterial({ color: 0x44dd66, flatShading: true, roughness: 0.8 })
    const dirtMat = new THREE.MeshStandardMaterial({ color: 0x995522, flatShading: true, roughness: 1.0 })
    const waterMat = new THREE.MeshStandardMaterial({ color: 0x22aaff, flatShading: true, roughness: 0.2, metalness: 0.3, transparent: true, opacity: 0.85 })
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x663311, flatShading: true, roughness: 1.0 })
    const leafMats = [
      new THREE.MeshStandardMaterial({ color: 0x22cc55, flatShading: true, roughness: 0.7 }),
      new THREE.MeshStandardMaterial({ color: 0xff6633, flatShading: true, roughness: 0.7 }),
      new THREE.MeshStandardMaterial({ color: 0xffcc00, flatShading: true, roughness: 0.7 }),
    ]
    const crystalMat = new THREE.MeshStandardMaterial({ color: 0xcc44ff, flatShading: true, roughness: 0.1, metalness: 0.6, emissive: 0x6622aa, emissiveIntensity: 0.5 })
    const cloudMat = new THREE.MeshStandardMaterial({ color: 0xffeeff, flatShading: true, transparent: true, opacity: 0.85 })

    // Randomize vertices for low-poly organic look
    function randomizeVertices(geometry: THREE.BufferGeometry, amount: number) {
      const pos = geometry.attributes.position.array as Float32Array
      for (let i = 0; i < pos.length; i += 3) {
        pos[i] += (Math.random() - 0.5) * amount
        pos[i + 1] += (Math.random() - 0.5) * amount
        pos[i + 2] += (Math.random() - 0.5) * amount
      }
      geometry.computeVertexNormals()
    }

    // 1. Island base (dirt chunk)
    const baseGeo = new THREE.CylinderGeometry(8, 1, 10, 10, 4)
    randomizeVertices(baseGeo, 1.8)
    const islandBase = new THREE.Mesh(baseGeo, dirtMat)
    islandBase.position.y = -4
    islandBase.castShadow = true
    islandBase.receiveShadow = true
    worldGroup.add(islandBase)

    // 2. Grass top
    const grassGeo = new THREE.CylinderGeometry(8.5, 7.5, 1.5, 10, 1)
    randomizeVertices(grassGeo, 1.5)
    const grassTop = new THREE.Mesh(grassGeo, grassMat)
    grassTop.position.y = 1.5
    grassTop.castShadow = true
    grassTop.receiveShadow = true
    worldGroup.add(grassTop)

    // 3. Trees (colorful autumn trees)
    for (let i = 0; i < 7; i++) {
      const treeGroup = new THREE.Group()
      const trunkGeo = new THREE.CylinderGeometry(0.15, 0.3, 1.8, 5)
      const trunk = new THREE.Mesh(trunkGeo, woodMat)
      trunk.position.y = 0.9
      trunk.castShadow = true
      treeGroup.add(trunk)

      const leavesGeo = new THREE.IcosahedronGeometry(1.1, 0)
      randomizeVertices(leavesGeo, 0.3)
      const leaves = new THREE.Mesh(leavesGeo, leafMats[i % leafMats.length])
      leaves.position.y = 2.4
      leaves.castShadow = true
      treeGroup.add(leaves)

      const angle = (i / 7) * Math.PI * 2 + Math.random() * 0.5
      const rad = Math.random() * 4 + 2
      treeGroup.position.set(Math.cos(angle) * rad, 2, Math.sin(angle) * rad)
      const scale = Math.random() * 0.5 + 0.7
      treeGroup.scale.set(scale, scale, scale)
      worldGroup.add(treeGroup)
    }

    // 4. Glowing crystals
    for (let i = 0; i < 4; i++) {
      const crystalGeo = new THREE.OctahedronGeometry(0.5, 0)
      const crystal = new THREE.Mesh(crystalGeo, crystalMat)
      const angle = Math.random() * Math.PI * 2
      const rad = Math.random() * 3 + 3
      crystal.position.set(Math.cos(angle) * rad, 2.8 + Math.random() * 0.5, Math.sin(angle) * rad)
      crystal.scale.y = 1.5
      crystal.castShadow = true
      worldGroup.add(crystal)
    }

    // 5. Water ring around the island
    const waterGeo = new THREE.RingGeometry(9, 18, 12)
    const water = new THREE.Mesh(waterGeo, waterMat)
    water.rotation.x = -Math.PI / 2
    water.position.y = 0.5
    water.receiveShadow = true
    worldGroup.add(water)

    // 6. Floating Clouds
    const cloudGroup = new THREE.Group()
    scene.add(cloudGroup)
    for (let i = 0; i < 8; i++) {
      const cloud = new THREE.Group()
      const numPuffs = Math.floor(Math.random() * 3) + 3
      for (let p = 0; p < numPuffs; p++) {
        const puffGeo = new THREE.IcosahedronGeometry(Math.random() * 1.2 + 0.8, 0)
        const puff = new THREE.Mesh(puffGeo, cloudMat)
        puff.position.set(
          (Math.random() - 0.5) * 3,
          (Math.random() - 0.5) * 0.8,
          (Math.random() - 0.5) * 3
        )
        cloud.add(puff)
      }
      const angle = (i / 8) * Math.PI * 2 + Math.random()
      const rad = Math.random() * 8 + 14
      cloud.position.set(
        Math.cos(angle) * rad,
        Math.random() * 5 + 6,
        Math.sin(angle) * rad
      )
      cloudGroup.add(cloud)
    }

    // 7. Sparkle Particles
    const pGeo = new THREE.BufferGeometry()
    const pCount = 100
    const pArr = new Float32Array(pCount * 3)
    for (let i = 0; i < pCount * 3; i++) {
      pArr[i] = (Math.random() - 0.5) * 50
      pArr[i + 1] = (Math.random() - 0.5) * 30 + 8
      pArr[i + 2] = (Math.random() - 0.5) * 50
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pArr, 3))
    const pMat = new THREE.PointsMaterial({
      color: 0xffcc44,
      size: 0.15,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    })
    const sparkles = new THREE.Points(pGeo, pMat)
    scene.add(sparkles)

    // Animation
    let raf: number
    const startTime = performance.now()

    function animate() {
      raf = requestAnimationFrame(animate)
      const t = (performance.now() - startTime) * 0.001

      // Slowly rotate the island
      worldGroup.rotation.y = t * 0.08
      // Gentle bob
      worldGroup.position.y = Math.sin(t * 0.7) * 0.5

      // Clouds orbit in opposite direction
      cloudGroup.rotation.y = -t * 0.04
      cloudGroup.position.y = Math.sin(t * 0.4) * 0.5

      // Sparkle drift
      sparkles.rotation.y = t * 0.03

      // Crystals pulse
      crystalMat.emissiveIntensity = 0.3 + Math.sin(t * 3) * 0.3

      renderer.render(scene, camera)
    }
    animate()

    // Resize
    function handleResize() {
      if (!container) return
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", handleResize)
      renderer.dispose()
      baseGeo.dispose()
      grassGeo.dispose()
      waterGeo.dispose()
      pGeo.dispose()
      grassMat.dispose()
      dirtMat.dispose()
      waterMat.dispose()
      woodMat.dispose()
      leafMats.forEach(m => m.dispose())
      crystalMat.dispose()
      cloudMat.dispose()
      pMat.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-0"
      style={{ background: "linear-gradient(to bottom, #2d1b69, #1a1040, #0d0820)" }}
    />
  )
}
