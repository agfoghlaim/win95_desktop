import { TimeUI } from './TimeUI.js';
import { Clock } from './Clock.js';
import { Modal } from '../Modal.js';

// This runs every second...
export function showTaskbarClock(){
  const timeNow = Clock.getTimeNow();
  const timeString = Clock.getDigitalTimeString(timeNow).withoutSeconds();
  document.querySelector('.taskbar-clock').textContent = timeString;
} 

// DateTime Modal
export function handleDateTimeModal(){
  // show if it already exists
  if(document.querySelector(`.modal-clock-p`)){
    document.querySelector(`.modal-clock-p`).classList.add('show');
    return;
  }
  
  // or create it
  const timeUI = new TimeUI();
  const timeHTML = timeUI.getHTML();

  const modalConfig = {
    parent: 'modal-container', 
    relatedParent: 'right-taskbar', 
    related: `clock-p`,
    content: `${timeHTML}`, 
    offset:[5,10],
    img: ``,
    title: `Date/Time Properties`
  }
  const timeModal = new Modal(modalConfig);


  timeModal.showDirect('modal-clock-p');
  timeUI.initClock();
  timeUI.initMonth();
  timeUI.addListeners(); 

}