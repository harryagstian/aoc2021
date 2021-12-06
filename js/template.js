const { readFromFile, printSolution } = require('./utility')
const flags = require('flags')

const solve = (sample) => {
    const inputs = readFromFile(4, sample)
    printSolution(inputs)
}

flags.defineBoolean("sample", false, "run with sample")
flags.defineBoolean("s", false, "run with sample")
flags.parse()

solve(flags.get("sample") || flags.get("s"))