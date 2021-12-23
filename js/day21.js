const { readFromFile, printSolution } = require('./utility')
const flags = require('flags')
const _ = require('lodash')

const dp = {}

const solve = (sample) => {
    const inputs = readFromFile(21, sample).split("\n")
    let basePlayerPosition = []
    let playerPosition = []
    let playerScore = [0, 0]
    for (let line of inputs) {
        playerPosition.push(Number(line.split(": ").pop()))
    }

    basePlayerPosition = _.cloneDeep(playerPosition)

    // part 1
    let done = false
    let currentDie = 1
    let diceRollCount = 0
    while (!done) {
        for (let i = 0; i < playerPosition.length; i++) {
            let moves = (currentDie * 3) + 3
            diceRollCount += 3
            currentDie += 3

            playerPosition[i] += moves
            playerPosition[i] = calculatePosition(playerPosition[i])

            playerScore[i] += playerPosition[i]

            if (playerScore[i] >= 1000) {
                done = true
                break
            }
        }
    }

    printSolution(playerScore.filter(e => e < 1000).shift() * diceRollCount)

    // part 2
    let win = play(basePlayerPosition, [0,0])
    printSolution(Math.max(...win))
}

const play = (playerPosition, playerScore, player = 0, depth = 0) => {
    let win = [0, 0]

    let key = createKey(playerPosition, playerScore, player)
    if (dp[key]) {
        return dp[key]
    }

    for (let i = 1; i <= 3; i++) {
        for (let j = 1; j <= 3; j++) {
            for (let k = 1; k <= 3; k++) {
                let s = i + j + k
                let cpos = _.cloneDeep(playerPosition)
                let cscore = _.cloneDeep(playerScore)
                cpos[player] = calculatePosition(cpos[player] + s)
                cscore[player] += cpos[player]

                if (cscore[player] >= 21) {
                    win[player]++
                    continue 
                }
                sumArray(win, play(cpos, cscore, 1 - player, depth + 1)) // switch turns to next player
            }
        }
    }

    dp[key] = win
    return win
}


const sumArray = (arr1, arr2) => {
    for (let i = 0; i < arr1.length; i++) {
        arr1[i] += arr2[i]
    }
}

const calculatePosition = (current) => {
    if (current % 10 === 0) {
        return 10
    }

    return current % 10
}

const createKey = (...rest) => rest.join("|")

flags.defineBoolean("sample", false, "run with sample")
flags.defineBoolean("s", false, "run with sample")
flags.parse()

solve(flags.get("sample") || flags.get("s"))