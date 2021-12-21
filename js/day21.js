const { readFromFile, printSolution } = require('./utility')
const flags = require('flags')

const solve = (sample) => {
    const inputs = readFromFile(21, sample).split("\n")
    let playerPosition = []
    let playerScore = []
    for (let line of inputs) {
        playerPosition.push(Number(line.split(": ").pop()))
        playerScore.push(0)
    }

    let done = false
    let currentDie = 1
    let diceRollCount = 0
    while (!done) {
        for (let i = 0; i < playerPosition.length; i++) {
            let moves = (currentDie * 3) + 3
            diceRollCount += 3
            currentDie += 3

            playerPosition[i] += moves

            if (playerPosition[i] % 10 === 0) {
                playerPosition[i] = 10
            } else {
                playerPosition[i] %= 10
            }

            if (playerPosition[i] === 0) {
                playerPosition[i]++
            }


            playerScore[i] += playerPosition[i]

            if (playerScore[i] >= 1000) {
                done = true
                break
            }
        }
    }

    printSolution(playerScore.filter(e => e < 1000).shift() * diceRollCount)
}

flags.defineBoolean("sample", false, "run with sample")
flags.defineBoolean("s", false, "run with sample")
flags.parse()

solve(flags.get("sample") || flags.get("s"))
