import { Windo } from './Windo.js';
export class ProgramWindo extends Windo{
  
  constructor(config, program, onOpen, onClose){
 
    super(config);

    this.onClose = onClose;
    this.program = program;
    onOpen();
    this.listenForClose();
  }

 
  addCloseListener(){

    // to keep access
    const related = this.related;

    // keep named non arrow function to easily remove eventListeners
    this.container.addEventListener('click',  function handleClose(e){
    
      if(!e.target.classList.contains(`close-btn-${related}`)) return;
      
      // hide first 
      document.querySelector(`.modal-${related}`).classList.remove('show');
      
      // Dispatch 'programClosed' event
      const closeProgram = new CustomEvent('programClosed', {detail:`${related}`});
      e.target.dispatchEvent(closeProgram);
  
      // remove listener (Programs removed from DOM when closed)
      this.removeEventListener('click', handleClose, false);
      
    }, false);

  }

  // Listen for 'programClosed' event
  listenForClose(){

    document.querySelector(`.close-btn-${this.related}`).addEventListener('programClosed', e => {
  
      if(!e.detail === this.related) return;
  
      // handle anything specific to this program?
      this.onClose(this.program);
 
      
      this.removeProgWindoFromDOM();
    
    })
  }
  
  // TODO move this
  removeProgWindoFromDOM(){
    const currentprogram = document.querySelector(`.modal-${this.related}`);
    currentprogram.parentNode.removeChild(currentprogram); 
  }
   

}