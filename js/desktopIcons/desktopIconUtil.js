import { Windo } from '../windos/Windo.js';
import { myDocuments } from '../content.js';
import { DesktopIcon } from './DesktopIcon.js';

export function initDesktopIcons(){
  populateFileSpaces();
  populateFiles();

  // add file spaces based on current window width, height
  function populateFileSpaces(){

    const filesContainer = document.querySelector('.file-container');
    const noFileSpaces = getNumFileSpaces();
    filesContainer.innerHTML = ``;

    for(let i = 0; i < noFileSpaces; i++){
      filesContainer.innerHTML += `<div class="space space-${i} emptySpace"></div>`;
    }

    // helper | populateFileSpaces 
    function getNumFileSpaces(){
      // TODO check for tiny screens - not enough space for all files case
      const minWidth = 150;
      const minHeight = 200;
      const numSpaces = (window.innerWidth / minWidth) * (window.innerHeight / minHeight);
      return Math.round(numSpaces);
    }
    
  }

  // Desktop Icons
  function populateFiles (){

    myDocuments.forEach( (icon, i) => {

      const dtIcon = new DesktopIcon(icon.classNameToOpen, icon.windoClassName, icon.img, icon.title, i);
      
      addIconToDOM(i, dtIcon);

      // add modal if it doesn't exist
      if(!document.querySelector(`.modal-${icon.docClass}`)){
        addIconModalToDOM(i, icon);
      }
      
    });

    // helper | populateFiles
    function addIconToDOM(i, dtIcon){
      const spaces = document.querySelectorAll('.space');
      spaces[i].classList.replace("emptySpace", "filledSpace");
      spaces[i].innerHTML = dtIcon.getHtml(i);
    }

    // helper | populateFiles
    function addIconModalToDOM(i, icon){
      new Windo(icon);
    }
  }
}








