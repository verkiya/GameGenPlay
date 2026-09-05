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
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100)
    // Isometric-ish angle for a classic game look
    camera.position.set(5, 4, 6)
    camera.lookAt(0, 0.5, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    
    // Soft shadows for depth
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFShadowMap
    container.appendChild(renderer.domElement)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)
    
    const dirLight = new THREE.DirectionalLight(0xfff0dd, 1.2)
    dirLight.position.set(5, 8, 3)
    dirLight.castShadow = true
    dirLight.shadow.mapSize.width = 512
    dirLight.shadow.mapSize.height = 512
    dirLight.shadow.bias = -0.001
    scene.add(dirLight)

    const fillLight = new THREE.DirectionalLight(0xaabbff, 0.5)
    fillLight.position.set(-5, 3, -5)
    scene.add(fillLight)

    // The Mini World Group
    const worldGroup = new THREE.Group()
    
    // Materials
    const dirtMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 1.0, flatShading: true })
    const grassMat = new THREE.MeshStandardMaterial({ color: 0x4ade80, roughness: 0.9, flatShading: true })
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 1.0, flatShading: true })
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.8, flatShading: true })
    const cloudMat = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.9, flatShading: true })

    const boxGeo = new THREE.BoxGeometry(1, 1, 1)

    // Build the 3x3 island
    for (let x = -1; x <= 1; x++) {
      for (let z = -1; z <= 1; z++) {
        // Dirt base
        const dirt = new THREE.Mesh(boxGeo, dirtMat)
        dirt.position.set(x, -0.5, z)
        dirt.castShadow = true
        dirt.receiveShadow = true
        worldGroup.add(dirt)

        // Grass top (center block slightly higher)
        const isCenter = x === 0 && z === 0
        const grassHeight = isCenter ? 0.2 : 0
        const grass = new THREE.Mesh(boxGeo, grassMat)
        grass.position.set(x, 0.5 + grassHeight, z)
        grass.castShadow = true
        grass.receiveShadow = true
        worldGroup.add(grass)
      }
    }

    // Add a tree in the center
    const trunkGeo = new THREE.BoxGeometry(0.3, 1, 0.3)
    const trunk = new THREE.Mesh(trunkGeo, woodMat)
    trunk.position.set(0, 1.5, 0)
    trunk.castShadow = true
    worldGroup.add(trunk)

    // Low-poly leaves
    const leavesGeo = new THREE.IcosahedronGeometry(0.7, 0)
    const leaves = new THREE.Mesh(leavesGeo, leafMat)
    leaves.position.set(0, 2.2, 0)
    leaves.castShadow = true
    
    // Randomize vertices slightly for a more organic low-poly look
    const pos = leavesGeo.attributes.position.array as Float32Array
    for(let i=0; i<pos.length; i+=3) {
      pos[i] += (Math.random()-0.5)*0.2
      pos[i+1] += (Math.random()-0.5)*0.2
      pos[i+2] += (Math.random()-0.5)*0.2
    }
    leavesGeo.computeVertexNormals()
    worldGroup.add(leaves)

    // Add a couple of floating clouds
    const clouds = new THREE.Group()
    const cloudGeo = new THREE.IcosahedronGeometry(1, 0)
    for (let i = 0; i < 3; i++) {
      const cloud = new THREE.Mesh(cloudGeo, cloudMat)
      const scale = 0.3 + Math.random() * 0.2
      cloud.scale.set(scale, scale, scale)
      const angle = (i / 3) * Math.PI * 2
      const radius = 2.5
      cloud.position.set(Math.cos(angle) * radius, 1.5 + Math.random(), Math.sin(angle) * radius)
      cloud.castShadow = true
      clouds.add(cloud)
    }
    worldGroup.add(clouds)

    scene.add(worldGroup)

    // Animation Loop
    let raf: number
    const startTime = performance.now()
    
    function animate() {
      raf = requestAnimationFrame(animate)
      const t = (performance.now() - startTime) * 0.001
      
      // Rotate the entire mini world like a loading spinner
      worldGroup.rotation.y = t * 1.2
      
      // Gentle floating bob
      worldGroup.position.y = Math.sin(t * 3) * 0.15
      
      // Rotate clouds slightly
      clouds.rotation.y = -t * 0.5
      clouds.children.forEach((cloud, i) => {
        cloud.position.y += Math.sin(t * 4 + i) * 0.005
      })

      renderer.render(scene, camera)
    }
    animate()

    // Resize
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
      trunkGeo.dispose()
      leavesGeo.dispose()
      cloudGeo.dispose()
      dirtMat.dispose()
      grassMat.dispose()
      woodMat.dispose()
      leafMat.dispose()
      cloudMat.dispose()
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
      <div ref={containerRef} className="h-56 w-56 md:h-64 md:w-64 relative" />
    </motion.div>
  )
}
