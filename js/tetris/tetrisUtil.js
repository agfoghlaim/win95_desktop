import { Modal } from '../Modal.js';
import { Tetris } from './Tetris.js';

export  function launchTetris(){

  /*
    TODO - make sure only one tetris exists at a time. Maybe remove from DOM when it's closed. Also game doesn't end until current tile collides.
  */

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

  const tetrisModal = new Modal(modalConfig);
  tetrisModal.showDirect('modal-menu-tetris');

  // Tetris Canvas
  const canvas = document.getElementById('tetris');
  const ctx = canvas.getContext('2d');
  ctx.scale(40, 40);

  // Init Game
  let tetris = new Tetris(ctx);
  tetris.addKeyboardListeners(tetris);

  //listen for tetris closing (game will stop when current shape collides)
  document.querySelector('.close-btn-menu-tetris').addEventListener('tetrisClosed', (e) => {

    tetris.setGameOver(true)
    tetris.endGame();
    const currentTetris = document.querySelector('.modal-menu-tetris')
    currentTetris.parentNode.removeChild(currentTetris);

   
  })

}