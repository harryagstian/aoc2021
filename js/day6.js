const { readFromFile, printSolution } = require('./utility')
const flags = require('flags')

const solve = (sample) => {
    let inputs = readFromFile(6, sample)
    
    printSolution(iterateOver(inputs, 80))
    printSolution(iterateOver(inputs, 256))
}

const iterateOver = (inputs, day) => {
    const maxDay = 9
    let arr = Array(maxDay).fill(0)

    for (const v of inputs.split(",").map(Number)) {
        arr[v]++
    }

    for (let i = 0; i < day; i++) {
        let newArr = []

        for (j = 1; j < maxDay; j++) {
            newArr.push(arr[j])
        }

        newArr.push(arr[0])
        newArr[6] += arr[0]
        arr = newArr
    }

    const solution = arr.reduce((prev, curr) => {
        return prev + curr
    }, 0)

    return solution
}

flags.defineBoolean("sample", false, "run with sample")
flags.defineBoolean("s", false, "run with sample")
flags.parse()

solve(flags.get("sample") || flags.get("s"))