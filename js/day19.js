const { readFromFile, printSolution } = require('./utility')
const flags = require('flags')
const assert = require('assert')
require("util").inspect.defaultOptions.depth = null;
const _ = require('lodash')

/*
    resources
    https://matrixcalc.org/en/#%7B%7B0,0,1%7D,%7B0,1,0%7D,%7B-1,0,0%7D%7D*%7B%7B200%7D,%7B-300%7D,%7B3400%7D%7D
    https://www.engineeringtoolbox.com/distance-relationship-between-two-points-d_1854.html
    
*/

// https://stackoverflow.com/questions/21741246/valid-solution-for-javascript-sin-and-cos
Number.prototype.rounded = function (i) {
    i = Math.pow(10, i || 15);
    // default
    return Math.round(this * i) / i;
}


const solve = (sample) => {
    const inputs = readFromFile(19, sample).split("\n")

    let scanners = {}
    let beacons = {}
    let scannerId = 0
    let beaconCount = 0
    for (let line of inputs) {
        if (line === "") {
            // console.log(scanners)
            // console.log(getDifferences2(scanners[scannerId]))
            scannerId++
            beaconCount = 0
            continue
        } else if (line.includes("scanner")) {
            scanners[scannerId] = {}
        } else {
            scanners[scannerId][beaconCount] = line.split(",").map(Number)
            beaconCount++
        }
    }

    for (let key of Object.keys(scanners)) {
        getDifferences(scanners, key, beacons)
    }

    let possibleMatch = {}
    for (let [key, values] of Object.entries(beacons)) {
        if (values.size > 1) {
            let arr = [...values]
            for (let i = 0; i < arr.length; i++) {
                let item = arr[i] // scannerId.beacondId1.beacondId2
                scannerId = item.split(".").shift()

                for (let j = 0; j < arr.length; j++) {
                    if (i === j) {
                        continue
                    }
                    let s2 = arr[j].split(".").shift()

                    if (!possibleMatch[scannerId]) {
                        possibleMatch[scannerId] = {}
                    }

                    if (!possibleMatch[scannerId][s2]) {
                        possibleMatch[scannerId][s2] = 0
                    }

                    possibleMatch[scannerId][s2]++
                }
            }

            // console.log({ key, arr })
        }
    }

    console.log({possibleMatch})
    let fixed = new Set() // these scanners should not be rotated

    // try 0 and 1 first

    let candidates = getCandidates(scanners, beacons)
    // console.log(candidates)

    // let possibleState = []
    // for (let i = 0; i < 24; i++) {
    //     possibleState.push(i)
    // }

    let matches = new Set()

    for (let candidate of candidates) {
        let possibleState = []
        for (let i = 0; i < 24; i++) {
            possibleState.push(i)
        }
        // console.log({candidate, possibleState})
        let first = candidate[0].split(".")
        let second = candidate[1].split(".")

        let scanner1 = scanners[first[0]]
        // let cp = _.cloneDeep(scanners[second[0]])
        let scanner2 = scanners[second[0]]

        let state = possibleState.shift()
        let distance1 = getXYZDistance(scanner1[first[1]], scanner1[first[2]])

        while (true) {
            if (state === undefined) {
                console.log(`No match ${first} ${second}`)
                break
            }
            let copy = combination(scanner2, state)
            let distance2 = getXYZDistance(copy[second[1]], copy[second[2]])
            let isMatch = matchXYZDistance(distance1, distance2)

            // console.log({ first, second, distance1, distance2, state })
            if (!isMatch) {
                // combination(scanner2, state)
                state = possibleState.shift()
                continue
            }

            matches.add([first, second, state])

            break

        }
        // scanners[second[0]] = scanner2

        // return
    }

    console.log(matches, matches.size)



    // console.log({ possibleMatch })
    // console.log({ scanners })
    // console.log({ differences })
    // console.log({ beacons, size: Object.keys(beacons).length })

    // differences.push(getDifferences2(scanners[scannerId]))


    // let differences = getDifferences(scanners)

    // console.log({ differences })

    // printSolution(inputs)
}

const matchXYZDistance = (arr1, arr2) => createKey(arr1) === createKey(arr2)

const getXYZDistance = (arr1, arr2) => {
    let distance = []

    for (let i = 0; i < arr1.length; i++) {
        const v1 = arr1[i]
        const v2 = arr2[i]

        distance.push(v1 - v2)
    }

    return distance
}

const getStraigthDistance = (arr1, arr2) => {
    let sum = 0

    for (let i = 0; i < arr1.length; i++) {
        const v1 = arr1[i]
        const v2 = arr2[i]

        sum += (v1 - v2) ** 2
    }

    return Math.sqrt(sum)
}

const sequenceGenerator = () => {
    // https://stackoverflow.com/a/16467849
    const roll = (v) => [v[0], v[2], -v[1]]
    const turn = (v) => [-v[1], v[0], v[2]]

    const sequence = (v) => {
        let result = new Set()
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 3; j++) {
                v = roll(v)
                result.add(v)
                for (let k = 0; k < 3; k++) {
                    v = turn(v)
                    result.add(v)
                }
            }
            v = roll(turn(roll(v)))
        }

        return result
    }

    let res = sequence(1, 2, 3)
}

