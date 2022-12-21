document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const scoreDisplay = document.querySelector('#score')
    const startButton = document.querySelector('#start-button')
    const width = 10
    let nextRandom = 0
    let timerId
    let score = 0
    const sound = document.getElementById('sound')
    const soundButton = document.getElementById('soundButton')
    let soundFlag = 0
    let isFirstSoundPlay = true;

    document.getElementById('rulesButton').addEventListener('click', () => {
        document.querySelector('.popup-back').style.display = "flex"
    })
    
    document.getElementById('buttonPopUpClose').addEventListener('click', () => {
        document.querySelector('.popup-back').style.display = "none"
    })

    const color = [
        'brown',
        'crimson',
        'chartreuse',
        'forestgreen',
        'teal'
    ]

    const classBlockList = [
        'url(images/picture.jpg)',
        'url(images/chess.jpg)',
        'url(images/.jpg)',
        'url(images/pizza.jpg)',
        'url(images/clock.jpg)'
    ]

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
            
            // squares[currentPosition + index].classList.add('block')
            // squares[currentPosition + index].style.backgroundImage = classBlockList[random]
            squares[currentPosition + index].classList.add('tetromino')
            squares[currentPosition + index].style.backgroundColor = color[random]
        })
    }

    function undraw() {
        current.forEach(index => {
            // squares[currentPosition + index].classList.remove('block')
            // squares[currentPosition + index].style.backgroundImage = 'none'
            squares[currentPosition + index].classList.remove('tetromino')
            squares[currentPosition + index].style.backgroundColor = ''
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
            addScore()
            gameOver()
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

    function isAtRight() {
        return current.some(index=> (currentPosition + index + 1) % width === 0)  
      }
      
      function isAtLeft() {
        return current.some(index=> (currentPosition + index) % width === 0)
      }
      
      function checkRotatedPosition(P){
        P = P || currentPosition      
        if ((P+1) % width < 4) {
          if (isAtRight()){
            currentPosition += 1
            checkRotatedPosition(P) 
            }
        }
        else if (P % width > 5) {
          if (isAtLeft()){
            currentPosition -= 1
          checkRotatedPosition(P)
          }
        }
      }

    function rotate(){
        undraw()
        currentRotation++
        if(currentRotation === current.length) {
            currentRotation = 0
        }
        current = theTetrominoes[random][currentRotation]
        checkRotatedPosition()
        draw()
    }

    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    let displayIndex = 1

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
            square.style.backgroundColor = ''
        })
        upNextTetrominoes[nextRandom].forEach(index => {
            displaySquares[displayIndex+index].classList.add('tetromino')
            displaySquares[displayIndex+index].style.backgroundColor = color[nextRandom]
        })
    }

    startButton.addEventListener('click', () =>{
        if(timerId){
            clearInterval(timerId)
            timerId = null
            startButton.innerHTML = 'play'
        } else {
            draw()
            timerId = setInterval(moveDown, 300)
            nextRandom = Math.floor(Math.random()*theTetrominoes.length)
            displayShape()
            startButton.innerHTML = 'pause'
        }
        if(soundFlag == 0 && isFirstSoundPlay){
            playPause()
            isFirstSoundPlay = false
        }
    })


    function addScore() {
        for(let i = 0; i < 199; i += width){
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

            if(row.every(index => squares[index].classList.contains('taken'))){
                score += 10
                scoreDisplay.innerHTML= score
                row.forEach(index => {
                    // squares[index].classList.remove('block')
                    squares[index].classList.remove('tetromino')
                    squares[index].classList.remove('taken')
                    //squares[currentPosition + index].style.backgroundImage = 'none'
                    squares[index].style.backgroundColor = ''
                })
                const squaresRemoved = squares.splice(i, width)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
    }

    function gameOver() {
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            scoreDisplay.innerHTML = 'end'
            clearInterval(timerId)
            document.removeEventListener('keyup', control)
        }
    }

    function playPause() {
        if(soundFlag == 0){
            soundFlag = 1
            sound.play()
            soundButton.style.backgroundImage = "url('images/on.jpg')"}
            else{
                soundFlag = 0
                sound.pause()
                soundButton.style.backgroundImage = "url('images/off.jpg')"
            }
        }
    soundButton.addEventListener('click', playPause)

})