(async () => {
  const slides = await Promise.all(
    [
      fetch('./slides/slide-1.html'),
      fetch('./slides/slide-2.html'),
      fetch('./slides/slide-3.html'),
      fetch('./slides/slide-4.html'),
      fetch('./slides/slide-5.html'),
      fetch('./slides/slide-6.html'),
    ].map(response => response.then(data => data.text()))
  )

  let slide = 0
  const container = document.querySelector('#slide')
  container.dataset.index = `${slide + 1}`
  container.innerHTML = slides[slide]

  document.querySelector('button#next').addEventListener('click', () => {
    slide = ++slide % slides.length
    container.dataset.index = `${slide + 1}`
    container.innerHTML = slides[slide]
  })

  document.querySelector('button#prev').addEventListener('click', () => {
    slide = --slide < 0 ? slides.length - 1 : slide
    container.dataset.index = `${slide + 1}`
    container.innerHTML = slides[slide]
  })

  const urlParams = new URLSearchParams(window.location.search);

  if (urlParams.has('green')) {
    document.documentElement.classList.add('green');
    dustCache.clear()
  } else if (urlParams.has('cyan')) {
    document.documentElement.classList.add('cyan');
    dustCache.clear()
  }
})()

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
})

const canvas = document.querySelector('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
const context = canvas.getContext('2d')
const objects = []

let objectCount = 60
if (canvas.width < 1000) {
  objectCount = 40
}
if (canvas.width < 600) {
  objectCount = 20
}

for (let i = 0; i < objectCount; i++) {
  const centerX = Math.random() * canvas.width * 1.5
  const centerY = Math.random() * canvas.height

  // Closer objects are bigger, move faster, and blur more due to speed
  const distanceFactor = Math.random(); // 0 = far background, 1 = near foreground
  const scale = distanceFactor * (3 - 0.5) + 0.5
  const blur = 5 - (Math.abs(distanceFactor - 0.7) * 5)
  const vx = -(distanceFactor + 0.2)

  const angle = Math.random() * Math.PI * 2
  const angleSpeed = (Math.random() * (0.03 - 0.01) + 0.01) * (distanceFactor * 0.2)
  const bobAmplitude = 20 * scale

  objects.push({ centerX, centerY, scale, blur, vx, distance: distanceFactor, angle, angleSpeed, bobAmplitude })
}

let giantObjectCount = 3
if (canvas.width < 1000) {
  giantObjectCount = 2
}
if (canvas.width < 600) {
  giantObjectCount = 0
}

for (let i = 0; i < giantObjectCount; i++) {
  objects[i].scale = 20
}

objects.sort((a, b) => a.distance - b.distance)

function animate() {
  context.clearRect(0, 0, canvas.width, canvas.height)
  objects.forEach((obj) => {
    obj.centerX += obj.vx
    obj.angle += obj.angleSpeed

    const currentY = obj.centerY + Math.sin(obj.angle) * obj.bobAmplitude
    const padding = 100 * obj.scale

    if (obj.centerX < -padding) {
      obj.centerX = canvas.width + padding
      obj.centerY = Math.random() * canvas.height
      // Re-randomize starting angle so it behaves like a fresh particle
      obj.angle = Math.random() * Math.PI * 2
    }

    drawDust(context, obj.centerX, currentY, obj.scale, obj.blur)
  })

  requestAnimationFrame(animate)
}

animate()