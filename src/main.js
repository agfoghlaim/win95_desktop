import { Windo } from './js/windos/Windo.js';
import { DesktopIcon } from './js/desktopIcons/DesktopIcon.js';

import { toggleStartMenu } from './js/startMenu/startMenuUtil.js';
import { closeProgramWindo, addLaunchProgramListener } from './js/programs/programUtil.js';
import { showTaskbarClock } from './js/programs/dateTime/dateTimeUtil.js';
import { initDesktopIcons, addLaunchExplorerListener } from './js/desktopIcons/desktopIconUtil.js';
import { initStartMenu } from './js/startMenu/startMenuUtil.js';
import { removeTaskItemOnClose } from './js/tasks/taskUtil.js';
import { addContextMenuFileListeners, clickAnywhereToCloseContextMenu } from './js/programs/wordpad/wordpadUtil.js';

import './css/px_sans_nouveaux.woff';
import './css/style.css';
import './css/clock.css';
import  './css/calculator.css';
import './css/tetris.css';
import './css/wordpad.css';



document.addEventListener('DOMContentLoaded', () => {

 
  /*
   Init 
  */ 

  
  // Taskbar Clock 
  setInterval( showTaskbarClock, 1000 );

  // A work in progress...
  initStartMenu();

  // Desktop Icons & spaces
  initDesktopIcons();
  

  /* 
  Add Listeners
  */ 


  // Desktop Icons & spaces (re-populate on resize)
  window.addEventListener('resize', () => initDesktopIcons());

  // Re-add Explorer listeners on dragend (overwritten)
  window.addEventListener('dragend', () => addLaunchExplorerListener());

  // Toggle Start Menu | ( the rest is CSS )
  document.addEventListener('click', toggleStartMenu);

  // Close context menu
  document.addEventListener('click', clickAnywhereToCloseContextMenu);

  // Drag DesktopIcons 
  DesktopIcon.addDragListners();

  // Drag Windos | Drag ProgramWindos
  Windo.addDragListeners();

  // Launch program in ProgramWindo | programUtil.js
  addLaunchProgramListener(); 

  // REMOVE ProgramWindo | programUtil.js
  document.querySelector('.program-windo-container').addEventListener('click', closeProgramWindo );

  // If tetris is open before clock, the tetris canvas is lost. 
  document.querySelector('.special-tetris-container-to-getaround-bug-i-cannot-fix').addEventListener('click', closeProgramWindo );


  /* 
  Listen For... 
  */ 


  // Task.js dispatchs 'minimisedProgram' event | add launchProgram listener to new taskBar item
  document.querySelector('.mid-taskbar')
  .addEventListener('minimisedProgram', (e) => { addLaunchProgramListener(e) });
  
  // Task.js dispatchs 'minimisedExplorer' event | add launchExplorer listener to new taskBar item
  document.querySelector('.mid-taskbar')
  .addEventListener('minimisedExplorer', (e) => { addLaunchExplorerListener(e) });

  // programUtil.js dispatchs 'programClosed' event | remove taskbar item
  document.querySelector('.mid-taskbar')
  .addEventListener('programClosed', (e) => { removeTaskItemOnClose(e) });
  
  // desktopIconUtil.js dispatchs 'explorerClosed' event | remove taskbar item
  document.querySelector('.mid-taskbar')
  .addEventListener('explorerClosed', (e) => { removeTaskItemOnClose(e) });

  // ( 'Launch' Explorer Windo is called in desktopIconUtil.js )

  // Listen for theOnlyFolderOpened | (desktopiconUtil dispatches)
  document.addEventListener('theOnlyFolderOpened', (e) => { 

    addLaunchProgramListener(e); 
    addContextMenuFileListeners(e); })

});






