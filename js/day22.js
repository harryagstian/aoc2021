const { readFromFile, printSolution } = require('./utility')
const flags = require('flags')
require("util").inspect.defaultOptions.depth = null;
const assert = require('assert')
const _ = require('lodash')

// cases for each start / end
// it never overlap
// it overlap partially 
// start1 > start2, end1 < end2

// it fully overlap

let steps = []

const solve = (sample) => {
    const inputs = readFromFile(22, sample).split("\n")
    let count = 0
    for (let line of inputs) {
        // console.log(line, inputs)
        let [mode, area] = line.split(" ")

        let arr = []
        for (let dim of area.split(",")) {
            arr.push(dim.split("=").pop().split("..").map(Number))
        }

        // get current volume
        let volume = 1
        for (let i = 0; i < arr.length; i++) {
            let currentAxis = _.sortBy(arr[i])
            assert.equal(currentAxis[0] <= currentAxis[1], true, currentAxis)
            volume *= currentAxis[1] - currentAxis[0] + 1
            // TODO: need to handle off mode
        }

        // get overlap volume
        let overlapVolume = null

        for (let [index, ops] of steps.entries()) {
            let m = ops.mode
            let a = ops.arr
            let hasOverlap = false

            console.log({ m, a })
            if (m !== mode) {
                continue
            }

            if (overlapVolume === null) {
                overlapVolume = 1
            }

            for (let i = 0; i < a.length; i++) {
                let currentAxis = _.sortBy(arr[i])
                let oldAxis = _.sortBy(a[i])
                assert.equal(oldAxis[0] <= oldAxis[1], true, oldAxis)
                let start = 0
                let end = 0
                if (oldAxis[0] <= currentAxis[0] && currentAxis[1] <= oldAxis[1]) { // fully inside
                    start = currentAxis[0]
                    end = currentAxis[1]
                    hasOverlap = true
                } else if (currentAxis[0] <= oldAxis[0] && currentAxis[1] >= oldAxis[1]) { // larger than old axis
                    start = currentAxis[0]
                    end = currentAxis[1]
                    hasOverlap = true
                } else if (oldAxis[0] <= currentAxis[0] && currentAxis[0] <= oldAxis[1]) { // partially inside old axis
                    start = currentAxis[0]
                    end = oldAxis[1]
                    hasOverlap = true
                } else if (oldAxis[0] <= currentAxis[1] && currentAxis[1] <= oldAxis[1]) {
                    start = oldAxis[0]
                    end = currentAxis[1]
                    hasOverlap = true
                }

                overlapVolume *= end - start + 1

                // console.log({overlapVolume, end, start})
            }

            if(!hasOverlap) {
                overlapVolume = 0
            }
        }
        console.log({ volume, overlapVolume })
        volume += overlapVolume

        count = (mode === "on") ? count + volume : count - volume
        steps.push({ mode, arr: arr, volume })
        // console.log({ mode, arr })
    }
    console.log(steps)
    console.log(count)
    printSolution(inputs)


}

// flags.defineBoolean("sample", false, "run with sample")
// flags.defineBoolean("s", false, "run with sample")
// flags.parse()

// solve(flags.get("sample") || flags.get("s"))

let sample = true
// sample = false
solve(sample)