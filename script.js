let board = []
let gameStarted = false
let time = 0
let interval
let hasWon = false 
let hasDied = false
let totalSquares = 0
let revealed = 0

const BEGINNER = {
  size: 9,
  bombs: 10
}
const MEDIUM = {
  size: 16,
  bombs: 40  
}
const EXPERT = {
  size: 22,
  bombs: 100
}
const MASTER = {
  size: 30,
  bombs: 250
}

document.getElementById("start-game").onclick = function() {
  gameStarted = false
  hasWon = false
  hasDied = false
  revealed = 0
  time = 0
  document.getElementById("timer").innerHTML = "0"
  clearInterval(interval)
  
  let gameBoard = document.getElementById("game-board")
  gameBoard.innerHTML = ""
  
  let diff = document.getElementById("difficulty").value
  let size, bombs
  
  switch(diff) {
    case "beginner":
      size = BEGINNER.size
      bombs = BEGINNER.bombs
      break
    case "intermediate": 
      size = MEDIUM.size
      bombs = MEDIUM.bombs
      break
    case "expert":
      size = EXPERT.size
      bombs = EXPERT.bombs  
      break
    case "master":
      size = MASTER.size
      bombs = MASTER.bombs
      break
  }
  
  totalSquares = size * size
  
  // On fait la grille rapidement
  gameBoard.style.gridTemplateColumns = "repeat(" + size + ", 40px)"
  gameBoard.style.maxWidth = (size * 40) + "px"
  gameBoard.style.margin = "0 auto"
  
  board = Array(size).fill().map(() => Array(size).fill(0))
  
  let bombsPlaced = 0
  while(bombsPlaced < bombs) {
    let x = Math.floor(Math.random() * size)
    let y = Math.floor(Math.random() * size) 
    if(board[x][y] != "💣") {
      board[x][y] = "💣"
      bombsPlaced++
    }
  }
  
  for(let i = 0; i < size; i++) {
    for(let j = 0; j < size; j++) {
      if(board[i][j] != "💣") {
        let count = 0
        for(let x = -1; x <= 1; x++) {
          for(let y = -1; y <= 1; y++) {
            if(i+x >= 0 && i+x < size && j+y >= 0 && j+y < size) {
              if(board[i+x][j+y] == "💣") count++
            }
          }
        }
        board[i][j] = count
      }
    }
  }
  
  for(let i = 0; i < size; i++) {
    for(let j = 0; j < size; j++) {
      let btn = document.createElement("button")
      btn.className = "w-10 h-10 bg-gray-300 hover:bg-gray-400 rounded flex items-center justify-center font-bold"
      
      btn.onclick = function() {
        if(!gameStarted) {
          startTimer()
          gameStarted = true
        }
        if(!hasDied && !hasWon) clickCase(i, j, btn)
      }
      
      btn.oncontextmenu = function(e) {
        e.preventDefault()
        if(!hasDied && !hasWon) {
          if(btn.innerHTML == "🚩") {
            btn.innerHTML = ""
          } else {
            btn.innerHTML = "🚩"
          }
        }
      }
      
      gameBoard.appendChild(btn)
    }
  }
}

function clickCase(x, y, btn) {
  if(btn.innerHTML == "🚩") return
  
  if(board[x][y] == "💣") {
    showAllBombs()
    document.getElementById("status").innerHTML = "Perdu !"
    document.getElementById("status").style.color = "red"
    hasDied = true
    clearInterval(interval)
    return
  }
  
  revealCase(x, y)
  
  if(revealed == totalSquares - countBombs()) {
    document.getElementById("status").innerHTML = "Gagné !"
    document.getElementById("status").style.color = "green"
    hasWon = true
    clearInterval(interval)
  }
}

function revealCase(x, y) {
  let btn = document.getElementById("game-board").children[x * board.length + y]
  if(btn.style.backgroundColor == "rgb(243, 244, 246)") return
  
  revealed++
  btn.style.backgroundColor = "rgb(243, 244, 246)"
  if(board[x][y] > 0) {
    btn.innerHTML = board[x][y]
  } else {
    for(let i = -1; i <= 1; i++) {
      for(let j = -1; j <= 1; j++) {
        if(x+i >= 0 && x+i < board.length && y+j >= 0 && y+j < board.length) {
          revealCase(x+i, y+j)
        }
      }
    }
  }
}

function countBombs() {
  let count = 0
  for(let row of board) {
    for(let cell of row) {
      if(cell == "💣") count++
    }
  }
  return count
}

function showAllBombs() {
  for(let i = 0; i < board.length; i++) {
    for(let j = 0; j < board.length; j++) {
      if(board[i][j] == "💣") {
        let btn = document.getElementById("game-board").children[i * board.length + j]
        btn.innerHTML = "💣"
        btn.style.backgroundColor = "rgb(252, 165, 165)"
      }
    }
  }
}

function startTimer() {
  interval = setInterval(function() {
    time++
    document.getElementById("timer").innerHTML = time
  }, 1000)
}