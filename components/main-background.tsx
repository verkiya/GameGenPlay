"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export function MainBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    // A slightly darker fog so it blends cleanly in the distance
    scene.fog = new THREE.FogExp2(0x000000, 0.002)

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 1

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // Stars
    const starGeo = new THREE.BufferGeometry()
    const starCount = 5000
    const posArr = new Float32Array(starCount * 3)
    const colorArr = new Float32Array(starCount * 3)

    const colors = [
      new THREE.Color(0xef4444), // red
      new THREE.Color(0x3b82f6), // blue
      new THREE.Color(0x8b5cf6), // purple
      new THREE.Color(0x10b981), // green
      new THREE.Color(0xffffff), // white
      new THREE.Color(0xaaaaaa), // grey
    ]

    for (let i = 0; i < starCount * 3; i += 3) {
      // Spread them in a large tunnel/box around the camera
      posArr[i] = (Math.random() - 0.5) * 800
      posArr[i + 1] = (Math.random() - 0.5) * 800
      posArr[i + 2] = (Math.random() - 0.5) * 800

      // Random color
      const c = colors[Math.floor(Math.random() * colors.length)]
      colorArr[i] = c.r
      colorArr[i + 1] = c.g
      colorArr[i + 2] = c.b
    }

    starGeo.setAttribute("position", new THREE.BufferAttribute(posArr, 3))
    starGeo.setAttribute("color", new THREE.BufferAttribute(colorArr, 3))

    const starMat = new THREE.PointsMaterial({
      size: 1.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
    })

    const stars = new THREE.Points(starGeo, starMat)
    scene.add(stars)

    // Gamified floating elements
    const elementsGroup = new THREE.Group()
    scene.add(elementsGroup)

    const geometries = [
      new THREE.IcosahedronGeometry(1.5, 0),
      new THREE.TorusGeometry(1, 0.4, 8, 12),
      new THREE.OctahedronGeometry(1.5, 0),
      new THREE.BoxGeometry(1.5, 1.5, 1.5),
      new THREE.TetrahedronGeometry(1.5, 0),
      new THREE.TorusKnotGeometry(1, 0.3, 32, 8)
    ]
    
    const floatingMeshes: { mesh: THREE.Mesh, speedZ: number, rotSpeed: THREE.Vector3 }[] = []
    
    // Add 25 glowing game-engine shapes floating through the warp tunnel
    for (let i = 0; i < 25; i++) {
      const geo = geometries[Math.floor(Math.random() * geometries.length)]
      const color = colors[Math.floor(Math.random() * colors.length)]
      
      const mat = new THREE.MeshStandardMaterial({
        color: color,
        wireframe: true,
        transparent: true,
        opacity: 0.3, // Subtle so it doesn't distract
        emissive: color,
        emissiveIntensity: 0.5
      })
      
      const mesh = new THREE.Mesh(geo, mat)
      
      mesh.position.x = (Math.random() - 0.5) * 120
      mesh.position.y = (Math.random() - 0.5) * 80
      mesh.position.z = (Math.random() - 0.5) * 600 - 100
      
      const rotSpeed = new THREE.Vector3(
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02
      )
      
      elementsGroup.add(mesh)
      floatingMeshes.push({ mesh, speedZ: Math.random() * 0.4 + 0.3, rotSpeed })
    }

    // A subtle colored ambient light to give a very faint glow to the scene if we added meshes
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2)
    scene.add(ambientLight)

    // Animation
    let raf: number
    const clock = new THREE.Clock()

    function animate() {
      raf = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()
      
      const positions = starGeo.attributes.position.array as Float32Array
      // We'll move them towards the camera on the Z axis
      for (let i = 2; i < starCount * 3; i += 3) {
        positions[i] += 0.8 // speed of warp
        if (positions[i] > 200) {
          positions[i] = -600 // Wrap back
        }
      }
      starGeo.attributes.position.needsUpdate = true
      
      // Animate the game shapes
      for (const item of floatingMeshes) {
        item.mesh.position.z += item.speedZ
        item.mesh.rotation.x += item.rotSpeed.x
        item.mesh.rotation.y += item.rotSpeed.y
        item.mesh.rotation.z += item.rotSpeed.z
        
        // Loop back when they pass the camera
        if (item.mesh.position.z > 20) {
          item.mesh.position.z = -500
          item.mesh.position.x = (Math.random() - 0.5) * 120
          item.mesh.position.y = (Math.random() - 0.5) * 80
        }
      }

      // Slow rotation of the whole starfield
      stars.rotation.z = t * 0.02
      stars.rotation.x = Math.sin(t * 0.1) * 0.1
      stars.rotation.y = Math.cos(t * 0.1) * 0.1
      
      // Counter-rotate the elements slightly for depth
      elementsGroup.rotation.z = -t * 0.01

      renderer.render(scene, camera)
    }
    animate()

    // Resize
    function handleResize() {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", handleResize)
      renderer.dispose()
      starGeo.dispose()
      starMat.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return <div ref={containerRef} className="pointer-events-none fixed inset-0 z-0 opacity-50" />
}
