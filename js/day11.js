const { readFromFile, printSolution } = require('./utility')
const flags = require('flags')

const field = []
let key = new Set()

const solve = (sample) => {
    const inputs = readFromFile(11, sample)
    let flashes = 0
    let dayOfSimultaneousFlash = 0

    for (const line of inputs.split("\n")) {
        let n = line.split("").map(Number)
        field.push(n)
    }

    for (let iter = 0; ; iter++) {
        key = new Set()
        for (let i = 0; i < field.length; i++) {
            for (let j = 0; j < field[0].length; j++) {
                field[i][j]++

                if (field[i][j] > 9 && !key.has(createKey(i, j))) {
                    key.add(createKey(i, j))
                    increaseSurrounding(i, j)
                }
            }
        }

        let currentIterationFlash = 0
        for (let i = 0; i < field.length; i++) {
            for (let j = 0; j < field[0].length; j++) {

                if (field[i][j] > 9) {
                    currentIterationFlash++
                    field[i][j] = 0
                }
            }
        }

        if (currentIterationFlash === (field.length * field[0].length)) {
            dayOfSimultaneousFlash = iter + 1
            break
        }

        if (iter < 100) {
            flashes += currentIterationFlash
        }
    }

    printSolution(flashes)
    printSolution(dayOfSimultaneousFlash)
}

const createKey = (a, b) => {
    return `${a}.${b}`
}

const increaseSurrounding = (a, b) => {
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            if (i === 0 && j === 0) {
                continue
            }

            if (a + i < 0 || b + j < 0 || a + i >= field.length || b + j >= field.length) {
                continue
            }

            field[a + i][b + j]++
            let current = field[a + i][b + j]
            
            if (current > 9 && !key.has(createKey(a + i, b + j))) {
                key.add(createKey(a + i, b + j))
                increaseSurrounding(a + i, b + j)
            }
        }
    }
}

flags.defineBoolean("sample", false, "run with sample")
flags.defineBoolean("s", false, "run with sample")
flags.parse()

solve(flags.get("sample") || flags.get("s"))