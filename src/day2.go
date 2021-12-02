package main

import (
	"fmt"
	"strings"
)

func day2() {
	// lines, _ := readLines("day2sample.txt")
	lines, _ := readLines("day2.txt")
	location := []int{0, 0}
	for _, v := range lines {
		arr := strings.Split(v, " ")
		direction := arr[0]
		length := stringToInteger(arr[1])

		switch direction {
		case "forward":
			location[1] = location[1] + length

		case "up":
			location[0] = location[0] - length

		case "down":
			location[0] = location[0] + length
		}
	}
	fmt.Printf("%d\n", location[0]*location[1])

	aim := 0
	location = []int{0, 0}
	for _, v := range lines {
		arr := strings.Split(v, " ")
		direction := arr[0]
		length := stringToInteger(arr[1])

		switch direction {
		case "forward":
			location[1] = location[1] + length
			location[0] = location[0] + (aim * length)

		case "up":
			aim = aim - length

		case "down":
			aim = aim + length
		}
	}
	fmt.Printf("%d\n", location[0]*location[1])
}
