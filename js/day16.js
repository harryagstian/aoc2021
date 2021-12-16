const { readFromFile, printSolution } = require('./utility')
const flags = require('flags')
const assert = require('assert/strict')
const _ = require('lodash')

let part1 = 0
let part2

const solve = (sample) => {
    const inputs = readFromFile(16, sample).split("\n")

    for (line of inputs) {
        // console.log(Array(120).fill("=").join(""))
        part2 = binaryParser(hexToBinary(line))
        // console.log({ line, part2 })
    }

    printSolution(part1)
    printSolution(part2.value)
}

const binaryParser = (binary) => {
    if (typeof binary === "string") {
        binary = binary.split("")
    }
    
    const version = binaryToHex(binary.splice(0, 3))
    const typeId = binaryToHex(binary.splice(0, 3))

    if (isNaN(typeId)) {
        return { len: 6, value: 0 }
    }

    part1 += Number(hexToDec(version))

    if (typeId == 4) {
        // literal value
        const stack = []
        let counter = 1
        while (binary.shift() == 1) {
            stack.push(...binary.splice(0, 4))
            counter++
        }
        stack.push(...binary.splice(0, 4))

        const value = binaryToDec(stack)
        let returnValue = { value, len: stack.length + 6 + counter }

        return returnValue
    } else {
        const lenTypeId = binary.shift()
        const subpacketValue = []
        let totalLen = 6

        if (lenTypeId == 0) {
            let subpacketLen = Number(binaryToDec(binary.splice(0, 15)))
            totalLen += 15
            totalLen += subpacketLen
            // bits at the end are extra due to the hexadecimal representation and should be ignored.
            while (subpacketLen > 6) { 
                const { len, value } = binaryParser(binary)
                subpacketLen -= len
                subpacketValue.push(Number(value))
            }
        } else if (lenTypeId == 1) {
            let subpacketCount = Number(binaryToDec(binary.splice(0, 11)))
            totalLen += 11
            
            for (let i = 0; i < subpacketCount; i++) {
                const { len, value } = binaryParser(binary)
                totalLen += len
                subpacketValue.push(Number(value))
            }
        } else {
            console.error(binary, version, typeId)
            throw new Error("Not possible")
        }

        let value = 0

        // console.log({ typeId, splen: subpacketValue.length, lenTypeId, subpacketValue })
        if (typeId == 0) {
            value += subpacketValue.reduce((p, c) => { return p + c }, 0)
        } else if (typeId == 1) {
            value += subpacketValue.reduce((p, c) => { return p * c }, 1)
        } else if (typeId == 2) {
            value += _.min(subpacketValue)
        } else if (typeId == 3) {
            value += _.max(subpacketValue)
        } else if (typeId == 5) {
            assert.equal(subpacketValue.length, 2, JSON.stringify({ subpacketValue }))
            value += (subpacketValue[0] > subpacketValue[1]) ? 1 : 0
        } else if (typeId == 6) {
            assert.equal(subpacketValue.length, 2, JSON.stringify({ subpacketValue }))
            value += (subpacketValue[0] < subpacketValue[1]) ? 1 : 0
        } else if (typeId == 7) {
            assert.equal(subpacketValue.length, 2, JSON.stringify({ subpacketValue }))
            value += (subpacketValue[0] == subpacketValue[1]) ? 1 : 0
        }

        const returnValue = { len: totalLen, value }
        return returnValue
    }

}

const hexToDec = (hex) => {
    return parseInt(hex, 16).toString(10)
}

const binaryToDec = (binary) => {
    if (Array.isArray(binary)) {
        binary = binary.join("")
    }
    return parseInt(binary, 2).toString(10)
}

const binaryToHex = (binary) => {
    if (Array.isArray(binary)) {
        binary = binary.join("")
    }
    return parseInt(binary, 2).toString(16)
}

const hexToBinary = (hex) => {
    hex = hex.split("")
    let binary = ''
    while (hex.length > 0) {
        let char = hex.shift()
        binary += parseInt(char, 16).toString(2).padStart(4, "0")
    }

    return binary
}

flags.defineBoolean("sample", false, "run with sample")
flags.defineBoolean("s", false, "run with sample")
flags.parse()

solve(flags.get("sample") || flags.get("s"))