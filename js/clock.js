
document.addEventListener('DOMContentLoaded', function(){

  createClockFace();

})

function createClockFace(){

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


function setTime(){
  const secondHand = document.querySelector('.hand-sec');
  const minuteHand = document.querySelector('.hand-min');
  const hourHand = document.querySelector('.hand-hour');

  const now = new Date();

  const second = now.getSeconds();
  const minute = now.getMinutes();
  const hour = now.getHours();
 
  const secondDegrees = (second / 60) * 360;
  const minuteDegrees = (minute / 60) * 360;
  let hourDegrees = (hour / 12) * 360;

  // move hour hand a bit every 15 mins
  minute > 45 ? hourDegrees += 24 :
  minute > 30 ? hourDegrees += 18 : 
  minute > 15 ? hourDegrees += 12 : 
  minute < 15 ? hourDegrees += 6 : hourDegrees;
 
  secondHand.style.transform = `rotate(${secondDegrees}deg)`;
  minuteHand.style.transform = `rotate(${minuteDegrees}deg)`;
  hourHand.style.transform = `rotate(${hourDegrees}deg)`;


}

setInterval(setTime, 1000);
