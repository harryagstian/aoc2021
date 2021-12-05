const { readFromFile, printSolution } = require('./utility')
const flags = require('flags')

const solve = () => {
    const inputs = readFromFile(4, sample)
    printSolution(inputs)
}

flags.defineBoolean("sample", false, "run with sample")
flags.parse()

solve(flags.get("sample"))