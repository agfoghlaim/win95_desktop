import { addKeyboardListeners, dispatchClosedEvent } from './programs/tetris/tetrisUtil.js';
import { WordpadUI } from './programs/wordpad/Wordpad';


import wordpad from '../img/wordpad.ico';
import textFile from '../img/text_file.ico';
import folder from '../img/Folder.ico';
import joystick from '../img/Joy.ico';

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
        offset:[1,1],
        img: joystick,
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
        offset:[3,3],
        img: 'Joy.ico',
        title: 'DateTimeUI'
      }
        
    },

    calculatorInstance: undefined,

    Calculator:{
      onProgramOpen: (calculator) => {
        //programConfigs.calculatorInstance = calculator
        calculator.initCalc();

      },
      
      onProgramClose: () => {
       
      },

      startMenuParentClass: false, 

      params: {
        windoParent: 'program-windo-container',
        windoClassName: 'windo-calculator', 
        classNameToOpen: 'launch-calculator',
        content: '', 
        offset:[6,11],
        img: 'calculator.ico',
        title: 'Calculator'
      }

    },
    wordpadInstance: undefined,

    Wordpad:{
      onProgramOpen: (wordpad, file) => {
        
        wordpad.init(file);

      },
      
      onProgramClose: () => {
       
      },

      startMenuParentClass: false, 

      params: {
        windoParent: 'program-windo-container',
        windoClassName: 'windo-wordpad', 
        classNameToOpen: 'launch-wordpad',
        content: '', 
        offset:[6,11],
        img: 'wordpad.ico',
        title: 'Wordpad'
      }, 
      saveDialogConfig: () =>{
        return{
          
            docId: 'saveDialog',
            windoParent: 'dialog-windo-container', 
            windoClassName: 'windo-saveDialog',
            classNameToOpen: 'document-saveDialog', 
            content: '',
            offset:[4,12],
            title: 'save',
            img: '../img/wordpad.ico',
          
        }
      },
      openDialogConfig: () =>{
        return{
          docId: 'openDialog',
          windoParent: 'dialog-windo-container', 
          windoClassName: 'windo-openDialog',
          classNameToOpen: 'document-openDialog', 
          content: '',
          offset:[4,12],
          title: 'open',
          img: '../img/wordpad.ico',
        }
      }
     

    }
}

export const myDocuments = [
  {
    docId: '0',
    windoParent: 'document-windo-container',
    windoClassName: 'windo-0',
    classNameToOpen: 'document-0', 
    content: WordpadUI.getDialogFileWindoContent(),
    offset:[6,11],
    img: folder,
    title: 'the_only_folder',
    broadcastEvent: 'theOnlyFolderOpened'// need to re-add launch program listeners
  },
  {
    docId: '1',
    windoParent: 'document-windo-container',
    windoClassName: 'windo-1', 
    classNameToOpen: 'document-1',
    content: '<h1>Marie</h1>',
    offset:[5,10],
    img: textFile,
    title: 'about.txt',
    broadcastEvent:false
  },
  {
    docId: '2',
    windoParent: 'document-windo-container',
    windoClassName: 'windo-2',
    classNameToOpen: 'document-2', 
    content: 'Document One Content',
    offset:[4,12],
    title: 'dmoz.html',
    img: wordpad,
    broadcastEvent:false
  }
];
