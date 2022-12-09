document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const scoreDisplay = document.querySelector('#score')
    const startButton = document.querySelector('#start-button')
    const width = 10
    let nextRandom = 0
    let timerId

    const lTetromino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1,width*2],
        [width, width*2, width*2+1, width*2+2]
    ]

    const zTetromino = [
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1],
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1]
    ]

    const tTetromino = [
        [1,width,width+1,width+2],
        [1,width+1,width+2,width*2+1],
        [width,width+1,width+2,width*2+1],
        [1,width,width+1,width*2+1]
    ]

    const oTetromino = [
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1]
    ]

    const iTetromino = [
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3],
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3]
    ]

    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

    let currentRotation = 0
    let random = Math.floor(Math.random()*theTetrominoes.length)
    let current = theTetrominoes[random][currentRotation]
    let currentPosition = 4

    //draw the first rotation in the first tetromino
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino')
        })
    }

    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino')
        })
    }

    function control(e) {
        if(e.keyCode === 37 || e.keyCode === 65){
            moveLeft()
        } else if(e.keyCode === 38 || e.keyCode === 87){
            rotate()
        }
        else if(e.keyCode === 39 || e.keyCode === 68){
            moveRight()
        }
        else if(e.keyCode === 40 || e.keyCode === 83){
            moveDown()
        }
    }
    document.addEventListener('keyup', control)

    function moveDown(){
        undraw()
        currentPosition += width
        draw()
        freeze()
    }

    function freeze() {
        if(current.some(index => squares[currentPosition + index +width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            random = nextRandom
            nextRandom = Math.floor(Math.random()*theTetrominoes.length)
            current = theTetrominoes[random][currentRotation]
            currentPosition = 4
            draw()
            displayShape()
        }
    }

    function moveLeft() {
        undraw()
        const isAtLeftEdge = current.some(index => (currentPosition + index)%width === 0)
        if(!isAtLeftEdge) currentPosition -= 1
        if(current.some(index => squares[currentPosition+index].classList.contains('taken'))){
            currentPosition +=1
        }
        draw()
    }

    function moveRight() {
        undraw()
        const isAtRightEdge = current.some(index => (currentPosition + index)%width === width-1)
        if(!isAtRightEdge) currentPosition += 1
        if(current.some(index => squares[currentPosition+index].classList.contains('taken'))){
            currentPosition -=1
        }
        draw()
    }

    function rotate(){
        undraw()
        currentRotation++
        if(currentRotation === current.length) {
            currentRotation = 0
        }
        current = theTetrominoes[random][currentRotation]
        draw()
    }

    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    let displayIndex = 5

    const upNextTetrominoes = [
        [1, displayWidth+1, displayWidth*2+1, 2],
        [0,displayWidth,displayWidth+1,displayWidth*2+1],
        [1,displayWidth,displayWidth+1,displayWidth+2],
        [0,1,displayWidth,displayWidth+1],
        [1,displayWidth+1,displayWidth*2+1,displayWidth*3+1]
    ]

    function displayShape() {
        displaySquares.forEach(square => {
            square.classList.remove('tetromino')
        })
        upNextTetrominoes[nextRandom].forEach(index =>
            displaySquares[displayIndex+index].classList.add('tetromino'))
    }

    startButton.addEventListener('click', () =>{
        if(timerId){
            clearInterval(timerId)
            timerId = null
        } else {
            draw()
            timerId = setInterval(moveDown, 300)
            nextRandom = Math.floor(Math.random()*theTetrominoes.length)
            displayShape()
        }

    })
})
