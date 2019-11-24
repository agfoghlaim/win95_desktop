import { desktopIcons } from './content.js';
import { Modal } from './modal.js';
import { Tetris } from './tetris/tetris.js';
import { TimeUI } from './time/timeUI.js';
import { Clock } from './time/clock.js';
import { DesktopIcon } from './desktopicon.js';


document.addEventListener('DOMContentLoaded', () => {

  
  /*
 make sure no unnecesserary listners on modals (Tetris!) if Modal.showDirect() used
  */

  // Taskbar Clock
  setInterval(showTaskbarClock, 1000);

  // init
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

  // Tetris in start menu
  document.querySelector('.menu-tetris').addEventListener('click', launchTetris);

  // Launch Calendar-Clock 
  document.querySelector('.right-taskbar').addEventListener('click', handleDateTimeModal);

});


  function launchTetris(){
    /*
      TODO - make sure only one tetris exists at a time. Maybe remove from DOM when it's closed. Also game doesn't end until current tile collides.
    */

    // Tetris Modal
    const modalContent = Tetris.getHtml();
    const modalConfig = {
      parent: 'modal-container', 
      relatedParent: 'start-item', 
      related: `menu-tetris`,
      content: `${modalContent}`, 
      offset:[5,10],
      img: `Joy.ico`,
      title: `Tetris`
    }
    const tetrisModal = new Modal(modalConfig);

    // const tetrisModal = new Modal('modal-container', 'start-item', `menu-tetris`, `${modalContent}`);
    tetrisModal.showDirect('modal-menu-tetris');

    // Tetris Canvas
    const canvas = document.getElementById('tetris');
    const ctx = canvas.getContext('2d');
    ctx.scale(40, 40);

    // Init Game
    let tetris = new Tetris(ctx);
    
    // Listen for Keyboard Events
    tetris.addKeyboardListeners(tetris);

    //listen for tetris closing (game will stop when current shape collides)
    document.querySelector('.close-btn-menu-tetris').addEventListener('tetrisClosed', (e) => tetris.setGameOver(true), false);

  }

  function getNumFileSpaces(){
    // TODO check for tiny screens - not enough space for all files case
    const minWidth = 150;
    const minHeight = 200;
    const numSpaces = (window.innerWidth / minWidth) * (window.innerHeight / minHeight);

    return Math.round(numSpaces);

  }

  // add file spaces based on current window width, height
  function populateFileSpaces(){
    const filesContainer = document.querySelector('.file-container');
    const noFileSpaces = getNumFileSpaces();
    filesContainer.innerHTML = ``;

    for(let i = 0; i < noFileSpaces; i++){
      filesContainer.innerHTML += `<div class="space space-${i} emptySpace"></div>`;
    }
  }

  // populate files
  function populateFiles(){
  
    const spaces = document.querySelectorAll('.space');

    // TODO cover case where screen is too small to show all files
    desktopIcons.forEach( (icon, i) => {

      let dtIcon = new DesktopIcon(icon.class, icon.dataModal, icon.img, icon.p, i)
    
      spaces[i].classList.replace("emptySpace", "filledSpace");
      spaces[i].innerHTML = dtIcon.getHtml(i);
  
      // only add modals if they don't already exist
      if(!document.querySelector(`.modal-${icon.class}`)){
      
        const modalContent = desktopIcons[`${i}`].modalContent;
        const modalConfig = {
          parent: 'modal-container', 
          relatedParent: 'file-container', 
          related: `${icon.class}`,
          content: `${modalContent}`, 
          offset:[5,10],
          img: `documents.ico`,
          title: `${icon.p}`
        }
        new Modal(modalConfig);
        // new Modal('modal-container', 'file-container', `${icon.class}`, `${modalContent}`);

      }
    
    });
    
  }

  // start menu
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

  function handleDateTimeModal(){
 
     if(document.querySelector(`.modal-clock-p`)){
      document.querySelector(`.modal-clock-p`).classList.add('show');
      return;
    }
   
    const time = new TimeUI();
    const timeHTML = time.getHTML();

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
    const clock = time.initClock();
    const month = time.initMonth();
    time.addListeners(); 

  }



