function checkValidPartTimeDayShift(shift) {
	var isValid = true;
	var consecutive = 0;
	var count = 0;

	while (shift > 0) {
		if (shift & 1)  {
			consecutive++;
			count++;
		} else {
			if (consecutive > 4) {
				isValid = false;
				break;
			}
			consecutive = 0;
		}
		shift = shift >>> 1;
	}
	return {
		isValid: isValid,
		numHours: count
	};
}

var x = []
for (var i = 0; i < 4096; i++ ) {
  var res = checkValidPartTimeDayShift(i);
  if (res.isValid) {
    x.append(i)
  }
}
console.log(x)



function checkValidFullTimeDayShift(shift) {
	if (shift == 495 || shift == 990 || shift == 1980 || shift == 3960) {
		return true;
	}
	return false;
}

// wws is assumped to be a list of length 7
function checkValidPartTimeWeekWorkSchedule(wws) {
	if (wws.length != 7) {
		return false;
	}

	var totalHours = 0;
	for (var i = 0; i < 7; i++) {
		var checkDay = checkValidPartTimeDayShift(wws[i]);
		if (!checkDay.isValid) {
			return false;
		}

		totalHours += checkDay.numHours;
	}

	if (totalHours < 10 || totalHours > 48) {
		return false;
	}

	return true;
}

function checkValidFullTimeWeekWorkSchedule(wws) {
	if (wws.length != 7) {
		return false;
	}

	var numOffDay = 0;
	var prevOffDay = -1;
	for (var i = 0; i < 7; i++) {
		if (wws[i] != 0) {
			if (!checkValidFullTimeDayShift(wws[i])) {
				return false;
			}
		} else {
			if (numOffDay == 0) {
				numOffDay++;
				prevOffDay = i;
			} else if (numOffDay >= 2) {
				return false;
			} else {
				if (prevOffDay + 1 == i) {
					numOffDay++;
				} else {
					return false;
				}
			}
		}
	}

	return true;
}