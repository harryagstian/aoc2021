const { readFromFile, printSolution } = require('./utility')
const flags = require('flags')
const _ = require('lodash')

const dp = {}

let win = [0, 0]

const solve = (sample) => {
    const inputs = readFromFile(21, sample).split("\n")
    let basePlayerPosition = []
    let playerPosition = []
    let playerScore = [0, 0]
    for (let line of inputs) {
        playerPosition.push(Number(line.split(": ").pop()))
    }

    basePlayerPosition = _.cloneDeep(playerPosition)

    let done = false
    let currentDie = 1
    let diceRollCount = 0
    // while (!done) {
    //     for (let i = 0; i < playerPosition.length; i++) {
    //         let moves = (currentDie * 3) + 3
    //         diceRollCount += 3
    //         currentDie += 3

    //         playerPosition[i] += moves
    //         playerPosition[i] = calculatePosition(playerPosition[i])

    //         playerScore[i] += playerPosition[i]

    //         if (playerScore[i] >= 1000) {
    //             done = true
    //             break
    //         }
    //     }
    // }

    // printSolution(playerScore.filter(e => e < 1000).shift() * diceRollCount)

    playerPosition = basePlayerPosition
    playerScore = [0, 0]

    play(playerPosition, playerScore)
    console.log(win)
    console.log(dp)
}

const play = (playerPosition, playerScore) => {
    console.log({playerPosition, playerScore})
    let playerPositionCopy = _.cloneDeep(playerPosition)
    let playerScoreCopy = _.cloneDeep(playerScore)
    let key = createKey(playerPosition, playerScore)
    if (dp[key]) {
        win[dp[key]]++
        return
    }

    for (let i = 0; i < 2; i++) {
        if (playerScore[i] >= 21) {
            console.log(playerScore[i])
            win[i]++
            dp[key] = i
            win[i]++
            return
        }

        for (let j = 0; j < 3; j++) {
            playerPositionCopy[i] = calculatePosition(playerPositionCopy[i] + 1)
            playerScoreCopy[i] = playerScore[i] + playerPositionCopy[i]
            play(playerPositionCopy, playerScoreCopy)
        }
    }
}

const calculatePosition = (current) => {
    if (current % 10 === 0) {
        return 10
    }

    return current % 10
}

const createKey = (...rest) => rest.join(".")

// flags.defineBoolean("sample", false, "run with sample")
// flags.defineBoolean("s", false, "run with sample")
// flags.parse()

// solve(flags.get("sample") || flags.get("s"))
// solve(true)
solve(false)
