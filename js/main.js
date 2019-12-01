import { Windo } from './windos/Windo.js';
import { DesktopIcon } from './desktopIcons/DesktopIcon.js';

import { toggleStartMenu } from './startMenu/startMenuUtil.js';
import { launchProgram, closeProgramWindo } from './programs/programUtil.js';
import { showTaskbarClock } from './programs/dateTime/dateTimeUtil.js';
import { initDesktopIcons } from './desktopIcons/desktopIconUtil.js';
import { initStartMenu } from './startMenu/startMenuUtil.js';

document.addEventListener('DOMContentLoaded', () => {


  // init | Taskbar Clock 
  setInterval( showTaskbarClock, 1000 );

  // init | A work in progress...
  initStartMenu();

  // init |  Desktop Icons & spaces
  initDesktopIcons();

  
  // Listener | Desktop Icons & spaces (re-populate on resize)
  window.addEventListener('resize', () => initDesktopIcons());

  // Listener | Toggle Start Menu | ( the rest is CSS )
  document.addEventListener('click', toggleStartMenu);

  // Listeners | Drag DesktopIcons 
  DesktopIcon.addDragListners();

  // Listeners | Drag Windos | Drag ProgramWindos
  Windo.addDragListeners();


  // 'Launch' document modal
  // document.querySelectorAll('.launchExplorer').forEach(el => el.addEventListener('click', launchExplorer));

  // Launch program in ProgramWindo | programUtil.js
  document.querySelectorAll('.launch-program').forEach(el => el.addEventListener('click', launchProgram));

  // REMOVE ProgramWindo | programUtil.js
  document.querySelector('.program-windo-container').addEventListener('click', closeProgramWindo );



  // TEMP? - If tetris is open before clock, the tetris canvas is lost. 
  document.querySelector('.special-tetris-container-to-getaround-bug-i-cannot-fix').addEventListener('click', closeProgramWindo );


});






