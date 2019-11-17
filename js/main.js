import { myFolders } from './content.js';

// init
populateFileSpaces();
populateFiles();


//	draggable
const DRAGPROCESS = {
  html: '',
  inProgress:true,
  droppedSafe:false
};

// So modals can be dragged on Firefox
const LASTDROPCOORDINATES = {
  clientX: 0,
  clientY: 0
};

// clock
setInterval(clock, 1000);

document.addEventListener('DOMContentLoaded', function(){

  // add empty spaces, populate files on resize
  window.addEventListener('resize', () => {

    populateFileSpaces();
    populateFiles();

  });

  // TODO - restructure start-menu html, this is a mess 
  
  // mouse out of menu3 => hide unless mousing into menu-2
  document.querySelector('.start-menu-3').addEventListener('mouseleave', (e) => {
  
    if(!e.target.classList.contains('start-menu-3')) return;
 
    if(!e.relatedTarget.classList.contains('start-menu-2')){
      e.target.classList.remove('show')
    }
   
  });

  // mouse out of menu-2 => unless mousing into menu-3 hide both sub menus
  document.querySelector('.start-menu-2').addEventListener('mouseleave', (e) => {
  
    if(!e.target.classList.contains('start-menu-2')) return;
  
    if(!e.relatedTarget.classList.contains('start-menu-3')){
      e.target.classList.remove('show')
      document.querySelector('.start-menu-3').classList.remove('show')
    }
   
  });

  // show, hide start menu 
  //document.addEventListener('click', closeContextMenu);
  document.addEventListener('click', toggleStartMenu);

  document.querySelector('.left-taskbar').addEventListener('mouseover', (e)=>{
    const el = e.target;

    if(el.classList.contains('with-subitem') ){
      e.target.parentElement.nextElementSibling.classList.add('show');
    } 

    if(el.parentElement.classList.contains('with-subitem')){
      e.target.parentElement.parentElement.nextElementSibling.classList.add('show');
    } 
   
    return;
  })


  // drag files
  const container = document.querySelector('.file-container');
  container.addEventListener('dragstart', dragStart);
  container.addEventListener('dragend', dragEnd); // change class filled empty
  container.addEventListener('dragover', dragOver); // prevent default
  container.addEventListener('drop', dragDrop); // emptySpace
  
  
  // open & close modals
  container.addEventListener('dblclick', openModal);

  const modalContainer = document.querySelector('.modal-container');
  modalContainer.addEventListener('click', closeModal);


  
 

  // drag modals
  document.querySelector('.modal-container').addEventListener('dragstart', dragModal);

   /* problem with Firefox, can't get mouse positions from dragend event, see here https://bugzilla.mozilla.org/show_bug.cgi?id=505521 */
  document.addEventListener('drop', saveMouseCoordinatesAfterEveryDrop);

  document.querySelector('.modal-container').addEventListener('dragend', dropModal);


  
});


function dragModal(e){

  if(!e.target.classList.contains('bar')) return;

  const modal = e.target.dataset.modalno;

  e.dataTransfer.setData('text/plain', null);
  // const img = new Image(); 
  // img.src = 'img/programs.ico'; 
  // e.dataTransfer.setDragImage(img, 10, 10);

}

function saveMouseCoordinatesAfterEveryDrop(e){
  e.preventDefault();
  LASTDROPCOORDINATES.clientX = e.clientX;
  LASTDROPCOORDINATES.clientY = e.clientY
  console.log("LASTDROPCOORDINATES ", LASTDROPCOORDINATES)

}

function dropModal(e){
   e.preventDefault();
   console.log("ended")

  if(!e.target.classList.contains('bar')) return;
  const modalNo = e.target.dataset.modalno;
  const modal = document.querySelector(`.modal-${modalNo}`);

  // modal.style.top = `${e.clientY}px`;
  // modal.style.left = `${e.clientX}px`;
  // use global LASTDROPCOORDINATES because e.clientX, e.clientY not available in Firefox
  modal.style.top = `${LASTDROPCOORDINATES.clientY}px`;
  modal.style.left = `${LASTDROPCOORDINATES.clientX}px`;
  console.log(modalNo, e.clientX, e.clientY)

}

function dragStart(e){
  showDropTargetOutline();

  DRAGPROCESS.html = '';
  if(e.target.matches('img')){
    DRAGPROCESS.droppedSafe = false;
    DRAGPROCESS.html = e.target.parentElement.parentElement.innerHTML;
  }
}

function dragEnd(e){
  e.preventDefault();
  if(DRAGPROCESS.droppedSafe === true){
    e.target.parentElement.parentElement.classList.replace("filledSpace", "emptySpace");
    e.target.parentElement.parentElement.innerHTML = '';	
  }
  hideDropTargetOutline();
}

function dragOver(e){
  e.preventDefault();
}

function dragDrop(e){
  if(e.target.classList.contains('emptySpace') && DRAGPROCESS.html !== ''){
    e.target.innerHTML = DRAGPROCESS.html;
    e.target.classList.replace("emptySpace", "filledSpace");
    DRAGPROCESS.droppedSafe = true;
  }
  e.preventDefault();
}

function  closeModal(e){
  if(!e.target.classList.contains('modal-close')) return;

  const modalNo = e.target.parentElement.dataset.modalno;

  document.querySelector(`.modal-${modalNo}`).classList.remove('show');
}

// TODO check for tiny screens - not enough space for all files case
function getNumFileSpaces(){
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

function openModal(e){
  if(!e.target.matches('img')) return;
  
  document.querySelector( `.${e.target.parentNode.dataset.modal}`)
  .classList.add('show');
}


function getHiddenModalHtml(folderNo){
  const modalContent = myFolders[folderNo].modalContent;

  return `
  <div draggable="true"  style="position:absolute;top:${folderNo}rem; left:${folderNo}rem; "class="modal modal-${folderNo}">

    <div draggable="true"   class="bar" data-modalno=${folderNo}>
      <button class="modal-close">X</button>
    </div>

    <div class="modal-main">
    <p>${modalContent}</p>
    </div>

  </div>`;
}

// populate files
function populateFiles(){
  const spaces = document.querySelectorAll('.space');

  myFolders.forEach( (folder,i) => {

  spaces[i].classList.replace("emptySpace", "filledSpace");
  
  spaces[i].innerHTML = `
    <div draggable="true" class="file ${folder.theClass}" data-modal="${folder.dataModal}" data-modalno=${i} data-context="${folder.contextClass}">

      <img src="img/${folder.img}" alt="">
      <p class="item-p" id="${folder.theClass}">${folder.p}</p>

  </div>`;

  const modal = getHiddenModalHtml(i);
  document.querySelector('.modal-container').innerHTML += modal;
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

    if(!mainMenu.classList.contains('show')){
      menus.forEach(m=>m.classList.remove('show'));
    }

    //add event listener to accessories || can i add above with display none??
  }else{
    menus.forEach(m=>m.classList.remove('show'));
    //menu.classList = 'start-menu';	
  }
}


function clock(){
  let d = new Date() ;
  d.setTime( d.getTime() - new Date().getTimezoneOffset()*60*1000 );
  document.querySelector('.clock').textContent = d.toUTCString().substr(17,5)
} 


