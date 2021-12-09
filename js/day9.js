const { readFromFile, printSolution } = require('./utility')
const flags = require('flags')
const _ = require('lodash')

let checking = new Set()
let currentBasinSize = new Set()
let allBasinSize = []

// pretty ugly not gonna lie
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
                // is a basin / lowest point
                checking = new Set()
                currentBasinSize = new Set()
                checkSurrounding(terrains, i, j)
                allBasinSize.push(currentBasinSize.size)
            }
        }
    }

    printSolution(sumLowGrounds)

    let part2 = 1
    allBasinSize = _.chain(allBasinSize).sortBy().reverse().value()
    for (let i = 0; i < 3; i++) {
        part2 *= allBasinSize[i]
    }

    printSolution(part2)
}

const checkSurrounding = (array2d, x, y) => {
    const key = `${x}.${y}`
    if (checking.has(key)) { // ensure that no multiple check of one coordinates
        return 0
    }

    checking.add(key)

    // check bounding
    // left
    if (x < 0) {
        return 0
    }

    // right
    if (x >= array2d.length) {
        return 0
    }

    // top
    if (y < 0) {
        return 0
    }

    // bottom 
    if (y >= array2d[0].length) { // ???
        return 0
    }

    const value = array2d[x][y]

    if (value == 9) {
        return 0
    }

    currentBasinSize.add(`${key}.${value}`)

    // check neighbour
    checkSurrounding(array2d, x + 1, y)
    checkSurrounding(array2d, x - 1, y)
    checkSurrounding(array2d, x, y + 1)
    checkSurrounding(array2d, x, y - 1)
}


flags.defineBoolean("sample", false, "run with sample")
flags.defineBoolean("s", false, "run with sample")
flags.parse()

solve(flags.get("sample") || flags.get("s"))