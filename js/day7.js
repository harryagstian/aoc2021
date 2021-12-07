const { readFromFile, printSolution } = require('./utility')
const flags = require('flags')

const memo = {}

const calculateIncreasingFuel = (n) => {
    if (memo[n]) {
        return memo[n]
    }

    if (n <= 1) {
        return n
    } else {
        const s = n + calculateIncreasingFuel(n - 1)
        memo[n] = s
        return s
    }
}

const solve = (sample) => {
    let inputs = readFromFile(7, sample)
    const inputSets = {}

    inputs.split(",").forEach(e => {
        e = Number(e)
        if (!inputSets[e]) {
            inputSets[e] = 0
        }
        inputSets[e]++
    })

    printSolution(totalFuel(inputSets, 1))
    printSolution(totalFuel(inputSets, 2))
}

const totalFuel = (inputSets, part) => {
    const len = Object.values(inputSets).length
    let smallest = 0
    for (let i = 0; i < len; i++) {
        let sum = 0
        for ([k, v] of Object.entries(inputSets)) {
            let distance = Math.abs(k - i)

            if (part === 2) {
                distance = calculateIncreasingFuel(distance)
            }
            sum += distance * v
        }

        if (smallest === 0 || sum < smallest) {
            smallest = sum
        }
    }
    return smallest
}

flags.defineBoolean("sample", false, "run with sample")
flags.defineBoolean("s", false, "run with sample")
flags.parse()

solve(flags.get("sample") || flags.get("s"))