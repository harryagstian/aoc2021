const { readFromFile, printSolution } = require('./utility')
const flags = require('flags')
const _ = require('lodash')


const solve = (sample) => {
    let phase = 0
    const inputs = readFromFile(14, sample).split("\n")
    const pairs = {}

    let polymer = {}
    const occurence = {}

    for (let line of inputs) {
        if (line === "") {
            phase++
            continue
        }

        if (phase === 0) {
            for (let i = 0; i < line.length - 1; i++) {
                const current = line[i]
                const next = line[i + 1]
                const key = createKey(current, next)

                checkAndAddOccurence(polymer, key, 1)
                checkAndAddOccurence(occurence, current, 1)
            }

            checkAndAddOccurence(occurence, line[line.length - 1], 1)
        } else {
            const [key, result] = line.split(" -> ")

            pairs[key] = result
        }
    }

    for (let i = 0; i < 40; i++) {
        let newPolymer = {}

        for (let [k, v] of Object.entries(polymer)) {
            let derivative = pairs[k]

            if (!derivative) {
                continue
            }

            let new1 = `${k[0]}${derivative}`
            let new2 = `${derivative}${k[1]}`

            checkAndAddOccurence(newPolymer, new1, v)
            checkAndAddOccurence(newPolymer, new2, v)

            checkAndAddOccurence(occurence, derivative, v) // we only need to keep track how many of each atom (?) exist. when new derivative atom is created, just +1 to the counter. thanks reddit (/r/adventofcode/comments/rg2odo/) for the enlightment
        }

        polymer = newPolymer

        if (i === 9) {
            const values = _.sortBy(Object.values(occurence))

            printSolution(Math.abs(values[0] - values[values.length - 1]))
        }
    }

    const values = _.sortBy(Object.values(occurence))

    printSolution(Math.abs(values[0] - values[values.length - 1]))
}

const checkAndAddOccurence = (obj, k, v = 1) => {
    if (!obj[k]) {
        obj[k] = 0
    }

    obj[k] += v
}

const createKey = (a, b) => {
    return `${a}${b}`
}

flags.defineBoolean("sample", false, "run with sample")
flags.defineBoolean("s", false, "run with sample")
flags.parse()

solve(flags.get("sample") || flags.get("s"))