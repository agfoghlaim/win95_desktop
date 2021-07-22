import { ProgramWindo } from '../windos/ProgramWindo';
import { programConfigs } from '../content';
import { Tetris } from './tetris/Tetris';
import { DateTimeUI } from './dateTime/DateTimeUI';
import { Calculator } from './calculator/Calculator';
import { Wordpad } from './wordpad/Wordpad';

// Dynamic classes
const classes = { Tetris, DateTimeUI, Calculator, Wordpad };

function dynamicClass(name) {
  return classes[`${name}`];
}

// Event Handler | .launch-program clicked | main.js
export function launchProgram(e) {
  // Name of Program Class for launching
  const programToLaunch =
    e.target.dataset.launch || e.target.parentElement.dataset.launch;

  // Return if no name of Program Class
  if (!programToLaunch) return;

  // Get corresponding Windo name | Return if Windo exists (already launched)
  const correspondingWindoName =
    e.target.dataset.launchWindo || e.target.parentElement.dataset.launchWindo;

  // If Program in DOM, show | !And return!
  if (document.querySelector(`.${correspondingWindoName}`)) {
    ProgramWindo.showDirect(correspondingWindoName);
    return;
  }

  // This really isn't ideal - check if program (ie Wordpad) is being launched via a file icon (rather than from start menu). If so, need to get the file contents from localStorage and pass them to Wordpad so it can 'open the file'. Use data-name (of file) attribute to check.
  let wordpadFile = false;
  if (e.target.dataset.name) {
    // Get file contents
    const fileName = e.target.dataset.name;
    const files = JSON.parse(localStorage.getItem('files')) || [];
    const file = files.filter((f) => f.name === fileName)[0];

    wordpadFile = file || '';
  }

  // Launch Program
  launch(programToLaunch, wordpadFile);

  function launch(programName, wordpadEdgeCase) {
    // Class of Program being launched
    const SomeProgram = dynamicClass(programName);

    // Instatiate
    const thisProgram = new SomeProgram();

    // Program's HTML | Also pass wordpad file contents
    const html = thisProgram.getHtml(wordpadEdgeCase);

    // Program Config | content.js
    const { params, onProgramOpen } = programConfigs[`${programName}`];

    // Set program config content to html
    params.content = html;

    // Wrap in Windo HTML
    const windo = new ProgramWindo(params);
    const programWindoHtml = windo.getHtml();

    // Add to DOM
    windo.addToDOM(programWindoHtml);

    // Pass Program instance | content.js
    // Also pass wordpadEdgeCase which will only exist for Launch Wordpad
    onProgramOpen(thisProgram, wordpadEdgeCase);
  }
}

// Event Handler | .program-windo-container clicked | main.js
export function closeProgramWindo(e) {
  if (!e.target.classList.contains('close-program-windo-btn')) return;

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

  // Dispatch 'programClosed' event | main.js listening |  will remove taskbar item
  dispatchProgramClosedEvent(classNameOfWindoToClose);
}

function dispatchProgramClosedEvent(classNameOfWindoToClose) {
  const programClosed = new CustomEvent('programClosed', {
    detail: classNameOfWindoToClose,
  });

  document.querySelector('.mid-taskbar').dispatchEvent(programClosed);
}

export function addLaunchProgramListener() {
  document
    .querySelectorAll('.launch-program')
    .forEach((el) => el.addEventListener('click', launchProgram));
}
