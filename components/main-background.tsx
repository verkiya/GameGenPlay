"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export function MainBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    // Soft fog blending into the background gradient
    scene.fog = new THREE.FogExp2(0x0f172a, 0.02)

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100)
    camera.position.set(0, 8, 25)
    camera.lookAt(0, 2, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    
    // Soft shadows
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    container.appendChild(renderer.domElement)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const dirLight = new THREE.DirectionalLight(0xfff0dd, 1.2)
    dirLight.position.set(15, 20, 10)
    dirLight.castShadow = true
    dirLight.shadow.mapSize.width = 1024
    dirLight.shadow.mapSize.height = 1024
    dirLight.shadow.camera.left = -15
    dirLight.shadow.camera.right = 15
    dirLight.shadow.camera.top = 15
    dirLight.shadow.camera.bottom = -15
    scene.add(dirLight)

    const fillLight = new THREE.DirectionalLight(0xaabbff, 0.6)
    fillLight.position.set(-10, 5, -10)
    scene.add(fillLight)

    // The Island Group
    const islandGroup = new THREE.Group()
    scene.add(islandGroup)

    // Materials (flat shading for low-poly look)
    const grassMat = new THREE.MeshStandardMaterial({ color: 0x4ade80, flatShading: true, roughness: 0.9 })
    const dirtMat = new THREE.MeshStandardMaterial({ color: 0x78350f, flatShading: true, roughness: 1.0 })
    const rockMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, flatShading: true, roughness: 0.7 })
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x451a03, flatShading: true, roughness: 1.0 })
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, flatShading: true, roughness: 0.8 })
    const cloudMat = new THREE.MeshStandardMaterial({ color: 0xffffff, flatShading: true, transparent: true, opacity: 0.9 })

    // 1. Base Island Geometry (Dirt Chunk)
    const baseGeo = new THREE.CylinderGeometry(7, 0.5, 8, 12, 4)
    const pos = baseGeo.attributes.position.array as Float32Array
    for (let i = 0; i < pos.length; i += 3) {
      if (pos[i+1] > -3.9) {
        pos[i] += (Math.random() - 0.5) * 1.5
        pos[i+1] += (Math.random() - 0.5) * 0.8
        pos[i+2] += (Math.random() - 0.5) * 1.5
      }
    }
    baseGeo.computeVertexNormals()
    const islandBase = new THREE.Mesh(baseGeo, dirtMat)
    islandBase.position.y = -3.5
    islandBase.castShadow = true
    islandBase.receiveShadow = true
    islandGroup.add(islandBase)

    // 2. Grass Top
    const grassGeo = new THREE.CylinderGeometry(7.2, 6.8, 1.5, 12, 1)
    const gPos = grassGeo.attributes.position.array as Float32Array
    for (let i = 0; i < gPos.length; i += 3) {
        gPos[i] += (Math.random() - 0.5) * 1.2
        gPos[i+1] += (Math.random() - 0.5) * 0.5
        gPos[i+2] += (Math.random() - 0.5) * 1.2
    }
    grassGeo.computeVertexNormals()
    const grassTop = new THREE.Mesh(grassGeo, grassMat)
    grassTop.position.y = 1.0
    grassTop.castShadow = true
    grassTop.receiveShadow = true
    islandGroup.add(grassTop)

    // 3. Rocks
    for(let i=0; i<8; i++) {
        const rockGeo = new THREE.DodecahedronGeometry(Math.random() * 0.8 + 0.3, 0)
        const rock = new THREE.Mesh(rockGeo, rockMat)
        const angle = Math.random() * Math.PI * 2
        const rad = Math.random() * 4 + 2
        rock.position.set(Math.cos(angle)*rad, 1.5 + Math.random()*0.5, Math.sin(angle)*rad)
        rock.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI)
        rock.castShadow = true
        islandGroup.add(rock)
    }

    // 4. Trees
    for(let i=0; i<5; i++) {
        const treeGroup = new THREE.Group()
        
        const trunkGeo = new THREE.CylinderGeometry(0.2, 0.3, 1.5, 5)
        const trunk = new THREE.Mesh(trunkGeo, woodMat)
        trunk.position.y = 0.75
        trunk.castShadow = true
        treeGroup.add(trunk)

        const leavesGeo = new THREE.IcosahedronGeometry(1.2, 0)
        const leavesPos = leavesGeo.attributes.position.array as Float32Array
        for(let j=0; j<leavesPos.length; j+=3) {
            leavesPos[j] += (Math.random()-0.5)*0.4
            leavesPos[j+1] += (Math.random()-0.5)*0.4
            leavesPos[j+2] += (Math.random()-0.5)*0.4
        }
        leavesGeo.computeVertexNormals()
        const leaves = new THREE.Mesh(leavesGeo, leafMat)
        leaves.position.y = 2.2
        leaves.castShadow = true
        treeGroup.add(leaves)

        const angle = Math.random() * Math.PI * 2
        const rad = Math.random() * 3.5 + 1.5
        treeGroup.position.set(Math.cos(angle)*rad, 1.5, Math.sin(angle)*rad)
        
        const scale = Math.random() * 0.6 + 0.6
        treeGroup.scale.set(scale, scale, scale)
        treeGroup.rotation.x = (Math.random() - 0.5) * 0.2
        treeGroup.rotation.z = (Math.random() - 0.5) * 0.2

        islandGroup.add(treeGroup)
    }

    // 5. Floating Dust / Fireflies
    const pGeo = new THREE.BufferGeometry()
    const pCount = 60
    const pArr = new Float32Array(pCount * 3)
    for (let i = 0; i < pCount * 3; i++) {
      pArr[i] = (Math.random() - 0.5) * 30
      pArr[i+1] = (Math.random() - 0.5) * 20 + 5
      pArr[i+2] = (Math.random() - 0.5) * 30
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pArr, 3))
    const pMat = new THREE.PointsMaterial({
      color: 0xfde047, // Glowing yellow
      size: 0.15,
      transparent: true,
      opacity: 0.8
    })
    const dust = new THREE.Points(pGeo, pMat)
    scene.add(dust)

    // 6. Clouds
    const cloudGroup = new THREE.Group()
    scene.add(cloudGroup)
    
    for(let i=0; i<6; i++) {
        const cloud = new THREE.Group()
        const numPuffs = Math.floor(Math.random() * 3) + 3
        for(let p=0; p<numPuffs; p++) {
            const puffGeo = new THREE.IcosahedronGeometry(Math.random() * 1.5 + 1, 0)
            const puff = new THREE.Mesh(puffGeo, cloudMat)
            puff.position.set(
                (Math.random() - 0.5) * 3,
                (Math.random() - 0.5) * 1,
                (Math.random() - 0.5) * 3
            )
            puff.castShadow = true
            cloud.add(puff)
        }
        
        const angle = (i / 6) * Math.PI * 2 + Math.random()
        const rad = Math.random() * 6 + 12
        cloud.position.set(
            Math.cos(angle) * rad,
            Math.random() * 4 + 4,
            Math.sin(angle) * rad
        )
        cloudGroup.add(cloud)
    }

    // Animation Loop
    let raf: number
    const clock = new THREE.Clock()

    function animate() {
      raf = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()
      
      // Gently bob the entire island up and down
      islandGroup.position.y = Math.sin(t * 0.8) * 0.6
      // Slowly rotate the island
      islandGroup.rotation.y = t * 0.05
      
      // Rotate clouds in opposite direction
      cloudGroup.rotation.y = -t * 0.03
      cloudGroup.position.y = Math.sin(t * 0.5) * 0.5

      // Twinkle and drift the dust
      dust.rotation.y = t * 0.04
      dust.position.y = Math.sin(t * 0.3) * 1.5

      renderer.render(scene, camera)
    }
    animate()

    // Resize Handler
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
      pGeo.dispose()
      grassMat.dispose()
      dirtMat.dispose()
      cloudMat.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div 
      ref={containerRef} 
      className="pointer-events-none fixed inset-0 z-0" 
      style={{ background: "radial-gradient(circle at top, #1e293b 0%, #020617 100%)" }}
    />
  )
}
