const { readFromFile, printSolution } = require('./utility')
const flags = require('flags')
const assert = require('assert')

let coordinates = {}

const solve = (sample) => {
    const inputs = readFromFile(5, sample)
    for (line of inputs.split("\n")) {
        let value = line.split(" -> ")
        findPassedCoordinate(value[0], value[1])
    }

    printSolution(countOverlap())

    coordinates = {}
    for (line of inputs.split("\n")) {
        let value = line.split(" -> ")
        findPassedCoordinate(value[0], value[1], true)
    }
    printSolution(countOverlap())
}

const findPassedCoordinate = (start, end, secondPart = false) => {
    start = start.split(',').map(Number)
    end = end.split(',').map(Number)

    if (start[0] !== end[0] && start[1] !== end[1] && !secondPart) {
        return
    } else if (start[0] !== end[0] && start[1] !== end[1] && secondPart) {
        assert.equal(Math.abs(start[0] - end[0]) === Math.abs(start[1] - end[1]), true)

        while (start[0] !== end[0] && start[1] !== end[1]) {
            checkAndAddCoordinate(`${start[0]},${start[1]}`)
            if (start[0] > end[0]) {
                start[0]--
            }else{
                start[0]++
            }
            
            if (start[1] > end[1]) {
                start[1]--
            }else{
                start[1]++
            }
        }
        checkAndAddCoordinate(`${start[0]},${start[1]}`)
    } else if (start[0] !== end[0]) {
        let a = Math.min(start[0], end[0])
        let b = Math.max(start[0], end[0])
        for (let i = a; i <= b; i++) {
            checkAndAddCoordinate(`${i},${start[1]}`)
        }
    } else if (start[1] !== end[1]) {
        let a = Math.min(start[1], end[1])
        let b = Math.max(start[1], end[1])
        for (let i = a; i <= b; i++) {
            checkAndAddCoordinate(`${start[0]},${i}`)
        }
    }
}

const countOverlap = () => {
    // count overlap
    let overlap = 0
    for (v of Object.values(coordinates)) {
        if (v > 1) {
            overlap++
        }
    }

    return overlap
}

const checkAndAddCoordinate = (str) => {
    if (!coordinates[str]) {
        coordinates[str] = 1
    } else {
        coordinates[str]++
    }
}

flags.defineBoolean("sample", false, "run with sample")
flags.parse()

solve(flags.get("sample"))