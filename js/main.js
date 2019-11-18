import { desktopIcons } from './content.js';
import { Modal } from './modal.js';
import { Tetris } from './tetris/tetris.js';

// init
populateFileSpaces();
populateFiles();


//	draggable
const FILEDRAG = {
  html: '',
  inProgress:true,
  droppedSafe:false
};

// clock
// TODO - this is old, should use same as clock.js clock
setInterval(clock, 1000);

document.addEventListener('DOMContentLoaded', function(){

  // add empty spaces, populate files on resize
  window.addEventListener('resize', () => {

    populateFileSpaces();
    populateFiles();

  });


  // Show / Hide Start Menu 
  document.addEventListener('click', toggleStartMenu);


  // Drag Files - Listeners
  const container = document.querySelector('.file-container');
  container.addEventListener('dragstart', startFileDrag);
  container.addEventListener('dragend', endFileDrag); 
  container.addEventListener('dragover', dragOver); 
  container.addEventListener('drop', dropFile); 
  

  // Drag Modals - Listeners
  document.querySelector('.modal-container').addEventListener('dragstart', e => Modal.dragModal(e));
  document.querySelector('.modal-container').addEventListener('dragend', e => Modal.dropModal(e));

  /* problem with Firefox, can't get mouse positions from dragend event, see here https://bugzilla.mozilla.org/show_bug.cgi?id=505521 */
  document.addEventListener('drop', e => Modal.saveMouseCoordinatesAfterEveryDrop(e));

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

// Drag Drop Files
function startFileDrag(e){
 
  showDropTargetOutline();
 
  FILEDRAG.html = '';
  FILEDRAG.inProgress=true;
  if(e.target.matches('img')){
    FILEDRAG.droppedSafe = false;
    FILEDRAG.html = e.target.parentElement.parentElement.innerHTML;
  }
}

function endFileDrag(e){
  e.preventDefault();

  if(FILEDRAG.droppedSafe === true){

    e.target.parentElement.parentElement.classList.replace("filledSpace", "emptySpace");
    FILEDRAG.inProgress=false;
    e.target.parentElement.parentElement.innerHTML = '';	
  }

  hideDropTargetOutline();
}

function dragOver(e){
  e.preventDefault();
}

function dropFile(e){
  
  if(!FILEDRAG.inProgress){
    return;
  }

  if(e.target.classList.contains('emptySpace') && FILEDRAG.html !== ''){
    e.target.innerHTML = FILEDRAG.html;
    e.target.classList.replace("emptySpace", "filledSpace");
    FILEDRAG.droppedSafe = true;
  }
  e.preventDefault();
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

  desktopIcons.forEach( (icon,i) => {
    
    // TODO cover case where screen is too small to show all files
    spaces[i].classList.replace("emptySpace", "filledSpace");
  
    spaces[i].innerHTML = `
    <div draggable="true" class="file ${icon.class}" data-modal="${icon.dataModal}" data-modalno=${i} data-context="${icon.contextClass}">

      <img data-modal-class=${icon.class} src="img/${icon.img}" alt="">
      <p class="item-p" id="${icon.class}">${icon.p}</p>

    </div>`;

    // only add modals if they don't already exist
    if(!document.querySelector(`.modal-${icon.class}`)){
    
      const modalContent = desktopIcons[`${i}`].modalContent;

      new Modal('modal-container', 'file-container', `${icon.class}`, `${modalContent}`);

    }
  
  });
}

// show light outline of empty file spaces
function showDropTargetOutline(){
  const emptySpaces = document.querySelectorAll('.emptySpace');
  emptySpaces.forEach(space=>space.classList.add('outline'));
}

function hideDropTargetOutline(){
  const spaces = document.querySelectorAll('.space');

  spaces.forEach(space => {
    if(space.classList.contains('outline')){
      space.classList.remove('outline');
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


