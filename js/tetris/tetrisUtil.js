import { Modal, Program } from '../Modal.js';
import { Tetris } from './Tetris.js';

export  function launchTetris(){


  // Tetris Modal
  const modalContent = Tetris.getHtml();
  const modalConfig = {
    parent: 'modal-container', 
    relatedParent: 'start-item', 
    related: `menu-tetris`,
    content: `${modalContent}`, 
    offset:[5,10],
    img: `Joy.ico`,
    title: `Tetris`
  }

  const tetrisModal = new Program(modalConfig);
  tetrisModal.showDirect('modal-menu-tetris');

  // Tetris Canvas
  const canvas = document.getElementById('tetris');
  const ctx = canvas.getContext('2d');
  ctx.scale(40, 40);

  // Init Game
  const tetris = new Tetris(ctx);

  // original addListeners, delete
  // tetris.addKeyboardListeners();
 
  addKeyboardListeners(tetris);

  //listen for tetris closing (game will stop when current shape collides)
  document.querySelector('.close-btn-menu-tetris').addEventListener('tetrisClosed', (e) => {

    tetris.setGameOver(true);
    tetris.endGame();
    const currentTetris = document.querySelector('.modal-menu-tetris');
    currentTetris.parentNode.removeChild(currentTetris); 
  })

}

function addKeyboardListeners(instance){

  const keycodes = [40, 39, 37, 38];
  let tetrisIsOpen = true;
  document.addEventListener('keydown', function what(e){
    
    // remove keydown listener if tetris closed
    if(!tetrisIsOpen){
      console.log("not open removing")
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
  Program class modal-close event dispatches 'tetrisClosed' event
  Listen for it here, remove 'keydown' listeners from document when tetris is not open. Also remove 'tetrisClosed' listener.
  */
  document.querySelector('.close-btn-menu-tetris').addEventListener('tetrisClosed', function listen(e){
    tetrisIsOpen = false;
    this.removeEventListener('tetrisClosed', listen);
  })
}