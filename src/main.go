package main

import (
	"flag"
	"fmt"
	"time"
)

func main() {
	start := time.Now()

	day := flag.Int("day", time.Now().Day(), "run solution for day n")
	sample := flag.Bool("sample", false, "run sample file instead")
	flag.Parse()

	fmt.Printf("Running solution for day %d\n", *day)
	switch *day {
	// is there a better way to iterate over this..?
	case 1:
		day1(*day, *sample)
	case 2:
		day2(*day, *sample)
	case 3:
		day3(*day, *sample)
	default:
		fmt.Println("No solution for this day yet")
	}

	fmt.Printf("Program took %s\n", time.Since(start))
}
