import { Windo } from './windos/Windo.js';
import { DesktopIcon } from './desktopIcons/DesktopIcon.js';
import { launchTetris } from './programs/tetris/tetrisUtil.js';
import { launchDateTime, showTaskbarClock } from './programs/dateTime/dateTimeUtil.js';
import { populateFiles,  populateFileSpaces} from './desktopIcons/desktopIconUtil.js';

document.addEventListener('DOMContentLoaded', () => {

  // Taskbar Clock 
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
  DesktopIcon.addDragListners();

  // Drag Modals 
  Windo.addDragListeners();

  // Launch Tetris 
  document.querySelector('.menu-tetris').addEventListener('click', launchTetris);

  // Launch Calendar-Clock 
  document.querySelector('.right-taskbar').addEventListener('click', launchDateTime);

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





