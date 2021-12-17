const { readFromFile, printSolution } = require('./utility')
const flags = require('flags')
const _ = require('lodash')

const solve = (sample) => {
    // no, i am not even sure what the hell did i wrote.
    let inputs = readFromFile(17, sample)
    inputs = inputs.split("x=").pop().split(", y=")
    let [minX, maxX] = _.sortBy(inputs[0].split("..").map(Number))
    let [minY, maxY] = _.sortBy(inputs[1].split("..").map(e => { return Math.abs(Number(e)) }))

    // physics magick. for x = 0, velocity is same - the only difference is direction. 
    // need to offset by 1 otherwise it will skip the boundary zone due to how gravity + steps calculated in the problem
    printSolution(getMaxSum(maxY - 1))

    /**
     * possible: {
     *   x: {
     *     6: Set(5) // in 6 steps, initial velocity of 5 will be inside the boundary
     *   }
     * }
     */

    let possible = {
        x: {},
        y: {}
    }

    // possible xs
    for (let step = 1; step <= maxX; step++) {
        let c = step
        let sum = 0
        let iter = 0
        while (c > 0) {
            sum += c
            iter++
            c--

            if (isInBound(sum, minX, maxX)) {
                if (c === 0) {
                    objectAdder(possible.x, "Infinity", step)
                } else {
                    objectAdder(possible.x, iter, step)
                }
            }
        }
    }

    // possible ys 
    for (let i = 0; i <= maxY; i++) {
        let sum = 0
        for (let j = 1; j <= maxY; j++) {
            sum += i + (j - 1)
            if (isInBound(sum, minY, maxY)) {
                // negative ys
                let temp = i * -1
                objectAdder(possible.y, j, temp)

                // positive ys - basically just negative y with double steps and 1 offset

                if (isInBound(i, 1, maxY - 1)) {
                    const finalstep = (i * 2) + j
                    objectAdder(possible.y, finalstep, i)
                }

            }
        }
    }

    let pairs = new Set()
    for (let ykey of Object.keys(possible.y)) {
        if (possible.x[ykey]) {
            for (let x of possible.x[ykey]) {
                for (let y of possible.y[ykey]) {
                    pairs.add(createKey(x, y)) // these values has specific steps, otherwise it will miss the boundary
                }
            }
        } else {
            for (let x of possible.x.Infinity) {
                for (let y of possible.y[ykey]) {
                    pairs.add(createKey(x, y)) // xs in these values ends up as 0, it just need to wait for y to hit the boundary
                }
            }
        }
    }

    printSolution(pairs.size)
}

const objectAdder = (obj, key, value) => {
    if (!obj[key]) {
        obj[key] = new Set()
    }
    obj[key].add(value)
}


const createKey = (x, y) => `${x},${y}`

const isInBound = (c, min, max) => {
    c = Math.abs(c)
    min = Math.abs(min)
    max = Math.abs(max)
    // console.log({ c, min, max, left: min <= c, right: c <= max })
    return min <= c && c <= max
}

const getMaxSum = (value) => { // not sure what to call this function
    return (value * (value + 1)) / 2
}

flags.defineBoolean("sample", false, "run with sample")
flags.defineBoolean("s", false, "run with sample")
flags.parse()

solve(flags.get("sample") || flags.get("s"))