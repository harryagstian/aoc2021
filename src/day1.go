package main

func day1(day int, sample bool) {
	lines := inputReaderWrapper(day, sample)

	current := 0
	increase := 0
	// part 1
	for _, strValue := range lines {
		new := stringToInteger(strValue)

		if current == 0 {
			current = new
		}
		if new > current {
			increase = increase + 1
		}
		current = new
	}
	printSolution(increase)

	// part 2
	increase = 0
	current = 0
	for index, _ := range lines {
		if index > len(lines)-3 {
			break
		}
		new := 0
		for i := 0; i < 3; i++ {
			new = new + stringToInteger(lines[index+i])
		}

		if current == 0 {
			current = new
		}
		if new > current {
			increase = increase + 1
		}
		current = new
	}
	printSolution(increase)
}
