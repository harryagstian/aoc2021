const { readFromFile, printSolution } = require('./utility')
const flags = require('flags')

const boardSize = 5
let drawnNumber = []
let boards = []
let board = []
let winCondition = []

const createWinCondition = () => {
    for (let x = 0; x < boards.length; x++) {
        const board = boards[x]
        let d1 = new Set() // diagonal 1
        let d2 = new Set() // diagonal 2

        for (let i = 0; i < boardSize; i++) {
            let h = new Set() // horizontal
            let v = new Set() // vertical
            for (let j = 0; j < boardSize; j++) {
                h.add(board[j][i])
                v.add(board[i][j])
            }
            winCondition.push({ set: v, board: x })
            winCondition.push({ set: h, board: x })
            d1.add(board[i][i])
            d2.add(board[boardSize - i - 1][i])
        }

        winCondition.push({ set: d1, board: x })
        winCondition.push({ set: d2, board: x })
    }
}

const findFirstWinningBoard = () => {
    let win = false
    let winningBoard = 0
    let lastDrawnNumber = 0
    for (let i = 0; i < drawnNumber.length; i++) {
        const currentNumber = drawnNumber[i]

        for (let j = 0; j < winCondition.length; j++) {
            const currentSet = winCondition[j].set

            currentSet.delete(currentNumber)

            if (currentSet.size === 0) {
                win = true
                lastDrawnNumber = currentNumber
                winningBoard = winCondition[j].board
                break
            }
        }
        if (win) {
            break
        }
    }
    return { winningBoard, lastDrawnNumber }
}

const findLastWinningBoard = () => {
    let win = false
    let lastWinningBoard = 0
    let wonBoards = new Set()
    let lastDrawnNumber = 0
    let target = boards.length
    for (let i = 0; i < drawnNumber.length; i++) {
        const currentNumber = drawnNumber[i]

        for (let j = 0; j < winCondition.length; j++) {

            const currentSet = winCondition[j].set
            const currentBoard = winCondition[j].board
            if (wonBoards.has(currentBoard)) {
                continue
            }

            currentSet.delete(currentNumber)

            if (currentSet.size === 0) {
                wonBoards.add(currentBoard)
            }

            if (wonBoards.size === target) {
                win = true
                lastDrawnNumber = currentNumber
                lastWinningBoard = currentBoard
                break
            }
        }

        if (win) {
            break
        }
    }
    return { lastWinningBoard, lastDrawnNumber }
}

const findSolution = (winningBoard, lastDrawnNumber) => {
    let flatBoardValue = new Set()
    for (line of boards[winningBoard]) {
        for (e of line) {
            flatBoardValue.add(e)
        }
    }

    for (e of drawnNumber) {
        flatBoardValue.delete(e)
        if (e === lastDrawnNumber) {
            break
        }
    }

    let solution = [...flatBoardValue].reduce((sum, e) => {
        return sum + e
    }, 0)
    return solution * lastDrawnNumber
}

const solve = (sample = true) => {
    const inputs = readFromFile(4, sample)
    let iter = 0

    // parse input to boards
    for (line of inputs.split("\n")) {
        if (line.length === 0) {
            iter++
            if (board.length > 0) {
                boards.push(board)
                board = []
            }
            continue
        }

        if (iter === 0) {
            drawnNumber = line.split(",").map(e => Number(e))
        } else {
            const currentBoardLine = []
            line.split(" ").forEach(e => {
                if (e.length !== 0) {
                    currentBoardLine.push(Number(e))
                }
            })
            board.push(currentBoardLine)
        }
    }
    boards.push(board)

    // create win conditions
    createWinCondition()

    // run through drawnNumber to find winning board
    let { winningBoard, lastDrawnNumber } = findFirstWinningBoard()

    // find the solution
    let solution = findSolution(winningBoard, lastDrawnNumber)

    printSolution(solution)

    // part 2
    createWinCondition()
    let { lastWinningBoard, lastDrawnNumber: l2 } = findLastWinningBoard()
    solution = findSolution(lastWinningBoard, l2)

    printSolution(solution)
}

flags.defineBoolean("sample", false, "run with sample")
flags.parse()

solve(flags.get("sample"))