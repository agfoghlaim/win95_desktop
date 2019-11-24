import { Modal } from './Modal.js';
import { TimeUI } from './time/TimeUI.js';
import { Clock } from './time/Clock.js';
import { DesktopIcon } from './desktopIcons/DesktopIcon.js';
import { launchTetris } from './tetris/tetrisUtil.js';
import { populateFiles,  populateFileSpaces} from './desktopIcons/desktopIconUtil.js';

document.addEventListener('DOMContentLoaded', () => {

  
  /*
 make sure no unnecesserary listners on modals (Tetris!) if Modal.showDirect() used
  */

  // Taskbar Clock 
  // TODO - shouldn't need to go every second - dispatch on min change in Clock?
  setInterval(showTaskbarClock, 1000);

  // init Desktop Icons
  populateFileSpaces();
  populateFiles();

  // add empty spaces, populate files on resize
  window.addEventListener('resize', () => {
    populateFileSpaces();
    populateFiles();
    
  });

  // Start Menu 
  document.addEventListener('click', toggleStartMenu);

  // Drag Files 
  DesktopIcon.addListners();

  // Modals 
  Modal.addListeners();

  // Launch Tetris 
  document.querySelector('.menu-tetris').addEventListener('click', launchTetris);

  // Launch Calendar-Clock 
  document.querySelector('.right-taskbar').addEventListener('click', handleDateTimeModal);

});



  // Start Menu
  function toggleStartMenu(e){
    if( e.target.classList.contains('start-menu') ||
      e.target.classList.contains('menu-item') || 
      e.target.classList.contains('menu-item-p')){
      return;
    }

    const mainMenu = document.querySelector('.start-menu');
    const menus = document.querySelectorAll('.start-menu');
    if(e.target.classList.contains('start-btn')){
      mainMenu.classList.toggle('show');
    }else{
      menus.forEach(m=>m.classList.remove('show'));
    }
  }

  function showTaskbarClock(){
    const timeNow = Clock.getTimeNow();
    const timeString = Clock.getDigitalTimeString(timeNow).withoutSeconds();
    document.querySelector('.taskbar-clock').textContent = timeString;
  } 

  // DateTime Modal
  function handleDateTimeModal(){
    
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



