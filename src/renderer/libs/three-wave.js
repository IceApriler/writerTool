import THREE from './three.min'
class ThreeWave {
  constructor () {
    this.SEPARATION = 100
    this.AMOUNTX = 50
    this.AMOUNTY = 50
    this.container = null
    this.camera = null
    this.scene = null
    this.renderer = null
    this.particles = null
    this.particle = null
    this.count = 0
    this.mouseX = 0
    this.mouseY = 0
    this.windowHalfX = window.innerWidth / 2
    this.windowHalfY = window.innerHeight / 2
    this.dom = null
  }
  init (config) {
    this.extend(this, config, true)
    if (!this.dom || typeof this.dom !== 'object') {
      console.log('error: dom is not a object')
      return
    }
    if (!window.that) {
      window.that = this
    }
    this.start()
    this.animate()
  }
  start () {
    this.container = document.createElement('div')
    this.dom.appendChild(this.container)
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      10000
    )
    this.camera.position.z = 1000

    this.scene = new THREE.Scene()

    this.particles = []

    const PI2 = Math.PI * 2
    const material = new THREE.ParticleCanvasMaterial({
      color: 0x33f9ff,
      program: function (context) {
        context.beginPath()
        context.arc(0, 0, 1, 0, PI2, true)
        context.fill()
      }
    })

    let i = 0

    for (let ix = 0; ix < this.AMOUNTX; ix++) {
      for (let iy = 0; iy < this.AMOUNTY; iy++) {
        this.particle = this.particles[i++] = new THREE.Particle(material)
        this.particle.position.x =
          ix * this.SEPARATION - (this.AMOUNTX * this.SEPARATION) / 2
        this.particle.position.z =
          iy * this.SEPARATION - (this.AMOUNTY * this.SEPARATION) / 2
        this.scene.add(this.particle)
      }
    }

    this.renderer = new THREE.CanvasRenderer()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.container.appendChild(this.renderer.domElement)

    document.addEventListener('mousemove', this.onDocumentMouseMove, false)
    document.addEventListener('touchstart', this.onDocumentTouchStart, false)
    document.addEventListener('touchmove', this.onDocumentTouchMove, false)

    window.addEventListener('resize', this.onWindowResize, false)
  }

  onWindowResize () {
    let that = window.that
    that.windowHalfX = window.innerWidth / 2
    that.windowHalfY = window.innerHeight / 2

    that.camera.aspect = window.innerWidth / window.innerHeight
    that.camera.updateProjectionMatrix()

    that.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  onDocumentMouseMove (event) {
    let that = window.that
    that.mouseX = event.clientX - that.windowHalfX
    that.mouseY = event.clientY - that.windowHalfY
  }

  onDocumentTouchStart (event) {
    let that = window.that
    if (event.touches.length === 1) {
      event.preventDefault()

      that.mouseX = event.touches[0].pageX - that.windowHalfX
      that.mouseY = event.touches[0].pageY - that.windowHalfY
    }
  }

  onDocumentTouchMove (event) {
    let that = window.that
    if (event.touches.length === 1) {
      event.preventDefault()

      that.mouseX = event.touches[0].pageX - that.windowHalfX
      that.mouseY = event.touches[0].pageY - that.windowHalfY
    }
  }

  animate () {
    if (!window.that) return false
    requestAnimationFrame(window.that.animate)
    window.that.render()
  }

  render () {
    this.camera.position.x += (this.mouseX - this.camera.position.x) * 0.05
    this.camera.position.y +=
      (-this.mouseY - this.camera.position.y + 300) * 0.05

    this.camera.lookAt(this.scene.position)

    let i = 0

    for (let ix = 0; ix < this.AMOUNTX; ix++) {
      for (let iy = 0; iy < this.AMOUNTY; iy++) {
        this.particle = this.particles[i++]
        this.particle.position.y =
          Math.sin((ix + this.count) * 0.3) * 50 +
          Math.sin((iy + this.count) * 0.5) * 50
        this.particle.scale.x = this.particle.scale.y =
          (Math.sin((ix + this.count) * 0.3) + 1) * 2 +
          (Math.sin((iy + this.count) * 0.5) + 1) * 2
      }
    }

    this.renderer.render(this.scene, this.camera)

    this.count = Math.round((this.count + 0.1) * 10) / 10
  }
  destroy () {
    window.that = null
    document.removeEventListener('mousemove', this.onDocumentMouseMove, false)
    document.removeEventListener('touchstart', this.onDocumentTouchStart, false)
    document.removeEventListener('touchmove', this.onDocumentTouchMove, false)
    window.removeEventListener('resize', this.onWindowResize, false)
  }
  extend (o, n, override) {
    for (let key in n) {
      if (n.hasOwnProperty(key) && (!o.hasOwnProperty(key) || override)) {
        o[key] = n[key]
      }
    }
    return o
  }
}

export default ThreeWave
