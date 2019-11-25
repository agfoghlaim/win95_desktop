import { CalendarMonth } from './CalendarMonth.js';
import { Clock } from './Clock.js';

export class DateTimeUI{
  constructor(){

    // set when initMonth called (after html in DOM)
    this.month = undefined;  
    this.clock = undefined;
  }

  static getHtml(){
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
    this.month = new CalendarMonth( name, year, num );
    this.displayMonth();
  }

  initClock(){
    this.clock = new Clock();
    return this.clock;
  }

  // TODO rename, this is displaying calendar stuff specifically
  displayMonth(){
    this.showMonth();
    this.showYear();
    this.populateDaysOfMonth(this.month.getNumDaysInMonth(), this.month.getFirstDayDayOfWeek())
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

  populateDaysOfMonth(numDays, firstDay){
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

  addListeners(){
    const nextBtn = document.querySelector('.next');
    const prevBtn = document.querySelector('.prev');
    const nextYearBtn = document.querySelector('.nextYear');
    const prevYearBtn = document.querySelector('.prevYear');

    nextBtn.addEventListener('click', () => this.handleChangeMonth());
    prevBtn.addEventListener('click', () => this.handleChangeMonth(true));
    nextYearBtn.addEventListener('click', () => this.handleChangeYear(1));
    prevYearBtn.addEventListener('click', () => this.handleChangeYear(-1));
  }

  handleChangeMonth(prev = false){
    const currentMonth = this.getOffsetMonth(prev);
    
    this.month = new CalendarMonth(currentMonth.name, currentMonth.year, currentMonth.num);
    this.displayMonth();
  }

  handleChangeYear(yearOffset){
    const currentMonthNewYear = {
      name: this.month.getMonthName(),
      year: this.month.getYear() +yearOffset,
      num: this.month.getMonth()
    }

    this.month = new CalendarMonth(currentMonthNewYear.name, currentMonthNewYear.year, currentMonthNewYear.num);
    this.displayMonth();
  }

  /* Helpers Below */

  // defaults to next month
  getOffsetMonth(prev=false){

    const yr= this.month.getYear();
    let mt= this.month.getMonth()+1;
    
    if(prev){
       mt = this.month.getMonth()-1;
    }

    const date = new Date(yr, mt);
    return this.nameNumYear(date);
   }

  // returns {name: "December", year: 2019, num: [0... 11]}
  nameNumYear(date){
    const name = date.toLocaleString('en-GB', { month: "long" });
    const num = date.getMonth();
    const year = date.getFullYear();
    return {name, year, num};
  }

}