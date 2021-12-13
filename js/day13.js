const { readFromFile, printSolution } = require('./utility')
const flags = require('flags')

const paper = {}

// 0,0 -> top left
// x -> to the right
// y -> to the bottom

const solve = (sample) => {
    let phase = 0
    let part1 = 0
    const inputs = readFromFile(13, sample).split("\n")

    for (line of inputs) {
        if (line === "") {
            phase++
            continue
        }

        if (phase === 0) {
            const [x, y] = line.split(',')
            const key = createKey(x, y)

            paper[key] = true
        } else if (phase > 0) {
            const [rest, coord] = line.split("=")
            const direction = rest[rest.length - 1]

            if (direction === "y") {
                for (const key of Object.keys(paper)) {
                    const [x, y] = splitKey(key)

                    if (y > Number(coord)) {
                        const newX = x
                        const newY = coord - (y - coord)
                        const newKey = createKey(newX, newY)
                        delete paper[key]
                        paper[newKey] = true
                    }
                }
            } else {
                for (const key of Object.keys(paper)) {
                    const [x, y] = splitKey(key)

                    if (x > Number(coord)) {
                        const newX = coord - (x - coord)
                        const newY = y
                        const newKey = createKey(newX, newY)
                        delete paper[key]
                        paper[newKey] = true
                    }
                }
            }
            if (phase === 1) {
                part1 = Object.keys(paper).length
                phase++
            }
        }
    }

    printSolution(part1)

    // draw the paper

    let maxX = 0
    let maxY = 0

    for (const key of Object.keys(paper)) {
        let [x, y] = splitKey(key)

        if (x > maxX) {
            maxX = x
        }

        if (y > maxY) {
            maxY = y
        }
    }

    maxX++
    maxY++

    let arr = "\n"
    for (let y = 0; y < maxY; y++) {
        let inner = []
        for (let x = 0; x < maxX; x++) {
            const key = createKey(x, y)
            let value = " "
            if (paper[key]) {
                value = "X"
            }
            inner.push(value)
        }
        arr += inner.join("")
        arr += "\n"
    }

    printSolution(arr)
}

const createKey = (x, y) => {
    return `${x}.${y}`
}

const splitKey = (key) => {
    return key.split('.').map(Number)
}

flags.defineBoolean("sample", false, "run with sample")
flags.defineBoolean("s", false, "run with sample")
flags.parse()

solve(flags.get("sample") || flags.get("s"))