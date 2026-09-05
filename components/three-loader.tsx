"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { motion } from "framer-motion"

export function ThreeLoader() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(35, container.clientWidth / container.clientHeight, 0.1, 100)
    // High isometric angle so the green grass is the hero, not the dirt
    camera.position.set(6, 8, 6)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFShadowMap
    container.appendChild(renderer.domElement)

    // Bright, warm lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.7))

    const sunLight = new THREE.DirectionalLight(0xfff4e0, 1.5)
    sunLight.position.set(8, 12, 6)
    sunLight.castShadow = true
    sunLight.shadow.mapSize.width = 512
    sunLight.shadow.mapSize.height = 512
    scene.add(sunLight)

    const fillLight = new THREE.DirectionalLight(0x88bbff, 0.6)
    fillLight.position.set(-6, 4, -6)
    scene.add(fillLight)

    const world = new THREE.Group()
    const boxGeo = new THREE.BoxGeometry(1, 1, 1)

    // Vibrant materials
    const grassMat = new THREE.MeshStandardMaterial({ color: 0x4ade80, flatShading: true, roughness: 0.85 })
    const dirtMat = new THREE.MeshStandardMaterial({ color: 0x92400e, flatShading: true, roughness: 1.0 })
    const waterMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, flatShading: true, roughness: 0.2, metalness: 0.3, transparent: true, opacity: 0.8 })
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x78350f, flatShading: true, roughness: 1.0 })
    const leafMat1 = new THREE.MeshStandardMaterial({ color: 0x22c55e, flatShading: true, roughness: 0.7 })
    const leafMat2 = new THREE.MeshStandardMaterial({ color: 0xfbbf24, flatShading: true, roughness: 0.7 })
    const flowerMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, flatShading: true, roughness: 0.6 })

    // 5x5 island with height variation
    const heightMap = [
      [0, 0, 0, 0, 0],
      [0, 1, 1, 1, 0],
      [0, 1, 2, 1, 0],
      [0, 1, 1, 1, 0],
      [0, 0, 0, 0, 0],
    ]

    for (let x = 0; x < 5; x++) {
      for (let z = 0; z < 5; z++) {
        const h = heightMap[z][x]
        // Grass top
        const grass = new THREE.Mesh(boxGeo, grassMat)
        grass.position.set(x - 2, h * 0.3, z - 2)
        grass.castShadow = true
        grass.receiveShadow = true
        world.add(grass)

        // Dirt layers below
        for (let d = 1; d <= 2; d++) {
          const dirt = new THREE.Mesh(boxGeo, dirtMat)
          dirt.position.set(x - 2, h * 0.3 - d, z - 2)
          dirt.castShadow = true
          world.add(dirt)
        }
      }
    }

    // Water around the island
    const waterGeo = new THREE.BoxGeometry(9, 0.4, 9)
    const water = new THREE.Mesh(waterGeo, waterMat)
    water.position.set(0, -1.5, 0)
    water.receiveShadow = true
    world.add(water)

    // Tree 1 (center, green)
    const t1 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.5, 0.3), woodMat)
    t1.position.set(0, 1.35, 0)
    t1.castShadow = true
    world.add(t1)
    const l1 = new THREE.Mesh(new THREE.IcosahedronGeometry(0.9, 0), leafMat1)
    l1.position.set(0, 2.5, 0)
    l1.castShadow = true
    world.add(l1)

    // Tree 2 (offset, yellow/autumn)
    const t2 = new THREE.Mesh(new THREE.BoxGeometry(0.25, 1.2, 0.25), woodMat)
    t2.position.set(-1, 1.0, 1)
    t2.castShadow = true
    world.add(t2)
    const l2 = new THREE.Mesh(new THREE.IcosahedronGeometry(0.7, 0), leafMat2)
    l2.position.set(-1, 2.0, 1)
    l2.castShadow = true
    world.add(l2)

    // Flowers (small colored cubes)
    const flowerPositions = [[1, 0.65, -1], [-1, 0.35, -1], [1, 0.35, 1]]
    flowerPositions.forEach(([fx, fy, fz]) => {
      const flower = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.3, 0.2), flowerMat)
      flower.position.set(fx, fy, fz)
      flower.castShadow = true
      world.add(flower)
    })

    scene.add(world)

    // Animation
    let raf: number
    const startTime = performance.now()

    function animate() {
      raf = requestAnimationFrame(animate)
      const t = (performance.now() - startTime) * 0.001

      // Smooth rotation
      world.rotation.y = t * 0.8

      // Gentle float
      world.position.y = Math.sin(t * 2) * 0.15

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
      boxGeo.dispose()
      waterGeo.dispose()
      grassMat.dispose()
      dirtMat.dispose()
      waterMat.dispose()
      woodMat.dispose()
      leafMat1.dispose()
      leafMat2.dispose()
      flowerMat.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
      className="flex flex-col items-center justify-center"
    >
      <div ref={containerRef} className="h-48 w-48 md:h-56 md:w-56 relative" />
    </motion.div>
  )
}
