import { ProgramWindo } from '../windos/ProgramWindo.js';
import { Windo } from '../windos/Windo.js';
import { programConfigs } from '../content.js';
import { Tetris } from './tetris/Tetris.js';
import { DateTimeUI } from './dateTime/DateTimeUI.js';

// Dynamic classes
const classes = { Tetris, DateTimeUI };

function dynamicClass (name) {

  return classes[`${name}`];

}

// Event Handler | .launch-program clicked | main.js
export function launchProgram (e){

  // Name of Program Class for launching
  const programToLaunch = e.target.dataset.launch || e.target.parentElement.dataset.launch;

  // Return if no name of Program Class
  if(!programToLaunch) return;

  // Get corresponding Windo name | Return if Windo exists (proram already launced)
  const correspondingWindoName = e.target.dataset.launchWindo || e.target.parentElement.dataset.launchWindo;

  // If Program in DOM, show | !And return! 
  if( document.querySelector(`.${correspondingWindoName}`) ){
    ProgramWindo.showDirect(correspondingWindoName);
    return;
  }
 
  // Launch Program
  launch(programToLaunch);

  function launch(programName){

    // Class of Program being launched
    const SomeProgram = dynamicClass(programName);
  
    // Instatiate
    const thisProgram = new SomeProgram();

    // Program's HTML
    const html = thisProgram.getHtml();
   
    // Program Config | content.js
    const { params, onProgramOpen }  = programConfigs[`${programName}`];
    
    // Set program config content to html
    params.content = html;

    // Wrap in Windo HTML
    const windo = new ProgramWindo( params );
    const programWindoHtml = windo.getHtml();
    
    // Add to DOM
    windo.addToDOM(programWindoHtml)
   
    // Pass Program instance | content.js
    onProgramOpen(thisProgram);
  
  }
}


// Event Handler | .program-windo-container clicked | main.js 
export function closeProgramWindo(e){

  if(!e.target.classList.contains('close-program-windo-btn')) return;

  //  Windo to Close
  const classNameOfWindoToClose = e.target.dataset.windoContents;

  // Title of Program to close
  const titleOfProgramToClose = e.target.dataset.programTitle;

  // Program's onClose method | content.js
  const { onProgramClose } = programConfigs[`${titleOfProgramToClose}`];
  
  // Run onClose | (kill Program)
  onProgramClose();

  // Remove from DOM | (kill Windo)
  const windoToRemove = document.querySelector(`.${classNameOfWindoToClose}`);
  windoToRemove.parentNode.removeChild(windoToRemove); 

}




