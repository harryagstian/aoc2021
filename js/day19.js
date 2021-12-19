const { readFromFile, printSolution } = require('./utility')
const flags = require('flags')
const assert = require('assert')
require("util").inspect.defaultOptions.depth = null;

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

            console.log({ key, arr })
        }
    }

    let fixed = new Set() // these scanners should not be rotated

    // try 0 and 1 first

    temp(scanners, beacons)



    // console.log({ possibleMatch })
    // console.log({ scanners })
    // console.log({ differences })
    // console.log({ beacons, size: Object.keys(beacons).length })

    // differences.push(getDifferences2(scanners[scannerId]))


    // let differences = getDifferences(scanners)

    // console.log({ differences })

    // printSolution(inputs)
}

const getDistance = (arr1, arr2) => {
    let sum = 0

    for (let i = 0; i < arr1.length; i++) {
        const v1 = arr1[i]
        const v2 = arr2[i]

        sum += (v1 - v2) ** 2
    }

    return Math.sqrt(sum)
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

const temp = (scanners, beacons) => {
    let id1 = 0
    let id2 = 1


    let possibleMatch = []
    Object.values(beacons).forEach((e) => {
        if (e.size > 1) {
            let arr = []
            Array.from(e).forEach(v => {
                let t = Number(v.split(".").shift())
                console.log(t)

                if (t === id1 || t === id2) {
                    arr.push(v)
                }
            })

            if (arr.length > 1) {
                possibleMatch.push(arr)
            }
        }
    })

    console.log({ a: scanners["0"], b: scanners["1"] })
    console.log({ possibleMatch })

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

            const distance = getDistance(scanners[scannerId][baseKey], scanners[scannerId][compareKey])

            if (!beacons[distance]) {
                beacons[distance] = new Set()
            }


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
const createKey = (x, y) => `${x}.${y}`

flags.defineBoolean("sample", false, "run with sample")
flags.defineBoolean("s", false, "run with sample")
flags.parse()

solve(flags.get("sample") || flags.get("s"))