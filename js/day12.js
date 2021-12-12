const { readFromFile, printSolution } = require('./utility')
const flags = require('flags')
const _ = require('lodash')

const globalMap = {}
let solutions = []

const solve = (sample) => {
    const inputs = readFromFile(12, sample)

    for (line of inputs.split("\n")) {
        let [start, destination] = line.split("-")

        // start should always be on left
        // end should always be on right
        // everything else must be added as source and destination

        if (start === "end" || destination === "start") {
            [start, destination] = [destination, start]
        }

        if (start !== "start" && destination !== "end") {
            if (!globalMap[destination]) {
                globalMap[destination] = new Set()
            }
            globalMap[destination].add(start)
        }

        if (!globalMap[start]) {
            globalMap[start] = new Set()
        }
        globalMap[start].add(destination)
    }

    traverse("start", [], false)
    printSolution(solutions.length)

    solutions = []

    traverse("start", [], true)
    printSolution(solutions.length)
}


const traverse = (start, traveled, canVisitTwice) => {
    if (start === "end") {
        solutions.push(traveled.join(","))
        return
    }

    if (start === "start") {
        traveled.push(start)
    }

    for (const destination of globalMap[start]) {
        let cc = canVisitTwice
        let t = _.cloneDeep(traveled)
        if (t.includes(destination) && /[a-z]/.test(destination) && !["start", "end"].includes(destination)) {
            if (cc) {
                // visit a small cave twice for the first time
                cc = false
            } else {
                continue
            }
        }
        
        t.push(destination)
        traverse(destination, t, cc)
    }
}

flags.defineBoolean("sample", false, "run with sample")
flags.defineBoolean("s", false, "run with sample")
flags.parse()

solve(flags.get("sample") || flags.get("s"))