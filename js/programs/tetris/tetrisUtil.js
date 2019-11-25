import { Tetris } from './Tetris.js';
import { createProgramModalAndShow } from '../programUtil.js';



export  function launchTetris(){

  const tetris = new Tetris();
  
  const onProgramOpen = () => {
    tetris.initCtx();
    addKeyboardListeners(tetris);
  }
  
  const onProgramClose = () => {
    tetris.setGameOver(true);
    tetris.endGame();
  }

  createProgramModalAndShow(Tetris, tetris, 'tetris',  onProgramOpen, onProgramClose);

}

function addKeyboardListeners(instance){

  // when programClosed event happens, this will be set to false. KeyboardEvents removed when program closes - but not until after the next key press!. 
  let tetrisIsOpen = true;
  const keycodes = [40, 39, 37, 38];
  
  document.addEventListener('keydown', function what(e){
    
    // remove keydown listener if tetris closed
    if(!tetrisIsOpen){
      this.removeEventListener('keydown', what);
    }
    if(! keycodes.includes(e.keyCode)) return;
    
    if(e.keyCode === 40 ){ 
      instance.moveCurrentShape().down();
    }

    if(e.keyCode === 39 ){ 
      instance.moveCurrentShape().right();
    }

    if(e.keyCode === 37 ){ 
      instance.moveCurrentShape().left();
    }

    if(e.keyCode === 38 ){ 
      instance.moveCurrentShape().up();
    }

  });

  /* 
  Program class modal-close event dispatches 'programClosed' event
  Listen for it here, remove 'keydown' listeners from document when tetris is not open. Also remove 'programClosed' listener.
  */
  document.querySelector('.close-btn-menu-tetris').addEventListener('programClosed', function listen(e){
    
    if(!e.detail === `menu-tetris`) return;

    tetrisIsOpen = false;
    this.removeEventListener('programClosed', listen);
  })
}



