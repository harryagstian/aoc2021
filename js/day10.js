const { readFromFile, printSolution } = require('./utility')
const flags = require('flags')
const _ = require('lodash')

const pairs = {
    "<": ">",
    "{": "}",
    "(": ")",
    "[": "]",
}

const right = new Set(Object.values(pairs))
const left = new Set(Object.keys(pairs))

const solve = (sample) => {
    const inputs = readFromFile(10, sample).split("\n")
    let sum = 0
    let allPoints = []

    for (line of inputs) {
        let expectedMatch = []
        let firstIllegalCharacter = true
        for (let i = 0; i < line.length; i++) {
            let current = line[i]

            if (left.has(current)) { // if current is left hand side char, add to expected match array
                expectedMatch.push(pairs[current])
            } else if (right.has(current)) { // if current is right hand side char
                if (expectedMatch[expectedMatch.length - 1] === current) { // check if current right hand side char is last item of expected
                    expectedMatch.pop()
                } else if (firstIllegalCharacter) { // if not then its an illegal chara, count the value if its the first illegal chara
                    // illegal
                    firstIllegalCharacter = false
                    switch (current) {
                        case ")":
                            sum += 3
                            break;
                        case "]":
                            sum += 57
                            break;
                        case "}":
                            sum += 1197
                            break;
                        case ">":
                            sum += 25137
                            break;

                        default:
                            throw new Error("Should be unreachable")
                    }
                }
            }
        }

        if (firstIllegalCharacter) { // if there is no illegal chara, means line is incomplete
            expectedMatch.reverse()
            let totalPoint = 0
            for (let c of expectedMatch) {
                let basePoint = 0

                switch (c) {
                    case ")":
                        basePoint = 1
                        break;
                    case "]":
                        basePoint = 2
                        break;
                    case "}":
                        basePoint = 3
                        break;
                    case ">":
                        basePoint = 4
                        break;

                    default:
                        throw new Error("Should be unreachable")
                }
                totalPoint = (totalPoint * 5) + basePoint
            }

            allPoints.push(totalPoint)
        }
    }

    allPoints = _.sortBy(allPoints)
    printSolution(sum)
    printSolution(allPoints[Math.floor(allPoints.length / 2)])
}

flags.defineBoolean("sample", false, "run with sample")
flags.defineBoolean("s", false, "run with sample")
flags.parse()

solve(flags.get("sample") || flags.get("s"))