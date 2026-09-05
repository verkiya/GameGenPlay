"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export function ThreeLoader() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 100)
    camera.position.z = 4

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.2))
    
    const pointLight = new THREE.PointLight(0xef4444, 4, 10)
    pointLight.position.set(2, 2, 2)
    scene.add(pointLight)

    const pointLight2 = new THREE.PointLight(0x3b82f6, 4, 10)
    pointLight2.position.set(-2, -2, 2)
    scene.add(pointLight2)

    // Geometry
    const group = new THREE.Group()
    
    // Outer wireframe
    const geo = new THREE.IcosahedronGeometry(1, 1)
    const mat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      metalness: 0.8,
      roughness: 0.2,
      wireframe: true,
      transparent: true,
      opacity: 0.6,
      emissive: 0xef4444,
      emissiveIntensity: 0.5
    })
    const mesh = new THREE.Mesh(geo, mat)
    group.add(mesh)
    
    // Inner glowing core
    const innerGeo = new THREE.IcosahedronGeometry(0.5, 0)
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xef4444,
      emissiveIntensity: 2,
      transparent: true,
      opacity: 0.9
    })
    const innerMesh = new THREE.Mesh(innerGeo, innerMat)
    group.add(innerMesh)

    // Particles
    const pGeo = new THREE.BufferGeometry()
    const pCount = 50
    const pArr = new Float32Array(pCount * 3)
    for (let i = 0; i < pCount * 3; i++) {
      pArr[i] = (Math.random() - 0.5) * 4
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pArr, 3))
    const pMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.05,
      transparent: true,
      opacity: 0.5
    })
    const particles = new THREE.Points(pGeo, pMat)
    group.add(particles)

    scene.add(group)

    // Animation
    let raf: number
    const clock = new THREE.Clock()
    
    function animate() {
      raf = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()
      
      group.rotation.x = t * 0.5
      group.rotation.y = t * 0.7
      mesh.rotation.z = -t * 0.2
      
      // Floating effect
      group.position.y = Math.sin(t * 2) * 0.1
      
      particles.rotation.y = t * -0.3
      particles.rotation.x = t * 0.2
      
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
      geo.dispose()
      mat.dispose()
      innerGeo.dispose()
      innerMat.dispose()
      pGeo.dispose()
      pMat.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return <div ref={containerRef} className="h-48 w-48" />
}