const combination = (scanner, state) => {
    // generated from sequenceGenerator
    // for given array [x, y, z], it can turn into all these different values
    let copy = _.cloneDeep(scanner)

    const COMBINATION_MATRIX = [
        (x, y, z) => [x * -1, y * -1, z],
        (x, y, z) => [x * -1, z * -1, y * -1],
        (x, y, z) => [x * -1, y, z * -1],
        (x, y, z) => [x * -1, z, y],
        (x, y, z) => [y * -1, x * -1, z * -1],
        (x, y, z) => [y * -1, z * -1, x],
        (x, y, z) => [y * -1, x, z],
        (x, y, z) => [y * -1, z, x * -1],
        (x, y, z) => [z * -1, x * -1, y],
        (x, y, z) => [z * -1, y * -1, x * -1],
        (x, y, z) => [z * -1, x, y * -1],
        (x, y, z) => [z * -1, y, x],
        (x, y, z) => [x, y * -1, z * -1],
        (x, y, z) => [x, z * -1, y],
        (x, y, z) => [x, y, z],
        (x, y, z) => [x, z, y * -1],
        (x, y, z) => [y, x * -1, z],
        (x, y, z) => [y, z * -1, x * -1],
        (x, y, z) => [y, x, z * -1],
        (x, y, z) => [y, z, x],
        (x, y, z) => [z, x * -1, y * -1],
        (x, y, z) => [z, y * -1, x],
        (x, y, z) => [z, x, y],
        (x, y, z) => [z, y, x * -1]
    ]

    for (let [key, value] of Object.entries(copy)) {
        let [x, y, z] = value
        copy[key] = COMBINATION_MATRIX[state](x, y, z)
    }

    return copy
}

const rotate = (axis, angle, values) => {
    let matrix = []
    if (![90, 180, 270].includes(angle)) {
        throw new Error(`Invalid angle ${angle}`)
    }

    let sin = Math.sin(angle * Math.PI / 180).rounded()
    let cos = Math.cos(angle * Math.PI / 180).rounded()

    switch (axis) {
        case "x":
            matrix = [
                [1, 0, 0],
                [0, cos, sin * -1],
                [0, sin, cos]
            ]
            break;
        case "y":
            matrix = [
                [cos, 0, sin],
                [0, 1, 0],
                [sin * -1, 0, cos]
            ]
            break;
        case "z":
            matrix = [
                [cos, sin * -1, 0],
                [sin, cos, 0],
                [0, 0, 1]
            ]
            break;

        default:
            throw new Error(`Invalid axis ${axis}`)
    }

    let newValues = []

    for (let i = 0; i < 3; i++) {
        let m = matrix[i]
        let sum = 0
        console.log({ values, m })
        for (let j = 0; j < 3; j++) {
            let cv = values[j]
            sum += cv * m[j]
        }
        newValues.push(sum)
    }

    return newValues
}

const getCandidates = (scanners, beacons) => {
    let id1 = 3
    let id2 = 4

    let possibleMatch = []
    Object.values(beacons).forEach((e) => {
        if (e.size > 1) {
            let arr = []
            Array.from(e).forEach(v => {
                let t = Number(v.split(".").shift())

                if (t === id1 || t === id2) {
                    arr.push(v)
                }
            })

            if (arr.length > 1) {
                possibleMatch.push(arr)
            }
        }
    })

    // console.log({ a: scanners["0"], b: scanners["1"] })
    // console.log({ possibleMatch })

    return possibleMatch

    // possibleMatch
    // maybe get 4 beacons per scanner - try check whether the translation works?
    // scan1.beacon1 [x,y,z] - scan2.beacon1 [x,y,z] = scan1.beacon2 [x,y,z] - scan2.beacon2 [x,y,z]
    // if it doesnt match, rotate scan2
}

const getDifferences = (scanners, scannerId, beacons) => {
    const keys = Object.keys(scanners[scannerId])

    for (let i = 0; i < keys.length; i++) {
        for (let j = 0; j < keys.length; j++) {
            const baseKey = keys[i]
            const compareKey = keys[j]
            const temp = [baseKey, compareKey].sort()

            if (i === j) {
                continue
            }

            const distance = getStraigthDistance(scanners[scannerId][baseKey], scanners[scannerId][compareKey])

            if (!beacons[distance]) {
                beacons[distance] = new Set()
            }

            // scannerId x, distance of beacon n to beacon m = distance
            beacons[distance].add([scannerId, ...temp].join("."))
        }
    }
}
/* 
const getDifferences = (scanners) => {
    // this assumes every scanners has same amount of beacon listed

    const ids = Object.keys(scanners)
    const difference = {}

    for (let i = 0; i < ids.length; i++) {
        for (let j = 0; j < ids.length; j++) {
            if (i === j) {
                continue
            }

            let scannerKey = createKey(i, j)

            difference[scannerKey] = {}

            let beacons1 = Object.keys(scanners[i])
            let beacons2 = Object.keys(scanners[j])

            // console.log(scanners)

            for (let k = 0; k < beacons1.length; k++) {
                for (let l = 0; l < beacons2.length; l++) {
                    let coordinate1 = scanners[i][beacons1[k]]
                    let coordinate2 = scanners[j][beacons2[l]]
                    // console.log({coordinate1, coordinate2})
                    let beaconKey = createKey(beacons1[k], beacons2[l])
                    assert.equal(coordinate1.length, coordinate2.length, JSON.stringify({ coordinate1, coordinate2 }))
                    let d = []

                    for (let m = 0; m < coordinate1.length; m++) {
                        d.push(coordinate1[m] - coordinate2[m])
                    }

                    difference[scannerKey][beaconKey] = d
                }
            }
        }
    }

    return difference
}
 */
const createKey = (...rest) => rest.join(".")

// flags.defineBoolean("sample", false, "run with sample")
// flags.defineBoolean("s", false, "run with sample")
// flags.parse()

// solve(flags.get("sample") || flags.get("s"))

let sample = true
// let sample = false

solve(sample)