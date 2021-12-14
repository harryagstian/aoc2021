const { readFromFile, printSolution } = require('./utility')
const flags = require('flags')
const _ = require('lodash')


const solve = (sample) => {
    let phase = 0
    const inputs = readFromFile(14, sample).split("\n")
    const pairs = {}

    let polymer = []
    let occurence = {}
    for (let line of inputs) {
        if (line === "") {
            phase++
            continue
        }

        if (phase === 0) {
            polymer = line.split("")
        } else {
            const [key, result] = line.split(" -> ")

            pairs[key] = result
        }
    }

    for (let i = 0; i < 10; i++) {
        const newPolymer = []
        const newOccurence = {}
        for (let j = 0; j < polymer.length - 1; j++) {
            const current = polymer[j]
            const next = polymer[j + 1]
            const key = createKey(current, next)

            newPolymer.push(current)
            checkAndAddOccurence(newOccurence, current)

            if (pairs[key]) {
                newPolymer.push(pairs[key])
                checkAndAddOccurence(newOccurence, pairs[key])
            }

        }
        newPolymer.push(polymer[polymer.length - 1])
        checkAndAddOccurence(newOccurence, polymer[polymer.length - 1])
        polymer = newPolymer
        occurence = newOccurence
    }
    const values = _.sortBy(Object.values(occurence))

    printSolution(Math.abs(values[0] - values[values.length - 1]))
}

const checkAndAddOccurence = (obj, v) => {
    if (!obj[v]) {
        obj[v] = 0
    }

    obj[v]++
}

const createKey = (a, b) => {
    return `${a}${b}`
}

flags.defineBoolean("sample", false, "run with sample")
flags.defineBoolean("s", false, "run with sample")
flags.parse()

solve(flags.get("sample") || flags.get("s"))