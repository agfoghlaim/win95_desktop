import { Modal } from '../Modal.js';
import { desktopIcons } from '../content.js';
import { DesktopIcon } from './DesktopIcon.js';

// add file spaces based on current window width, height
export function populateFileSpaces(){
  const filesContainer = document.querySelector('.file-container');
  const noFileSpaces = getNumFileSpaces();
  filesContainer.innerHTML = ``;

  for(let i = 0; i < noFileSpaces; i++){
    filesContainer.innerHTML += `<div class="space space-${i} emptySpace"></div>`;
  }
}

// Desktop Icons
export function populateFiles (){

  desktopIcons.forEach( (icon, i) => {

    let dtIcon = new DesktopIcon(icon.class, icon.dataModal, icon.img, icon.p, i);
    
    addIconToDOM(i, dtIcon);

    // add modal if it doesn't exist
    if(!document.querySelector(`.modal-${icon.class}`)){
      addIconModalToDOM(i, icon );
    }
    
  });
  
}

function getNumFileSpaces(){
  // TODO check for tiny screens - not enough space for all files case
  const minWidth = 150;
  const minHeight = 200;
  const numSpaces = (window.innerWidth / minWidth) * (window.innerHeight / minHeight);

  return Math.round(numSpaces);

}

function addIconToDOM(i, dtIcon){
  const spaces = document.querySelectorAll('.space');
  spaces[i].classList.replace("emptySpace", "filledSpace");
  spaces[i].innerHTML = dtIcon.getHtml(i);
}

function addIconModalToDOM(i, icon){
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
}

