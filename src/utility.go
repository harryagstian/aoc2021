package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"path"
	"strconv"
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
