import { DateTimeUI } from './DateTimeUI.js';
import { Clock } from './Clock.js';
import { createProgramModalAndShow } from '../programUtil.js';


/*
onProgramOpen: passed to Program constructor, contains 'program' specific stuff that needs to happen on init

-onProgramClose: passed to Program constructor, contains 'program' specific stuff that needs to happen on close 
*/


// DateTime Modal
export function launchDateTime(){

  // create instance of whatever is going inside the Program modal
  const timeUI = new DateTimeUI();

  
  const onProgramOpen = () => {
    timeUI.initClock();
    timeUI.initMonth();
    timeUI.addListeners(); 
  }

 
  const onProgramClose = () => {
  timeUI.clock.stopClock();
  }

  createProgramModalAndShow(DateTimeUI, timeUI, 'dateTime',  onProgramOpen, onProgramClose);
}


// This runs every second...
export function showTaskbarClock(){
  const timeNow = Clock.getTimeNow();
  const timeString = Clock.getDigitalTimeString(timeNow).withoutSeconds();
  document.querySelector('.taskbar-clock').textContent = timeString;
} 

