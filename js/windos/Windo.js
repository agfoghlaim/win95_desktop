import { handleInitTask } from '../tasks/taskUtil.js';

const  LASTDROPCOORDINATES = {
  clientX: 0, clientY: 0
}

export class Windo{

  constructor(config){
    // Temp, pass easily to new task
    this.config = config;

    this.windoParent = config.windoParent; 
    this.classNameToOpen = config.classNameToOpen; 
    this.content = config.content; 
    this.title = config.title; 
    this.img = config.img || false; 
    [this.top, this.left] = config.offset || [5, 5];
    this.windoClassName = config.windoClassName; 

    this.iconHtml = this.getIconHtml(); 

    this.init();
  }

  init(){
    this.addToDOM();
   //this.addOpenDocumentListeners();
  }

  getIconHtml(){
    if(this.img) return  `<img class="modal-icon" src="../img/${this.img}"/>`;
    return '';
  }

  getHTML(){
    return `
    <div draggable="true" style="position:absolute;top:${this.top}rem; left:${this.left}rem; "class="windo show windo-${this.classNameToOpen} ${this.windoClassName}">
  
      <div draggable="true" class="bar" data-corresponding-classname="${this.classNameToOpen}">
        <div class="windo-info">
          ${this.iconHtml}
          <div class="windo-title">${this.title}</div>
        </div>
        <button data-windo-contents="${this.classNameToOpen}" class="mini-btn mini-btn-${this.classNameToOpen}">-</button>

        <button data-windo-contents="${this.classNameToOpen}" class="maxi-btn maxi-btn-${this.classNameToOpen}">
          <div class="maxi-square"></div>
        </button>

        <button data-windo-contents="${this.classNameToOpen}" class="close-btn-explorer close-btn-explorer-${this.classNameToOpen}">X</button>
        
      </div>
  
      <div class="windo-main">
      <div>${this.content}</div>
      </div>
  
    </div>`;
  }

  addToDOM(html = this.getHTML() ){
 
    const windoParent = document.querySelector(`.${this.windoParent}`);
  
    windoParent.innerHTML += html;

    this.addMinimiseListeners();
    
  }
  
  // called above in addToDom()
  addMinimiseListeners(){

    const miniBtns = document.querySelectorAll(`.mini-btn`)

    miniBtns.forEach( miniBtn => miniBtn.addEventListener('click', e => this.handleMinimise(e) ));

    
  }

  handleMinimise(e){
  
    if(!e.target.classList.contains(`mini-btn`)) return;

    document.querySelector(`.windo-${e.target.dataset.windoContents}`)

    .classList.remove('show');

    // Create taskItem if it doesn't exist
    if( !document.querySelector(`.task-item-${e.target.dataset.windoContents}`) && !document.querySelector(`[data-task-for-class=${e.target.dataset.windoContents}]`)){
      handleInitTask(e.target.dataset.windoContents);
    }
  }

  show(e){
   
    // data-modal-class should be the class of the modal to show
    // ie. <button data-modal-class="whatever">  shows <modal modalno="whatever">
 
    if(e.target.dataset.modalClass !== `${this.classNameToOpen}`
    && e.target.parentElement.dataset.modalClass !== `${this.classNameToOpen}`) return;
    
    document.querySelector(`.windo-${this.classNameToOpen}`)
    .classList.add('show');
  }

  // TODO - tidy up
  static addDragListeners(){
    const documentWindoContainer = document.querySelector('.document-windo-container');
    const programWindoContainer = document.querySelector('.program-windo-container');
    const tetrisWindoContainer = document.querySelector('.special-tetris-container-to-getaround-bug-i-cannot-fix');

    documentWindoContainer.addEventListener('dragstart', e =>this.dragModal(e));
    documentWindoContainer.addEventListener('dragend', e => this.dropModal(e)); 

    programWindoContainer.addEventListener('dragstart', e =>this.dragModal(e));
    programWindoContainer.addEventListener('dragend', e => this.dropModal(e)); 

    tetrisWindoContainer.addEventListener('dragstart', e =>this.dragModal(e));
    tetrisWindoContainer.addEventListener('dragend', e => this.dropModal(e)); 

    /* problem with Firefox, can't get mouse positions from dragend event, see here https://bugzilla.mozilla.org/show_bug.cgi?id=505521 */
    window.addEventListener('drop', e =>this.saveMouseCoordinatesAfterEveryDrop(e));
  }

  // show whatever modal corresponds to class passed
  static showDirect(modalClass){
    const modal = document.querySelector(`.${modalClass}`);
    if(modal){
      document.querySelector(`.${modalClass}`)
      .classList.add('show');
    }
  }

  static dragModal(e){
    
    if(e.target.nodeType !== 1) return;
    if(!e.target.classList.contains('bar')) return;

    e.dataTransfer.setData('text/plain', null);
    const img = new Image(); 
    img.src = 'img/programs.ico'; 
    e.dataTransfer.setDragImage(img, 10, 10);
  }

  static dropModal(e){
    e.preventDefault();
    
    if(e.target.nodeType !== 1) return;
    if(!e.target.classList.contains('bar')) return;
  
    const modalNo = e.target.dataset.correspondingClassname;
    // console.log(modalNo, `.modal-${modalNo}`)
    const modal = document.querySelector(`.windo-${modalNo}`);
   
    // e.clientX, e.clientY not available in Firefox - use LASTDROPCOORDINATES 
    modal.style.top = `${LASTDROPCOORDINATES.clientY}px`;
    modal.style.left = `${LASTDROPCOORDINATES.clientX}px`;
  }

  static saveMouseCoordinatesAfterEveryDrop(e){
    e.preventDefault();

    LASTDROPCOORDINATES.clientX = e.clientX;
    LASTDROPCOORDINATES.clientY = e.clientY;
  }

}




