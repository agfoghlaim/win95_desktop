import { addKeyboardListeners, dispatchClosedEvent } from './programs/tetris/tetrisUtil.js';


export const programConfigs = {

    // Assign instance to tetrisInstance when passed as onProgramOpen param. Can then use it when the onProgramClose runs. 
    tetrisInstance: undefined,
   
    Tetris:{
      // programUtil.js passes Tetris instance
      onProgramOpen: (tetris) => {
        programConfigs.tetrisInstance = tetris,
        tetris.initCtx();
        addKeyboardListeners(tetris);
      },
      
      onProgramClose: () => {

        // call setGameOver, endGame on current instance of Tetris
        programConfigs.tetrisInstance.setGameOver(true);
        programConfigs.tetrisInstance.endGame();

        // See tetrisUtil.js
        dispatchClosedEvent();
      },
      startMenuParentClass: 'games-item',

      params: {
        //windoParent: 'program-windo-container',
        windoParent: 'special-tetris-container-to-getaround-bug-i-cannot-fix',
        windoClassName: 'windo-tetris', 
        classNameToOpen: 'launch-tetris',
        content: '', 
        offset:[5,10],
        img: 'Joy.ico',
        title: 'Tetris'
      }
        
    },

      dateTimeUIInstance: undefined,
      
    DateTimeUI:{
        
      onProgramOpen: (dateTimeUI) => {
        programConfigs.dateTimeUIInstance = dateTimeUI,
        dateTimeUI.initClock();
        dateTimeUI.initMonth();
        dateTimeUI.addListeners();
      },
      
      onProgramClose: () => {
        programConfigs.dateTimeUIInstance.clock.stopClock();
      },
      startMenuParentClass: false,

      params: {
        windoParent: 'program-windo-container',
        windoClassName: 'windo-datetimeui', 
        classNameToOpen: 'launch-datetimeui',
        content: '', 
        offset:[6,11],
        img: 'Joy.ico',
        title: 'DateTimeUI'
      }
        
    }
}

export const myDocuments = [
  {
    docId: '0',
    docParent: 'file-container',
    windoParent: 'modal-container',//will be windo-container
    windoClassName: 'modal-0',
    classNameToOpen: 'file-0', // will be dynamic from docId
    content: 'Document Zero Content',
    offset:[6,11],
    img: 'Folder.ico',
    title: 'New Folder',
  },
  {
    docId: '1',
    docParent: 'file-container',
    windoParent: 'modal-container',//will be windo-container
    windoClassName: 'modal-1',
    classNameToOpen: 'file-1', // will be dynamic from docId
    content: 'Untitled Document Content',
    offset:[5,10],
    img: 'text_file.ico',
    title: 'Untitled Document',
  },
  {
    docId: '2',
    docParent: 'file-container',
    windoParent: 'modal-container',//will be windo-container
    windoClassName: 'modal-2',
    classNameToOpen: 'file-2', // will be dynamic from docId
    content: 'Document One Content',
    offset:[4,12],
    title: 'what.doc',
    img: 'wordpad.ico',
  }
];
