package main

import (
	"fmt"
	"strconv"
	"strings"
)

var day4BoardSize int

func day4(day int, sample bool) {
	lines := inputReaderWrapper(day, sample)
	pulledNumbers := []int{}
	boards := [3][][]int{}
	day4BoardSize = 5
	iter := 0
	for _, v := range lines {
		if len(v) == 0 {
			iter = iter + 1
			continue
		}

		if iter == 0 {
			pulledNumbers, _ = sliceAtoi(strings.Split(v, ","))
		} else {
			arrInt := boardParser(v)
			fmt.Printf("%+v %+v\n", arrInt, strings.Split(v, " "))
			boards[iter-1] = append(boards[iter-1], arrInt)
			// boards[iter-1]
		}

	}

	fmt.Println(pulledNumbers)
	fmt.Println(boards)
	printSolution(boards)
}

func boardParser(line string) (ret []int) {
	for i := 0; i < day4BoardSize; i++ { // assuming 5 sized bingo board
		low := (i * 2) + i // offset for space
		high := low + 2
		intVal, _ := strconv.Atoi(strings.TrimSpace(line[low:high]))
		ret = append(ret, intVal)
	}

	return ret
}

func checkWinStatus(board [][]int, x int, y int, drawnNumber map[int]bool) bool {
	// x & y = 0 starts from top left, only positive

	// check vertical
	win := false

	for !win {
		notDrawn := false
		for i := 0; i < day4BoardSize; i++ {
			if _, ok := drawnNumber[board[i][x]]; !ok {
				notDrawn = true
				break
			}
		}
		if notDrawn {
			break
		}
	}

	if win {
		return true
	}

	// check horizontal
	for !win {
		notDrawn := false
		for i := 0; i < day4BoardSize; i++ {
			if _, ok := drawnNumber[board[y][i]]; !ok {
				notDrawn = true
				break
			}
		}
		if notDrawn {
			break
		}
	}

	if win {
		return true
	}

	// check diagonal. how tho?
	for !win {
		notDrawn := false
		for i := 0; i < day4BoardSize; i++ {
			if _, ok := drawnNumber[board[y][i]]; !ok {
				notDrawn = true
				break
			}
		}
		if notDrawn {
			break
		}
	}

	return win
}
