const { readFromFile, printSolution } = require('./utility')
const flags = require('flags')

const solve = (sample) => {
    const inputs = readFromFile(20, sample).split("\n")

    let algorithm = ""
    let imageInput = new Set()
    let i = 0
    let inputDimension = { x: [0, 0], y: [0, 0] }
    for (let [index, line] of inputs.entries()) {
        if (index === 0) {
            algorithm = line.split("").map(e => e === "#" ? 1 : 0)
        } else if (line !== "") {
            line = line.split("")
            for (let j = 0; j < line.length; j++) {
                if (line[j] === "#") {
                    const key = createKey([j, i])
                    imageInput.add(key)
                }
                inputDimension.x[1] = Math.max(inputDimension.x[1], j)

            }
            inputDimension.y[1] = Math.max(inputDimension.y[1], i)
            i++

        }
    }

    const ITERATION = 50
    let oob = false // state of every pixel that is out of bound
    for (let i = 0; i < ITERATION; i++) {
        let newArr = new Set()

        inputDimension.x[0] -= 1
        inputDimension.x[1] += 1
        inputDimension.y[0] -= 1
        inputDimension.y[1] += 1

        for (let a = inputDimension.y[0]; a <= inputDimension.y[1]; a++) {
            for (let b = inputDimension.x[0]; b <= inputDimension.x[1]; b++) {
                // console.log(oob)
                let str = ""
                for (let y of [-1, 0, 1]) {
                    for (let x of [-1, 0, 1]) {
                        let key = createKey([b + x, a + y])
                        if ((a + y <= inputDimension.y[0] || a + y >= inputDimension.y[1] || b + x <= inputDimension.x[0] || b + x >= inputDimension.x[1]) && oob) {
                            str += "1"
                        } else if (imageInput.has(key)) {
                            str += "1"
                        } else {
                            str += "0"
                        }

                    }
                }

                let result = algorithm[parseInt(str, 2)]

                if (result === 1) {
                    newArr.add(createKey([b, a]))
                }
            }
        }

        if (!oob) {
            oob = algorithm[0] == 1
        } else {
            oob = algorithm[parseInt(Array(9).fill("1").join(""), 2)] == 1
        }
        imageInput = newArr

        if (i === 1) {
            printSolution(imageInput.size)
        }
    }

    printSolution(imageInput.size)
}

const createKey = (arr) => arr.join(".")

flags.defineBoolean("sample", false, "run with sample")
flags.defineBoolean("s", false, "run with sample")
flags.parse()

solve(flags.get("sample") || flags.get("s"))