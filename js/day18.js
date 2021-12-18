const { readFromFile, printSolution } = require('./utility')
const flags = require('flags')
require("util").inspect.defaultOptions.depth = null;
const _ = require('lodash')

const logWrapper = (item) => {
    const debug = true

    if (debug) {
        console.log(item)
    }
}

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

    // console.log({ output: JSON.stringify(treeToArray(globalTree)) })
    printSolution(getMagnitude(globalTree))
}

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
    if (typeof x === "object") {
        let clone = _.cloneDeep(key)
        clone.push("x")
        snailfishReducer(depth + 1, clone, mode)
    }
    // explode

    if (depth === 4 && mode === "explode") {
        // console.log("before", mode, globalTreeToJSON())
        let tempKey = _.cloneDeep(key)
        const currentSide = tempKey.pop()
        const parentTree = getPropByString(globalTree, tempKey.join("."))

        parentTree[currentSide] = "?"
        // console.log("during", mode, globalTreeToJSON())
        let jsonString = JSON.stringify(treeToArray(globalTree))
        // console.log({ a: parentTree[currentSide], currentSide, jsonString })
        let rightRule = /(.*"\?".*?)(\d+)(.*)/g
        let leftRule = /(.*)(\W)(\d+)(.*"\?".*)(.*)/g

        let res = leftRule.exec(jsonString)
        if (res !== null) {
            let newStr = res[1] + res[2] + String(Number(res[3]) + x) + res[4] + res[5]
            // console.log({ jsonString, newStr, res })
            jsonString = newStr
        }

        let res2 = rightRule.exec(jsonString)

        if (res2 !== null) {
            let newStr = res2[1] + String(Number(res2[2]) + y) + res2[3]
            jsonString = newStr
        }

        jsonString = jsonString.replace(/"\?"/, "0")
        // console.log({ jsonString, res, x, y, depth })
        globalTree = arrayToTree(JSON.parse(jsonString))
        // console.log({ globalTree, jsonString })
        // console.log("after", mode, globalTreeToJSON())
    } else if (canSplit && mode === "split") {
        // console.log({ x, y, key: "asdasdasd" })
        if (x >= 10) {
            let base = x / 2
            let tempKey = _.cloneDeep(key)
            // const currentSide = tempKey.pop()
            const parentTree = getPropByString(globalTree, tempKey.join("."))
            // console.log("before", mode, globalTreeToJSON(), x, base, parentTree)
            parentTree.x = { x: Math.floor(base), y: Math.ceil(base) }
            // console.log("after", mode, globalTreeToJSON(), parentTree)
            actionTaken++
            canSplit = false
            doneForNow = true
        } else if (y >= 10) {
            let base = y / 2
            let tempKey = _.cloneDeep(key)
            // const currentSide = tempKey.pop()
            const parentTree = getPropByString(globalTree, tempKey.join("."))
            parentTree.y = { x: Math.floor(base), y: Math.ceil(base) }
            actionTaken++
            canSplit = false
            doneForNow = true
        }
        // console.log({ a: JSON.stringify(treeToArray(globalTree)) })
    }

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

const getMagnitude = (tree) => {
    let { x, y } = tree


    if (typeof x === "object") {
        x = getMagnitude(x)
    }

    if (typeof y === "object") {
        y = getMagnitude(y)
    }



    return (3 * x) + (2 * y)
}

const globalTreeToJSON = () => {
    return JSON.stringify(treeToArray(globalTree))
}

flags.defineBoolean("sample", false, "run with sample")
flags.defineBoolean("s", false, "run with sample")
flags.parse()

solve(flags.get("sample") || flags.get("s"))