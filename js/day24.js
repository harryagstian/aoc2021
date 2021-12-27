const { readFromFile, printSolution } = require('./utility')
const flags = require('flags')

// thanks reddit! r/adventofcode/comments/roj2uk

const solve = (sample) => {
    const inputs = readFromFile(24, sample).split("\n")

    let numbers = []
    let tmp = []
    let index = 0
    let maxMultiplier = 0

    let vars = {
        w: 0,
        x: 0,
        y: 0,
        z: 0
    }

    for (let line of inputs) {
        if (line.includes("inp")) {
            index = 0

            if (tmp.length > 0) {
                numbers.push(tmp)
                tmp = []
            }
        }

        if (index === 4 || index === 5 || index === 15) {
            tmp.push(Number(line.split(" ").pop()))
        }

        if (index === 4 && Number(line.split(" ").pop()) === 26) {
            maxMultiplier++
        }

        index++
    }
    numbers.push(tmp)

    let candidate = Array(14).fill(9)

    // find first valid model number starting from 99999... 
    while (true) {
        // reset everything
        vars = {
            w: 0,
            x: 0,
            y: 0,
            z: 0
        }
        let i = 0
        let str = candidate.join("")
        let multiplier = maxMultiplier

        for (i; i < str.length; i++) {
            lastI = i
            vars.w = Number(str[i])

            let result = process(vars, numbers[i], multiplier)
            vars = result[0]
            let nextMultiplier = result[1]

            if (nextMultiplier === -1) {
                break
            }
            multiplier = nextMultiplier
        }

        if (vars.z === 0) {
            break
        }

        candidate[i]--

        // set next number
        if (candidate[i] < 0) {
            for (let j = candidate.length - 1; j >= 0; j--) {
                let c = candidate[j]

                if (c < 0) {
                    candidate[j] = 9
                    candidate[j - 1]--
                }
            }
        }
    }

    // 99999795919456
    printSolution(candidate.join(""))

    candidate = Array(14).fill(1)

    // find first valid model number starting from 11111... 
    while (true) {
        // reset everything
        vars = {
            w: 0,
            x: 0,
            y: 0,
            z: 0
        }
        let i = 0
        let str = candidate.join("")
        let multiplier = maxMultiplier

        for (i; i < str.length; i++) {
            lastI = i
            vars.w = Number(str[i])

            let result = process(vars, numbers[i], multiplier)
            vars = result[0]
            let nextMultiplier = result[1]

            if (nextMultiplier === -1) {
                break
            }
            multiplier = nextMultiplier
        }

        if (vars.z === 0) {
            break
        }

        // set next number
        candidate[i]++

        if (candidate[i] > 9) {
            for (let j = candidate.length - 1; j >= 0; j--) {
                let c = candidate[j]

                if (c > 9) {
                    candidate[j] = 1
                    candidate[j - 1]++
                }
            }
        }
    }

    // this takes a while to compute (3 mins)
    // maybe need more optimization for part 2?
    // 45311191516111
    printSolution(candidate.join(""))
}

const process = (vars, [n1, n2, n3], multiplier) => {
    // refer to inp/day 24 - commands breakdown.xlsx 

    let { w, x, y, z } = vars
    x = Number(((z % 26) + n2) !== w)

    z = Math.floor(z / n1)

    y = (25 * x) + 1

    z *= y

    y = (w + n3) * x

    z += y

    if (n1 === 26) {
        multiplier--

        // the only thing that can reduce z in the command is only z / 26
        // so if z >= 26 ** (number of remaining 26s), it will never be 0!
        // just break at this point and move on to next number
        if (z >= 26 ** multiplier) {
            multiplier = -1
        }
    }
    return [{ w, x, y, z }, multiplier]
}

flags.defineBoolean("sample", false, "run with sample")
flags.defineBoolean("s", false, "run with sample")
flags.parse()

solve(flags.get("sample") || flags.get("s"))