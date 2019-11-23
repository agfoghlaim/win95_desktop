import { desktopIcons } from './content.js';
import { Modal } from './modal.js';
import { Tetris } from './tetris/tetris.js';
import { DesktopIcon } from './desktopicon.js';


 

  document.addEventListener('DOMContentLoaded', () => {
     // clock
  // TODO - this is old, should use same as clock.js clock
  setInterval(clock, 1000);
  // init
  populateFileSpaces();
  populateFiles();
    // add empty spaces, populate files on resize
    window.addEventListener('resize', () => {

      populateFileSpaces();
      populateFiles();
      //DesktopIcon.addListners();

    });


    // Start Menu 
    document.addEventListener('click', toggleStartMenu);


    // Drag Files 
    DesktopIcon.addListners();

    // Modals 
    Modal.addListeners();


    // Tetris in start menu
    document.querySelector('.menu-tetris').addEventListener('click', launchTetris);

  });


  function launchTetris(){

    // Tetris Modal
    const modalContent = Tetris.getHtml();
    const tetrisModal = new Modal('modal-container', 'start-item', `menu-tetris`, `${modalContent}`);
    tetrisModal.showDirect('modal-menu-tetris');

    // Tetris Canvas
    const canvas = document.getElementById('tetris');
    const ctx = canvas.getContext('2d');
    ctx.scale(40,40);

    // Init Game
    let tetris = new Tetris(ctx);
    
    // Listen for Keyboard Events
    tetris.addKeyboardListeners(tetris);

    //listen for tetris closing (game will stop when current shape collides... that's acceptable!)
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
    // will be new DeskTopIcon() for each

    desktopIcons.forEach( (icon,i) => {

      let dticon = new DesktopIcon(icon.class, icon.dataModal, icon.img, icon.p, i)
    
      spaces[i].classList.replace("emptySpace", "filledSpace");
      spaces[i].innerHTML = dticon.getHtml(i);
  
      // only add modals if they don't already exist
      if(!document.querySelector(`.modal-${icon.class}`)){
      
        const modalContent = desktopIcons[`${i}`].modalContent;

        new Modal('modal-container', 'file-container', `${icon.class}`, `${modalContent}`);

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

  function clock(){
    let d = new Date() ;
    d.setTime( d.getTime() - new Date().getTimezoneOffset()*60*1000 );
    document.querySelector('.clock').textContent = d.toUTCString().substr(17,5)
  } 


