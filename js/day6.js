const { readFromFile, printSolution } = require('./utility')
const flags = require('flags')

const solve = (sample) => {
    const inputs = readFromFile(6, sample)

    let arr = inputs.split(",").map(Number)
    console.log(arr)
    for (let i = 0; i < 256; i++) {
        const len = arr.length
        for (let j = 0; j < len; j++) {
            let current = arr[j] - 1

            if (current < 0) {
                arr.push(8)
                current = 6
            }
            arr[j] = current
        }
    }

    printSolution(arr.length)
}

flags.defineBoolean("sample", false, "run with sample")
flags.defineBoolean("s", false, "run with sample")
flags.parse()

solve(flags.get("sample") || flags.get("s"))