const path = require('path')
const fs = require('fs')

const part = 1

const readFromFile = (day, sample = false) => {
    const filename = `${__dirname}/inputs/day${day}${(sample) ? 'sample' : ''}.txt`
    console.log(`Reading file: ${filename}`)
    let data = fs.readFileSync(filename).toString()

    return data
}

const printSolution = (anystr) => {
    console.log(`Part ${part} solution: ${anystr}`)
}

module.exports = {
    readFromFile,
    printSolution
}