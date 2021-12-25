const { readFromFile, printSolution } = require('./utility')
const flags = require('flags')
const _ = require('lodash')
const solve = (sample) => {
    const inputs = readFromFile(25, sample).split("\n")

    let map = {
        right: {},
        down: {}
    }
    const maxX = inputs[0].length
    const maxY = inputs.length
    for (let y = 0; y < maxY; y++) {
        for (let x = 0; x < maxX; x++) {
            let c = inputs[y][x]
            let direction = ""
            let key = createKey(x, y)
            if (c === "v") {
                direction = "down"
            } else if (c === ">") {
                direction = "right"
            } else {
                continue
            }

            map[direction][key] = true
        }
    }

    let done = true
    let iter = 0
    while (true) {
        done = true
        iter++

        let copy = _.cloneDeep(map)
        for (let key of Object.keys(map.right)) {
            let [x, y] = splitKey(key)
            x++
            if (x + 1 > maxX) {
                x = 0
            }

            let newKey = createKey(x, y)
            if (map.right[newKey] === undefined && map.down[newKey] === undefined) {
                copy.right[newKey] = true
                delete copy.right[key]
                done = false
            }
        }

        map = copy
        copy = _.cloneDeep(map)

        for (let key of Object.keys(map.down)) {
            let [x, y] = splitKey(key)
            y++
            if (y + 1 > maxY) {
                y = 0
            }

            let newKey = createKey(x, y)
            if (map.right[newKey] === undefined && map.down[newKey] === undefined) {
                copy.down[newKey] = true
                delete copy.down[key]
                done = false
            }
        }
        map = copy

        if (done) {
            break
        }
    }
    printMap(map, maxX, maxY)
    printSolution(iter)
}

let printMap = (map, maxX, maxY) => {
    let str = ""
    for (let y = 0; y < maxY; y++) {
        for (let x = 0; x < maxX; x++) {
            let key = createKey(x, y)
            if (map.right[key]) {
                str += ">"
            } else if (map.down[key]) {
                str += "v"
            } else {
                str += "."
            }
        }

        str += "\n"
    }

    console.log(str)
}

let createKey = (...rest) => rest.join("|")

let splitKey = (key) => key.split("|")

flags.defineBoolean("sample", false, "run with sample")
flags.defineBoolean("s", false, "run with sample")
flags.parse()

solve(flags.get("sample") || flags.get("s"))