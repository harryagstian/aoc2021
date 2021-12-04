package main

import (
	"strconv"
	"strings"
)

func day3(day int, sample bool) {
	lines := inputReaderWrapper(day, sample)
	countZero := []int{}
	countOne := []int{}
	for i, line := range lines {
		for j, v := range strings.Split(line, "") {
			if i == 0 {
				countOne = append(countOne, 0)
				countZero = append(countZero, 0)
			}

			if v == "0" {
				countZero[j] = countZero[j] + 1
			} else {
				countOne[j] = countOne[j] + 1
			}
		}
	}

	gammaArray := []int{}
	epsilonArray := []int{}

	for i := 0; i < len(countOne); i++ {
		mostCommon := 1
		if countZero[i] > countOne[i] {
			mostCommon = 0
		}

		gammaArray = append(gammaArray, mostCommon)
		if mostCommon == 1 {
			mostCommon = 0
		} else {
			mostCommon = 1
		}
		epsilonArray = append(epsilonArray, mostCommon)
	}

	gammaInt := convertBinaryArrIntToInt(gammaArray)
	epsilonInt := convertBinaryArrIntToInt(epsilonArray)

	printSolution(gammaInt * epsilonInt)

	iter := 0
	baseLines := lines
	for len(lines) > 1 {
		lines = getOccurence(lines, iter, "O2")
		iter = iter + 1
	}

	O2Int := convertBinaryArrStrToInt(lines)

	iter = 0
	lines = baseLines
	for len(lines) > 1 {
		lines = getOccurence(lines, iter, "CO2")
		iter = iter + 1
	}
	CO2Int := convertBinaryArrStrToInt(lines)
	printSolution(O2Int * CO2Int)
}

func getOccurence(lines []string, index int, mode string) []string {
	zeros := []string{}
	ones := []string{}

	for _, line := range lines {
		if strings.Split(line, "")[index] == "0" {
			zeros = append(zeros, line)
		} else {
			ones = append(ones, line)
		}
	}
	return compare(zeros, ones, mode)
}

func compare(zeros []string, ones []string, mode string) []string {
	if mode == "CO2" {
		if len(ones) < len(zeros) {
			return ones
		} else {
			return zeros
		}
	} else {
		if len(ones) >= len(zeros) {
			return ones
		} else {
			return zeros
		}
	}
}

func convertBinaryArrStrToInt(arr []string) int64 {
	val, _ := strconv.ParseInt(strings.Join(arr, ""), 2, 64)
	return val
}

func convertBinaryArrIntToInt(arr []int) int64 {
	val, _ := strconv.ParseInt(arrayToString(arr, ""), 2, 64)
	return val
}
