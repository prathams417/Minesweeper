document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    let width = 10
    let squares = []
    let flags = 0
    var numMines = 15
    var x = 0
    let isGameOver = false
    var sec = 0
    var min = 0
    var time = 0
    var scoreBoard = 0
    var highscores = [0]
    isFirstClick = true
    firstScore = true

    function createBoard() {
        flags = 0

        document.getElementById('submit').addEventListener('click', function(e) { setNumMines() })
        document.getElementById('flagsRemain').innerText = ('You have ' + (numMines - flags) + ' flags remaining')

        //Doesn't function by simply using numMines
        var mineArray = Array((100 - (width * width - numMines))).fill('mine')

        const emptyArray = Array(width * width - numMines).fill('valid')
        const gameArray = emptyArray.concat(mineArray)
        const shuffledArray = gameArray.sort(() => Math.random() - 0.5)

        document.getElementById('time').innerText = '0:00'

        document.getElementById('restart').addEventListener('click', function(e) {
            resetBoard()
        })

        for (let i = 0; i < width * width; i++) {
            const square = document.createElement('div')
            square.setAttribute('id', i)

            square.classList.add(shuffledArray[i])

            grid.appendChild(square)
            squares.push(square)

            square.addEventListener('click', function(e) {
                click(square)
            })

            square.oncontextmenu = function(e) {
                e.preventDefault()
                addFlag(square)
            }
        }


        for (let i = 0; i < squares.length; i++) {
            let total = 0
            if (squares[i].classList.contains('valid')) {
                for (let y = Math.floor(i / width - 1); y < Math.floor(i / width + 2); y++) {
                    for (let x = (i % width - 1); x < (i % width + 2); x++) {
                        if (x + (y * width) >= 0 && x + (y * width) < squares.length && x + (y * width) != i) {
                            if (x >= 0 && x < width) {
                                placeholder = x + (y * width)
                                if (squares[placeholder].classList.contains('mine')) {
                                    total++
                                }
                            }
                        }
                    }
                }
                squares[i].setAttribute('data', total)
            }
        }
    }


    createBoard()


    function myTimer() {
        sec += 1
        if (sec == 60) {
            min += 1
            sec = 0
        }
        if (isFirstClick) {
            return
        }
        document.getElementById('time').innerHTML = (min + ':' + String(sec).padStart(2, '0'))
    }

    function resetBoard() {
        for (let i = 0; i < squares.length; i++) {
            squares[i].style.backgroundColor = 'LightGrey'
            squares[i].innerHTML = ''
            squares[i].classList.remove('flag')
            squares[i].classList.remove('mine')
            squares[i].classList.remove('checked')
            squares[i].remove()
        }
        sec = 0
        min = 0
        isFirstClick = true
        isGameOver = false
        clearInterval(time)
        createBoard()
    }

    function addFlag(square) {
        if (isGameOver) return
        if (!square.classList.contains('checked') && (flags < numMines)) {
            if (!square.classList.contains('flag')) {
                square.classList.add('flag')
                square.innerHTML = ' 🚩'
                flags++
                document.getElementById('flagsRemain').innerText = ('You have ' + (numMines - flags) + ' flags remaining')
                checkForWin()
            } else {
                square.classList.remove('flag')
                square.innerHTML = ''
                flags--
                document.getElementById('flagsRemain').innerText = ('You have ' + (numMines - flags) + ' flags remaining')
            }
        }
    }

    function click(square) {
        let currentId = square.id
        if (isGameOver) return

        if (square.classList.contains('checked') || square.classList.contains('flag')) return

        if (isFirstClick) {
            time = setInterval(myTimer, 1000)
            isFirstClick = false
        }
        if (square.classList.contains('mine')) {
            gameOver(square)
        } else {
            let total = square.getAttribute('data')
            if (total != 0) {
                square.classList.add('checked')
                if (total == 1) {
                    square.classList.add('one')
                }
                if (total == 2) {
                    square.classList.add('two')
                }
                if (total >= 3) {
                    square.classList.add('three')
                }
                square.innerHTML = total
                return
            }
            checkSquare(square, currentId)
        }
        square.classList.add('checked')
    }

    function checkSquare(square, currentId) {
        const isLeftEdge = (currentId % width === 0)
        const isRightEdge = (currentId % width === width - 1)

        setTimeout(() => {
            if (currentId > 0 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) - 1].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (currentId > 9 && !isRightEdge) {
                const newId = squares[parseInt(currentId) + 1 - width].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }

            if (currentId > 10) {
                const newId = squares[parseInt(currentId) - width].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }

            if (currentId > 11 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) - 1 - width].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }

            if (currentId < 99 && !isRightEdge) {
                const newId = squares[parseInt(currentId) + 1].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }

            if (currentId < 90 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) - 1 + width].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }

            if (currentId <= 88 && !isRightEdge) {
                const newId = squares[parseInt(currentId) + 1 + width].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }

            if (currentId <= 89) {
                const newId = squares[parseInt(currentId) + width].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }

        }, 10)
    }

    function gameOver(square) {
        squares.forEach(square => {
            if (square.classList.contains('mine')) {
                square.classList.add('checked')
                square.innerHTML = '💣'
            }
        })
        document.getElementById('flagsRemain').innerText = "You revealed a mine! You Lose!"
        isGameOver = true
        sec = 0
        min = 0
        flags = 0
        clearInterval(time)
    }

    function checkForWin() {
        let matches = 0
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].classList.contains('flag') && squares[i].classList.contains('mine')) {
                matches++
            }
            if (matches == numMines) {
                var totalTime = 60 * min + sec
                insertScore(totalTime)
                clearInterval(time)
                isGameOver = true
                document.getElementById('flagsRemain').innerText = "You found all the mines! You Win!"
                printScoreBoard()
                break
            }
        }
    }

    function insertScore(totalTime) {

        if (highscores.length < 10) {
            if (firstScore) {
                highscores[0] = totalTime
                firstScore = false
            } else {
                highscores.push(totalTime)
                highscores.sort(function(a, b) { return a - b })
                console.log(highscores.length)
            }
        }
    }

    function printScoreBoard() {
        document.getElementById('score').innerHTML = ''
        for (let i = 0; i < highscores.length; i++) {
            document.getElementById('score').innerText += ((i + 1) + '. ' + (Math.floor((highscores[i] / 60)) + ':' + String(highscores[i] % 60).padStart(2, '0')) + '\n')
        }
    }

    function setNumMines() {
        x = document.getElementById('numMines').value
        numMines = x
    }

})