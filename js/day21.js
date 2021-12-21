const { readFromFile, printSolution } = require('./utility')
const flags = require('flags')
const _ = require('lodash')
const assert = require('assert')

const dp = {}

let globalScore = [0, 0]
let maxdepth = 0

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

    // // win = play(playerPosition, playerScore, 0, 3, 0)
    // console.log(dp)
    // console.log(win)
    play2()

    console.log(maxdepth)
}

const play = (playerPosition, playerScore, playing, rollLeft, depth = 0, lastRoll = 0) => {
    let winCount = [0, 0]
    let playerPositionCopy = _.cloneDeep(playerPosition)
    let playerScoreCopy = _.cloneDeep(playerScore)
    let key = createKey(playerPosition, playerScore, playing, lastRoll, rollLeft)
    if (dp[key]) {
        if (playing === 1) {
            console.log(key, dp[key])
        }
        // return dp[key]
    }

    if (rollLeft === 0) {
        playerScoreCopy[playing] += + playerPositionCopy[playing]

        if (playerScoreCopy[playing] >= 5) {
            winCount[playing]++
            console.log({ playerPosition, playerScore, playing, rollLeft, depth, winCount })

        } else {
            sumArray(winCount, play(playerPositionCopy, playerScoreCopy, 1 - playing, 3, depth + 1))
        }

    } else {
        // for (let x = playing; x < 2; x++) {
        for (let i = 1; i <= 3; i++) {
            let p = _.cloneDeep(playerPositionCopy)
            p[playing] = calculatePosition(p[playing] + 1)
            sumArray(winCount, play(p, playerScoreCopy, playing, rollLeft - 1, depth + 1, i))
        }
        // }
    }

    maxdepth = Math.max(depth, maxdepth)
    console.log({ winCount, playing })
    dp[key] = winCount
    return winCount
}

const play2 = () => {
    let baseKey = createKey([4, 8], [0, 0])
    let obj = {
        [baseKey]: 1
    }
    let done = false
    let b = 0
    while (!done) {
        for (let i = 0; i < 2; i++) {
            // for (let pos of playerPosition) {
            obj = diceroll(obj, i, 3)
            // console.log(obj)
            // }

        }
        // return

        if (Object.keys(obj).length === 0) {
            done = true
        }

        b++
    }

    console.log(b, obj, globalScore)
}


const diceroll = (obj, index, turns) => {
    let newObj = _.cloneDeep(obj)
    if (turns === 0) {
        console.log(obj)
        for (let [key, count] of Object.entries(obj)) {
            assert.equal(assert === 0, false)

            let [pos, score] = key.split("|").map(e => e.split(",").map(Number))
            score[index] += pos[index]

            if (score[index] >= 21) {
                globalScore[index] += count
            } else {
                let newKey = createKey(pos, score)
                if (!newObj[newKey]) {
                    newObj[newKey] = 0
                }

                newObj[newKey] += count
            }
            delete newObj[key]
        }
        obj = newObj
    } else {
        // console.log(obj)
        for (let [key, count] of Object.entries(obj)) {
            assert.equal(assert === 0, false)

            let [pos, score] = key.split("|").map(e => e.split(",").map(Number))
            for (let i = 1; i <= 3; i++) {
                // console.log({ key, count, pos, score })
                pos[index] = calculatePosition(pos[index] + i)
                let newKey = createKey(pos, score)

                if (!newObj[newKey]) {
                    newObj[newKey] = 0
                }

                newObj[newKey] += count
            }
            delete newObj[key]

        }
        obj = diceroll(newObj, index, turns - 1)
    }

    return obj
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

// flags.defineBoolean("sample", false, "run with sample")
// flags.defineBoolean("s", false, "run with sample")
// flags.parse()

// solve(flags.get("sample") || flags.get("s"))
solve(true)
// solve(false)
