import { Windo } from '../windos/Windo.js';
import { myDocuments } from '../content.js';
import { DesktopIcon } from './DesktopIcon.js';

export function initDesktopIcons(){
  populateFileSpaces();
  populateFiles();

  // Listener to launch Exlporer Windo | happens on init and resize
  document.querySelectorAll('.launchExplorer').forEach(el => el.addEventListener('click', launchExplorer));

 

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
      // if(!document.querySelector(`.modal-${icon.docClass}`)){
      //   addIconModalToDOM(i, icon);
      // }
      
      
      
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

// Event Handler | click '.desktop-icon-img' | main.js
function launchExplorer(e){

  if(!e.target.classList.contains('launchExplorer') && !e.target.parentElement.classList.contains('launchExplorer')) return;
  const classNameToOpen = e.target.dataset.modalClass || e.target.parentElement.dataset.modalClass;

  // Check if already exists
  if( document.querySelector(`.modal-${classNameToOpen}`) ){
    console.log("should show")
    Windo.showDirect(`modal-${classNameToOpen}`)
    return;
  }
  const relevantDocConfig = myDocuments.filter( doc => doc.classNameToOpen === classNameToOpen);

  if(relevantDocConfig.length !== 1) return;

 new Windo( relevantDocConfig[0] );

  // Listener to REMOVE Windo (Explorer) 
  addListenForCloseWindo();

}

function addListenForCloseWindo(){
  document.querySelectorAll('.close-btn-explorer').forEach(el => el.addEventListener('click', closeExplorerWindo ));
}

function closeExplorerWindo(e){
  const windowToClose = e.target.dataset.windoContents;

  // Remove from DOM | (kill Windo)
  const windoToRemove = document.querySelector(`.modal-${windowToClose}`);
  windoToRemove.parentNode.removeChild(windoToRemove); 
}







