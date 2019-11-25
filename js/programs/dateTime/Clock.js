export class Clock{
  constructor(){
    this.createClockFace();
    this.startClock = setInterval(() => this.updateClock(), 1000);
    this.now = undefined;
    
    this.updateTimeNow();
  }


  stopClock(){
 
    clearInterval(this.startClock);
  }

  updateTimeNow(){
    this.now = this.constructor.getTimeNow();
  }

  static getTimeNow(){
    const now = new Date();
    return {
      second: +now.getSeconds(),
      minute: +now.getMinutes(),
      hour: +now.getHours()
    }
  }

  updateClock(){
    this.updateTimeNow();
    this.setClockFace();
    this.setDigitalClock()
  }

  // to TimeUI
  createClockFace(){

    let oneMinute = `<div class="oneMin"></div>`;
    const clockface = document.querySelector('.clockface');
  
    for(let i = 0; i < 60; i ++){
      clockface.innerHTML += oneMinute;
    }
  
    let minutes = document.querySelectorAll('.oneMin');
    
    let angle= (360 / 60);
    let rotation = 0;
    minutes.forEach((q,i)=>{
  
      if(i % 5 === 0){
        q.style.cssText = `
        display: block;
        border-radius:8%;
        box-shadow: -0.03125rem -0.03125rem 0.08rem 0.03125rem #00f5f5;
        width:0.375rem;
        height:0.375rem;
        background:#008080;
        position: absolute;
        top: 6.0625rem;
        left: 6.0625rem;
        transform: rotate(${rotation}deg ) translate(6.25rem) rotate(${rotation * -1}deg);
        `;
  
      }else{
        q.style.cssText = `
        display: block;
        border-radius:8%;
        box-shadow: inset 0.03125rem 0.03125rem 0.125rem 0px rgba(0,0,0,0.9);
        width:0.25rem;
        height:0.25rem;
        background:#f1f1f1;
        position: absolute;
        top: 6.125rem;
        left: 6.125rem;
        transform: rotate(${rotation}deg ) translate(6.25rem) rotate(${rotation * -1}deg);
        `;
      }
      rotation += angle;
    
    });
  }

  setDigitalClock(){
    
    const digitalTime = this.constructor.getDigitalTimeString(this.now).withSeconds();
 
    document.querySelector('.digital-time').textContent = digitalTime;
  }

 
  setClockFace(){
    const secondHand = document.querySelector('.hand-sec');
    const minuteHand = document.querySelector('.hand-min');
    const hourHand = document.querySelector('.hand-hour');
   
    const secondDegrees = Math.round((this.now.second / 60) * 360);
    const minuteDegrees = Math.round((this.now.minute / 60) * 360);
    let hourDegrees = Math.round((this.now.hour / 12) * 360);
   
    // move hour hand a bit every 15 mins - This isn't right FIX
    this.now.minute > 45 ? hourDegrees += 24 :
    this.now.minute > 30 ? hourDegrees += 18 : 
    this.now.minute > 15 ? hourDegrees += 12 : 
    this.now.minute < 15 ? hourDegrees += 6 : hourDegrees;
   
    secondHand.style.transform = `rotate(${secondDegrees}deg)`;
    minuteHand.style.transform = `rotate(${minuteDegrees}deg)`;
    hourHand.style.transform = `rotate(${hourDegrees}deg)`;
    
    this.constructor.getDigitalTimeString(this.now);
  }

  // static so it can be used for main taskbar clock without Clock instance
  static getDigitalTimeString(now = this.now){
    const hourStr = String(now.hour).padStart(2, '0');
    const minuteStr = String(now.minute).padStart(2, '0');
  
    return {
      withSeconds: () => {
        const secondStr = String(now.second).padStart(2, '0');
        return `${hourStr}:${minuteStr}:${secondStr}`;
      },
      withoutSeconds: () =>  `${hourStr}:${minuteStr}`
    }
  }

 
}



