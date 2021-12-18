const { readFromFile, printSolution } = require('./utility')
const flags = require('flags')
require("util").inspect.defaultOptions.depth = null;
const _ = require('lodash')

let globalTree = {}
let actionTaken = 0
let canSplit = true

const solve = (sample) => {
    let inputs = readFromFile(18, sample).split("\n")

    for (let [index, line] of inputs.entries()) {
        if (index === 0) {
            globalTree = arrayToTree(eval(line))
        } else {
            globalTree.x = _.cloneDeep(globalTree)
            globalTree.y = arrayToTree(eval(line))
            let t = actionTaken
            while (true) {
                canSplit = true

                snailfishReducer(0, [], "explode")
                snailfishReducer(0, [], "split")

                if (t === actionTaken) {
                    break
                } else {
                    t = actionTaken
                }
            }
        }
    }

    printSolution(getMagnitude(globalTree))

    let maxSum = 0
    for (let i = 0; i < inputs.length; i++) {
        for (let j = 0; j < inputs.length; j++) {
            if (i === j) {
                continue
            }
            let line1 = inputs[i]
            let line2 = inputs[j]

            globalTree = {
                x: arrayToTree(eval(line1)),
                y: arrayToTree(eval(line2))
            }

            let t = actionTaken
            while (true) {
                canSplit = true

                snailfishReducer(0, [], "explode")
                snailfishReducer(0, [], "split")

                if (t === actionTaken) {
                    break
                } else {
                    t = actionTaken
                }
            }

            let sum = getMagnitude(globalTree)
            maxSum = Math.max(sum, maxSum)
        }
    }

    printSolution(maxSum)
}

// convert object to array
const treeToArray = (tree) => {
    let { x, y } = tree
    if (typeof x === "object") {
        x = treeToArray(x)
    }
    if (typeof y === "object") {
        y = treeToArray(y)
    }

    return [x, y]
}

// convert array to object
const arrayToTree = (arr) => {
    const tree = {}

    const [x, y] = arr

    if (Array.isArray(x)) {
        tree.x = arrayToTree(x)
    } else {
        tree.x = x
    }

    if (Array.isArray(y)) {
        tree.y = arrayToTree(y)
    } else {
        tree.y = y
    }

    return tree
}

const snailfishReducer = (depth, key = [], mode) => {
    let { x, y } = getPropByString(globalTree, key.join("."))

    // traverse left most first
    if (typeof x === "object") {
        let clone = _.cloneDeep(key)
        clone.push("x")
        snailfishReducer(depth + 1, clone, mode)
    }

    // explode
    if (depth === 4 && mode === "explode") {
        let tempKey = _.cloneDeep(key)
        const currentSide = tempKey.pop()
        const parentTree = getPropByString(globalTree, tempKey.join("."))

        parentTree[currentSide] = "?"
        let jsonString = JSON.stringify(treeToArray(globalTree))
        // get first number after question mark
        let rightRule = /(.*"\?".*?)(\d+)(.*)/g
        // get first number before question mark
        let leftRule = /(.*)(\W)(\d+)(.*"\?".*)(.*)/g

        let res = leftRule.exec(jsonString)
        if (res !== null) {
            // addition to first number before question mark
            let newStr = res[1] + res[2] + String(Number(res[3]) + x) + res[4] + res[5]
            jsonString = newStr
        }

        let res2 = rightRule.exec(jsonString)

        if (res2 !== null) {
            // addition to first number after question mark
            let newStr = res2[1] + String(Number(res2[2]) + y) + res2[3]
            jsonString = newStr
        }

        jsonString = jsonString.replace(/"\?"/, "0")
        globalTree = arrayToTree(JSON.parse(jsonString))
    } else if (canSplit && mode === "split") {
        if (x >= 10) {
            let base = x / 2
            let tempKey = _.cloneDeep(key)
            const parentTree = getPropByString(globalTree, tempKey.join("."))
            parentTree.x = { x: Math.floor(base), y: Math.ceil(base) }
            actionTaken++
            canSplit = false
        } else if (y >= 10) {
            let base = y / 2
            let tempKey = _.cloneDeep(key)
            const parentTree = getPropByString(globalTree, tempKey.join("."))
            parentTree.y = { x: Math.floor(base), y: Math.ceil(base) }
            actionTaken++
            canSplit = false
        }
    }

    // traverse to y
    if (typeof y === "object") {
        let clone = _.cloneDeep(key)
        clone.push("y")
        snailfishReducer(depth + 1, clone, mode)
    }
}

const getPropByString = (obj, propString) => {
    if (!propString)
        return obj;

    let prop, props = propString.split('.');
    let i = 0

    for (let iLen = props.length - 1; i < iLen; i++) {
        prop = props[i];

        let candidate = obj[prop];
        if (candidate !== undefined) {
            obj = candidate;
        } else {
            break;
        }
    }
    return obj[props[i]];
}

let dp = {}

const getMagnitude = (tree) => {
    let key = JSON.stringify(tree)

    if (dp[key]) {
        return dp[key]
    }

    let { x, y } = tree


    if (typeof x === "object") {
        x = getMagnitude(x)
    }

    if (typeof y === "object") {
        y = getMagnitude(y)
    }

    let ans = (3 * x) + (2 * y)
    dp[key] = ans
    return ans
}

const globalTreeToJSON = () => {
    // for debugging
    return JSON.stringify(treeToArray(globalTree))
}

flags.defineBoolean("sample", false, "run with sample")
flags.defineBoolean("s", false, "run with sample")
flags.parse()

solve(flags.get("sample") || flags.get("s"))