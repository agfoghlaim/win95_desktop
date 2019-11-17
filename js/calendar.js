class Month{

  constructor(month, year, monthNum){
    this.monthNo = monthNum;//10=nov, 0=jan
    this.month= month;//'Novenber'etc
    this.year = year;
    this.numDaysInMonth = this.getNumDaysInMonth();
    this.firstDayInMonth = this.getFirstDayDayOfWeek();
    this.display();
  }

  getMonth(){
    return this.monthNo;
  }

  getMonthName(){
    return this.month;
  }

  getYear(){
    return this.year;
  }

  display(){
    this.showMonth();
    this.showYear();
    UI.populateDays(this.numDaysInMonth, this.firstDayInMonth)
  }

  showMonth(){
    UI.displayText('.monthname', this.month);
  }

  showYear(){
    UI.displayText('.year', this.year);
  }

  getNumDaysInMonth(){
    // use monthNo+1 to get last day of current month
    return (new Date(this.year, this.monthNo+1, 0).getDate());
  }

  // day of week of first of the month - need blank entry for each
  getFirstDayDayOfWeek(){
    const first_day = new Date(this.year, this.monthNo, 1);
    return first_day.getDay();
  }

  static getNumBlanks(d){
    switch(d){
      case 0: return 6;
      case 1: return 0;
      case 2: return 1;
      case 3: return 2;
      case 4: return 3;
      case 5: return 4;
      case 6: return 5;
    }
  }
}

class UI{

  static displayText(selector, data){
    document.querySelector(`${selector}`).textContent = data;
  }

  static populateDays(numDays, firstDay){
    
    // add blank <li> for each day of week before first of month
    let numBlanks = Month.getNumBlanks(firstDay);
    let blankHtml = ``;
    for(let i = 0; i<numBlanks; i++){
      blankHtml += `<li></li>`;
    }


    let html = `${blankHtml}`;
    for(let i = 1; i<=numDays;i++){
      html += `<li class="notBlank">${i}</li>`;
      document.querySelector('.days').innerHTML =  html;
    }
    
  }
}

document.addEventListener('DOMContentLoaded', function(){

  // create instance of month
  let month = initMonth();

  // next month listener
  document.querySelector('.next').addEventListener('click', function(){
    const currentMonth = getCurrentMonth(month);
    month = new Month(currentMonth.name, currentMonth.year, currentMonth.num);
  })

  // prev month listener
  document.querySelector('.prev').addEventListener('click', function(){
    const currentMonth = getCurrentMonth(month, true);
    console.log(currentMonth)
    month = new Month(currentMonth.name, currentMonth.year, currentMonth.num);
  })

  // next year listener
  document.querySelector('.nextYear').addEventListener('click', function(){
  
    const currentMonthNextYear = {
      name: month.getMonthName(),
      year: month.getYear() +1,
      num: month.getMonth()
    }
    
    month = new Month(currentMonthNextYear.name, currentMonthNextYear.year, currentMonthNextYear.num);
  })

  // prev year listener
  document.querySelector('.prevYear').addEventListener('click', function(){
    
    const currentMonthPrevYear = {
      name: month.getMonthName(),
      year: month.getYear() -1,
      num: month.getMonth()
    }
    
    month = new Month(currentMonthPrevYear.name, currentMonthPrevYear.year, currentMonthPrevYear.num);
  })

  
})

function initMonth(){
  const date = new Date();
  const { name, num, year } = nameNumYear(date);

  return new Month( name, year, num );
}

function getCurrentMonth(month, prev=false){
  // get month, yr from current instance of month
  const yr= month.getYear();
  let mt= month.getMonth()+1;
  
  if(prev){
    mt = month.getMonth()-1;
  }

  const date = new Date(yr, mt);
  return nameNumYear(date);
  
}

// returns monthname, year & month number [0...11] of date passed
function nameNumYear(date){
  const name = date.toLocaleString('en-GB', { month: "long" });
  const num = date.getMonth();
  const year = date.getFullYear();
  return {name, year, num};
}














