export class CalendarMonth {
	constructor(month, year, monthNum) {
		this.monthNo = monthNum; //10=nov, 0=jan
		this.month = month; //'Novenber'etc
		this.year = year;
		this.numDaysInMonth = this.getNumDaysInMonth();
		this.firstDayInMonth = this.getFirstDayDayOfWeek();
	}

	getMonth() {
		return this.monthNo;
	}

	getMonthName() {
		return this.month;
	}

	getYear() {
		return this.year;
	}

	getNumDaysInMonth() {
		// use monthNo+1 to get last day of current month
		return new Date(this.year, this.monthNo + 1, 0).getDate();
	}

	// day of week of first of the month - need blank entry for each
	getFirstDayDayOfWeek() {
		const first_day = new Date(this.year, this.monthNo, 1);
		return first_day.getDay();
	}

	getNumBlanks(d) {
		switch (d) {
			case 0:
				return 6;
			case 1:
				return 0;
			case 2:
				return 1;
			case 3:
				return 2;
			case 4:
				return 3;
			case 5:
				return 4;
			case 6:
				return 5;
		}
	}
}
