const { readFromFile, printSolution } = require('./utility')
const flags = require('flags')

const solve = (sample) => {
    let inputs = readFromFile(8, sample)

    inputs = inputs.split("\n")


    let countRight = 0

    inputs.forEach(input => {
        let [left, right] = input.split(" | ")

        right.split(" ").forEach(e => {
            if (e.length === 2 || e.length === 4 || e.length === 3 || e.length === 7) {
                countRight++
            }
        })
        // console.log(right)
    })

    printSolution(countRight)
}

flags.defineBoolean("sample", false, "run with sample")
flags.defineBoolean("s", false, "run with sample")
flags.parse()

solve(flags.get("sample") || flags.get("s"))