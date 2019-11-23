
import { Month } from './calendar.js';
import { Clock } from './clock.js';

export class TimeUI{
  constructor(){

    // set when initMonth called (after html in DOM)
    this.month = undefined;  
    this.clock = undefined;
  }

  getHTML(){
    return `
    <div class="insideDiv">
      
            <div class="calendar">
      
              <div class="insideRidge insideRidgeCalendar">
      
                <div class="monthYearDiv" >      
                  
                  <div class="monthYearInput monthInput">
                    <div class="monthname"></div>
                    <div class="upDownArrowsDiv">
                        <button class="next"></button>
                        <button class="prev"></button>
                    </div>
                  </div>
                  
                  <div class="monthYearInput yearInput">
                    <div class="year"></div>
                    <div class="upDownArrowsDiv">
                        <button class="nextYear"></button>
                        <button class="prevYear"></button>
                    </div>
                  </div> 

                </div>
      
                <div class="calendar-window">   
                  <ul class="weekdays">
                    <li>Mo</li>
                    <li>Tu</li>
                    <li>We</li>
                    <li>Th</li>
                    <li>Fr</li>
                    <li>Sa</li>
                    <li>Su</li>
                  </ul>
                
                  <ul class="days"></ul>
                </div><!-- end cal window -->
              </div><!-- end cal window -->
             
            </div> 
      
            <div class="clock">
              <div class="insideRidge insideRidgeClock">
                <div class="clockface">
                  <div class="hand hand-sec">
                      <img src="img/secondhand.png" alt="">
                  </div>
                  
                  <div class="hand hand-min">
                    <img src="img/minutehand.png" alt="">
                  </div>
    
                  <div class="hand hand-hour">
                    <img src="img/hourhand.png" alt="">
                  </div>
                  <div class="hand hand-sec"></div>
                  
                </div>
          
                <div class="digitalclock">
                   
                        <div class="digital-time">1 o clock</div>
                        <div class="upDownArrowsDiv">
                            <button class="next"></button>
                            <button class="prev"></button>
                        </div>
                      
                </div>
              </div> 
            </div>
      
            <div class="timezone">
              <p class="timezoneText">Current time Zone: Irish Time</p>
            </div>
      
          </div>`;
  }

  initMonth(){
    const date = new Date();
    const { name, num, year } = this.nameNumYear(date);
    this.month=  new Month( name, year, num );
    this.display();
  }

  initClock(){
    this.clock = new Clock();
  }

  // TODO rename, this is displaying calendar stuff specifically
  display(){
    this.showMonth();
    this.showYear();
    this.populateDays(this.month.getNumDaysInMonth(), this.month.getFirstDayDayOfWeek())
  }

  showMonth(){
    this.displayText('.monthname', this.month.getMonthName());
  }

  showYear(){
    this.displayText('.year', this.month.getYear());
  }

  displayText(selector, data){
    document.querySelector(`${selector}`).textContent = data;
  }

  populateDays(numDays, firstDay){
    // add blank <li> for each day of week before first of month
    let numBlanks = this.month.getNumBlanks(firstDay);
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

  // returns monthname, year & month number [0...11] of date passed
  nameNumYear(date){
    const name = date.toLocaleString('en-GB', { month: "long" });
    const num = date.getMonth();
    const year = date.getFullYear();
    return {name, year, num};
  }

  addListeners(){
    const nextBtn = document.querySelector('.next');
    const prevBtn = document.querySelector('.prev');
    const nextYearBtn = document.querySelector('.nextYear');
    const prevYearBtn = document.querySelector('.prevYear');

    nextBtn.addEventListener('click', () => this.nextMonth());
    prevBtn.addEventListener('click', () => this.prevMonth());
    nextYearBtn.addEventListener('click', () => this.nextYear());
    prevYearBtn.addEventListener('click', () => this.prevYear());
  }

  nextMonth(e){
    const currentMonth = this.getCurrentMonth(this.month);
    this.month = new Month(currentMonth.name, currentMonth.year, currentMonth.num);
    this.display();
  }

  prevMonth(){
    const currentMonth = this.getCurrentMonth(this.month, true);
    
    this.month = new Month(currentMonth.name, currentMonth.year, currentMonth.num);
    this.display();
  }

  nextYear(){
      const currentMonthNextYear = {
        name: this.month.getMonthName(),
        year: this.month.getYear() +1,
        num: this.month.getMonth()
      }
      
      this.month = new Month(currentMonthNextYear.name, currentMonthNextYear.year, currentMonthNextYear.num);
      this.display();
  }

  prevYear(){
      const currentMonthPrevYear = {
        name: this.month.getMonthName(),
        year: this.month.getYear() -1,
        num: this.month.getMonth()
      }
      
      this.month = new Month(currentMonthPrevYear.name, currentMonthPrevYear.year, currentMonthPrevYear.num);
    this.display();

  }

  getCurrentMonth(month, prev=false){
  
   // get month, yr from current instance of month
     const yr= this.month.getYear();
    let mt= this.month.getMonth()+1;
    
    if(prev){
       mt = this.month.getMonth()-1;
     }

     const date = new Date(yr, mt);
     return this.nameNumYear(date);
    
   }
}