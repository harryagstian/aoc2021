const { readFromFile, printSolution } = require('./utility')
const flags = require('flags')

let nodes = []
let cost = {}
let visitedEdge = new Set()
const queue = []

const dx = [0, 1, 0, -1]
const dy = [-1, 0, 1, 0]

const solve = (sample) => {
    const inputs = readFromFile(15, sample).split("\n")

    for (let y = 0; y < inputs.length; y++) {
        const line = inputs[y]
        const n = []
        for (let x = 0; x < inputs[0].length; x++) {
            let c = Number(line[x])

            n.push(c)

            cost[createKey(x, y)] = {
                risk: c,
                cost: Number.MAX_VALUE,
                via: null,
            }
        }
        nodes.push(n)
    }

    actuallySolving()

    // part 2

    nodes = []
    cost = {}
    visitedEdge = new Set()

    for (let ry = 0; ry < 5; ry++) { // repeat y 5 times
        for (let y = 0; y < inputs.length; y++) {
            const line = inputs[y]
            const n = []
            for (let rx = 0; rx < 5; rx++) { // repeat x 5 times
                for (let x = 0; x < inputs[0].length; x++) {
                    let c = Number(line[x]) + rx + ry

                    if (c > 9) {
                        c %= 9
                    }

                    n.push(c)

                    let keyX = (rx * inputs.length) + x
                    let keyY = (ry * inputs[0].length) + y
                    cost[createKey(keyX, keyY)] = {
                        risk: c,
                        cost: Number.MAX_VALUE,
                        via: null,
                    }
                }
            }
            nodes.push(n)
        }
    }

    actuallySolving()
}

const actuallySolving = () => {
    cost["0.0"].risk = 0
    cost["0.0"].cost = 0

    traverse("0.0")

    while (queue.length > 0) {
        const q = queue.shift()
        const newKey = q.to
        if (cost[newKey].cost > q.cost) {
            cost[newKey].cost = q.cost
            cost[newKey].via = q.from
        }

        traverse(newKey)
    }

    bottomRightKey = createKey(nodes[0].length - 1, nodes.length - 1)
    printSolution(cost[bottomRightKey].cost)
}

const hasBeenVisited = (key1, key2) => {
    const jsonKey = JSON.stringify([key1, key2].sort())

    if (visitedEdge.has(jsonKey)) {
        return true
    } else {
        visitedEdge.add(jsonKey)
        return false
    }
}

const traverse = (currentKey) => {
    const [x, y] = splitKey(currentKey)
    for (let i = 0; i < 4; i++) {
        const cx = x + dx[i]
        const cy = y + dy[i]

        const newKey = createKey(cx, cy)

        if (!cost[newKey]) {
            continue
        }

        if (!hasBeenVisited(currentKey, newKey)) {
            const q = {
                from: currentKey,
                to: newKey,
                cost: cost[currentKey].cost + nodes[cy][cx]
            }

            insertPriorityQueue(q)
        }
    }
}

const createKey = (x, y) => `${x}.${y}`

const splitKey = (key) => key.split(".").map(Number)

const insertPriorityQueue = (item) => {
    const index = queue.findIndex(e => {
        return item.cost < e.cost
    })
    
    if (index === -1) {
        queue.push(item)
    } else {
        queue.splice(index, 0, item)
    }
}


flags.defineBoolean("sample", false, "run with sample")
flags.defineBoolean("s", false, "run with sample")
flags.parse()

solve(flags.get("sample") || flags.get("s"))