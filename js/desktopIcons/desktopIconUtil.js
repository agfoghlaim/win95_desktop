import { Windo } from '../windos/Windo.js';
import { myDocuments } from '../content.js';
import { DesktopIcon } from './DesktopIcon.js';

export function initDesktopIcons(){

  populateFileSpaces();
  populateDesktopIcons();

  // Listener to launch Exlporer Windo | happens on init, resize & dragend
  addLaunchExplorerListener();

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
  function populateDesktopIcons (){

    myDocuments.forEach( (icon, i) => {
      const dtIcon = new DesktopIcon( icon );
      addIconToDOM(i, dtIcon);
    });

    // helper | populateFiles
    function addIconToDOM(i, dtIcon){
      const spaces = document.querySelectorAll('.space');
      spaces[i].classList.replace("emptySpace", "filledSpace");
      spaces[i].innerHTML = dtIcon.getHtml(i);
    }
  }


}

// Called above in init | also in main.js after 'dragend' events
export function addLaunchExplorerListener(){
  document.querySelectorAll('.launchExplorer').forEach(el => el.addEventListener('click', launchExplorer));
}

// Event Handler | click '.desktop-icon-img' | main.js
function launchExplorer(e){
console.log("launch called")
  if(!e.target.classList.contains('launchExplorer') && !e.target.parentElement.classList.contains('launchExplorer')) return;

  const classNameToOpen = e.target.dataset.modalClass || e.target.parentElement.dataset.modalClass;

  // Show if already exists | and return
  if( document.querySelector(`.modal-${classNameToOpen}`) ){
    Windo.showDirect(`modal-${classNameToOpen}`)
    return;
  }
  
  const relevantDocConfig = myDocuments.filter( doc => doc.classNameToOpen === classNameToOpen);

  if(relevantDocConfig.length !== 1) return;

  new Windo( relevantDocConfig[0] );

  // Add Listener to REMOVE Windo (Explorer) 
  addListenForCloseWindo();

}

// Helper 
function addListenForCloseWindo(){
  document.querySelectorAll('.close-btn-explorer').forEach(el => el.addEventListener('click', closeExplorerWindo ));
}

// Handler
function closeExplorerWindo(e){
  const windowToClose = e.target.dataset.windoContents;

  // Remove from DOM | (kill Windo)
  const windoToRemove = document.querySelector(`.modal-${windowToClose}`);
  windoToRemove.parentNode.removeChild(windoToRemove); 
}







