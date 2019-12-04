import { Clock } from './Clock.js';

// Runs every second | main.js
export function showTaskbarClock(){
  const timeNow = Clock.getTimeNow();
  const timeString = Clock.getDigitalTimeString(timeNow).withoutSeconds();
  document.querySelector('.taskbar-clock').textContent = timeString;
} 

