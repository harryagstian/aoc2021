const { readFromFile, printSolution } = require('./utility')
const flags = require('flags')
const _ = require('lodash')

const solve = (sample) => {
    let inputs = readFromFile(8, sample)

    inputs = inputs.split("\n")
    let countRight = 0

    let arr = inputs.map(input => {
        return input.split(" | ")
    })

    arr.forEach(items => {
        const right = items[1]

        right.split(" ").forEach(e => {
            if (e.length === 2 || e.length === 4 || e.length === 3 || e.length === 7) {
                countRight++
            }
        })
    })
    printSolution(countRight)

    let finalSolution = 0
    arr.forEach(items => {
        const [left, right] = items

        const obj = {}

        deduceKnownNumber(left, obj)
        deduceUncertain(left, obj, 5)
        deduceUncertain(left, obj, 6)

        let output = ""
        let dictionary = Object.values(obj).map(v => { // convert set object to array of string
            return _.sortBy([...v]).join("")
        })

        right.split(" ").forEach(value => {
            output += deduceOutput(dictionary, value) // calculate output of each line
        })

        finalSolution += Number(output)
    })

    printSolution(finalSolution)
}

const deduceKnownNumber = (line, obj) => {
    // decude 1, 4, 7, 8
    for (const v of line.split(" ")) {
        let deducedNumber = -1

        switch (v.length) {
            case 2:
                deducedNumber = 1
                break;
            case 4:
                deducedNumber = 4
                break;
            case 3:
                deducedNumber = 7
                break;
            case 7:
                deducedNumber = 8
                break;
            default:
                break;
        }

        if (deducedNumber !== -1) {
            obj[deducedNumber] = new Set(v)
        }
    }

}

const deduceUncertain = (line, obj, segment) => {
    for (const v of line.split(" ")) {
        if (v.length === segment) {
            const key = substractWithKnownNumber(v, obj, segment)

            obj[key] = new Set(v)
        }
    }
}


const substractWithKnownNumber = (value, obj, segment) => {
    // 5 segments - 2, 3, 5
    // 2: -1 from 1, -2 from 4, -1 from 7   [-1, -2, -1] = -4
    // 3: 0 from 1, -1 from 4, 0 from 7     [ 0, -1,  0] = -1
    // 5: -1 from 1, -1 from 4, -1 from 7   [-1, -1, -1] = -3
    
    // 6 segments - 0, 6, 9
    // 0: 0 from 1, -1 from 4, 0 from 7     [ 0, -1,  0] = -1
    // 6: -1 from 1, -1 from 4, -1 from 7   [-1, -1, -1] = -3
    // 9: 0 from 1, 0 from 4, 0 from 7      [ 0,  0,  0] =  0

    value = new Set(value)
    const iteration = [1, 4, 7]
    let diff = 0
    let realNumber = 0
    iteration.forEach(key => {
        obj[key].forEach(e => {
            if (!value.has(e)) {
                diff--
            }
        })

    })

    switch (diff) {
        case -4:
            realNumber = 2
            break;
        case -1:
            realNumber = (segment === 5) ? 3 : 0
            break;
        case -3:
            realNumber = (segment === 5) ? 5 : 6
            break;
        case 0:
            realNumber = 9
            break;
        default:
            console.error(diff)
            throw new Error("not possible")
    }

    return realNumber
}

const deduceOutput = (dictionary, value) => {
    value = _.sortBy(value).join("")

        
    return String(dictionary.findIndex(e => e === value))
}

flags.defineBoolean("sample", false, "run with sample")
flags.defineBoolean("s", false, "run with sample")
flags.parse()

solve(flags.get("sample") || flags.get("s"))