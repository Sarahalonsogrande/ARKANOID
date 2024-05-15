const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

const $sprite = document.querySelector('#sprite')
const $bricks = document.querySelector('#bricks')

canvas.width = 448
canvas.height = 400

const PADDLE_SENSITIVITY = 6

// VARIABLES DEL JUEGO
let counter = 0

// VARIABLES DE LA PELOTA
const ballRadius = 3
// Posición de la pelota
let x = canvas.width / 2
let y = canvas.height - 30
// Velocidad de la pelota
let dx = -2
let dy = -2

// VARIABLES DE LA PALETA
const paddleWidth = 50
const paddleHeight = 10
// Posición de la paleta
let paddleX = (canvas.width -paddleWidth) / 2
let paddleY = canvas.height - paddleHeight - 10

let rightPressed = false
let leftPressed = false

// VARIABLES DE LOS LADRILLOS
const brickRowCount = 6
const brickColumnCount = 13
const brickWidth = 32
const brickHeight = 16
const brickPadding = 0
const brickOffsetTop = 88
const brickOffsetLeft = 16
const bricks = []

const BRICK_STATUS = {
  ACTIVE: 1,
  DESTROYED: 0
}

for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [] // Inicializamos con un array vacío
  for (let r = 0; r < brickRowCount; r++) {
    // Calculamos la posición del ladrillo en la pantalla
    const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft
    const brickY = r * (brickHeight + brickPadding) + brickOffsetTop
    // Asignar un color aleatorio a cada ladrillo
    //Del 0 al 7
    const random = Math.floor(Math.random() * 8)
    // Guardamos la información de cada ladrillo
    bricks[c][r] = {
      x: brickX, 
      y: brickY, 
      status: BRICK_STATUS.ACTIVE, 
      color: random
    }
  }
}

function drawBall() { 

  ctx.beginPath()
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2)
  ctx.fillStyle = '#fff'
  ctx.fill()
  ctx.closePath()

}

function drawPaddle() { 

  // ctx.fillStyle = 'red'
  // ctx.fillRect(
  //   paddleX, // Coordenada X
  //   paddleY, // Coordenada Y
  //   paddleWidth, // Ancho de la Base
  //   paddleHeight // Alto de la base
  // )

  ctx.drawImage(
    $sprite, // Imagen
    29, // CipX: Coordenadas de recorte
    174, // CipY: Coordenadas de recorte
    paddleWidth, // Tamano del recorte
    paddleHeight, // Tamano del recorte
    paddleX, //Posición X del dibujo
    paddleY, //Posición Y del dibujo
    paddleWidth, // Ancho del dibujo
    paddleHeight // Alto del dibujo
  )

} 

function initEvents() { 

  document.addEventListener('keydown', keyDownHandler)
  document.addEventListener('keyup', keyUpHandler)

  function keyDownHandler (event) {

    const { key } = event
    if (key === 'Right' || key === 'ArrowRight') {
      rightPressed = true
    } else if (key === 'Left' || key === 'ArrowLeft') {
      leftPressed = true
    }

  }

  function keyUpHandler (event) {

    const { key } = event
    if (key === 'Right' || key === 'ArrowRight') {
      rightPressed = false
    } else if (key === 'Left' || key === 'ArrowLeft') {
      leftPressed = false
    }
  }

}

function drawBricks() { 
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const currentBrick = bricks[c][r]
      if (currentBrick.status === BRICK_STATUS.DESTROYED)
      continue

      // ctx.fillStyle = '#f39'
      // ctx.rect(
      //   currentBrick.x,
      //   currentBrick.y,
      //   brickWidth,
      //   brickHeight
      // )
      // ctx.fill()
      // ctx.stroke()
      // ctx.strokeStyle = '#fff'

      const clipX = currentBrick.color * 32

      ctx.drawImage(
        $bricks,
        clipX,
        0,
        brickWidth,
        brickHeight,
        currentBrick.x,
        currentBrick.y,
        brickWidth,
        brickHeight
      )

    }
  }
}

function collisionDetection() { 
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const currentBrick = bricks[c][r]
      if (currentBrick.status === BRICK_STATUS.DESTROYED)
      continue

      const isBallSameXAsBrick =
        x > currentBrick.x &&
        x < currentBrick.x + brickWidth

      const isBallSameYAsBrick =
        y > currentBrick.y &&
        y < currentBrick.y + brickHeight

      if (isBallSameXAsBrick && isBallSameYAsBrick) {
        dy =-dy
        currentBrick.status = BRICK_STATUS.DESTROYED
      }
    }
  }
}

function ballMovement() {

  // La pelota rebota en los laterales
  if (
    x + dx > canvas.width - ballRadius || // Pared derecha
    x + dx < ballRadius // Pared izquierda
  ) {
  dx = -dx
  }

  // La pelota rebota en la parte de arriba
  if (y + dy < ballRadius) {
    dy = -dy
  }

  // La pelota toca la pala
  const isBallSameXAsPaddle = 
    x > paddleX &&
    x < paddleX + paddleWidth

  const isBallTouchingPaddle =
    y + dy > paddleY

  if (isBallSameXAsPaddle && isBallTouchingPaddle) {
    dy = -dy // Cambiamos la dirección de la pelota
  }

  // La pelota toca el suelo
  else if (y + dy > canvas.height - ballRadius) {
      console.log('Game Over')
  }

  // Movemos la pelota
  x += dx
  y += dy

}

function paddleMovement() { 
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += PADDLE_SENSITIVITY
  } else if (leftPressed && paddleX > 0) {
    paddleX -= PADDLE_SENSITIVITY
  }
}

function cleanCanvas() { 
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function draw () {
  cleanCanvas()
  // Dibujamos los elementos
  drawBall()
  drawPaddle()
  drawBricks()

  // Definimos las colisiones y movimientos
  collisionDetection()
  ballMovement()
  paddleMovement()

  window.requestAnimationFrame(draw)
}

draw()
initEvents()
