package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"path"
	"strconv"
	"strings"
)

var currentPart = 0

// readLines reads a whole file into memory
// and returns a slice of its lines.
func readLines(filepath string) ([]string, error) {
	file, err := os.Open(path.Join("inputs", filepath))

	if err != nil {
		return nil, err
	}
	defer file.Close()

	var lines []string
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		lines = append(lines, scanner.Text())
	}
	return lines, scanner.Err()
}

func inputReaderWrapper(day int, sample bool) []string {
	sampleStr := "sample"

	if !sample {
		sampleStr = ""
	}

	lines, err := readLines(fmt.Sprintf("day%d%s.txt", day, sampleStr))

	if err != nil {
		log.Fatal(err)
	}

	return lines
}

func stringToInteger(s string) int {
	i, err := strconv.Atoi(s)

	if err != nil {
		log.Fatal(err)
	}

	return i
}

func printSolution(value interface{}) {
	fmt.Printf("Part %d: %v\n", currentPart, value)
	currentPart = currentPart + 1
}

func arrayToString(a []int, delim string) string {
	return strings.Trim(strings.Replace(fmt.Sprint(a), " ", delim, -1), "[]")
}

func sliceAtoi(sa []string) ([]int, error) {
	si := make([]int, 0, len(sa))
	for _, a := range sa {
		i, err := strconv.Atoi(strings.TrimSpace(a))
		if err != nil {
			return si, err
		}
		si = append(si, i)
	}
	return si, nil
}
