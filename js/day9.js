const { readFromFile, printSolution } = require('./utility')
const flags = require('flags')

const solve = (sample) => {
    const inputs = readFromFile(9, sample)
    const terrains = inputs.split("\n")

    let sumLowGrounds = 0
    for (let i = 0; i < terrains.length; i++) {
        const currentLine = terrains[i]
        for (let j = 0; j < currentLine.length; j++) {
            const value = currentLine[j]
            let passCounts = 0

            if (j - 1 < 0 || currentLine[j - 1] > value) { // left
                passCounts++
            }

            if (j + 1 >= currentLine.length || currentLine[j + 1] > value) { // right
                passCounts++
            }

            if (i - 1 < 0 || terrains[i - 1][j] > value) {
                passCounts++
            }

            if (i + 1 >= terrains.length || terrains[i + 1][j] > value) {
                passCounts++
            }

            if (passCounts === 4) {
                sumLowGrounds += Number(value) + 1
            }
        }
    }

    printSolution(sumLowGrounds)
}

flags.defineBoolean("sample", false, "run with sample")
flags.defineBoolean("s", false, "run with sample")
flags.parse()

solve(flags.get("sample") || flags.get("s"))