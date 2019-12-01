const  LASTDROPCOORDINATES = {
  clientX: 0, clientY: 0
}

export class Windo{

  constructor(config){
  
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
    <div draggable="true"  style="position:absolute;top:${this.top}rem; left:${this.left}rem; "class="windo show modal-${this.classNameToOpen}">
  
      <div draggable="true" class="bar" data-modalno="${this.classNameToOpen}">
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
  
  addMinimiseListeners(){

    const miniBtns = document.querySelectorAll(`.mini-btn`)

    miniBtns.forEach( miniBtn => miniBtn.addEventListener('click', e => this.handleMinimise(e) ));
    
  }

  handleMinimise(e){
  
  if(!e.target.classList.contains(`mini-btn`)) return;

  document.querySelector(`.modal-${e.target.dataset.windoContents}`)

  .classList.remove('show');

  }

  show(e){
   
    // data-modal-class should be the class of the modal to show
    // ie. <button data-modal-class="whatever">  shows <modal modalno="whatever">
 
    if(e.target.dataset.modalClass !== `${this.classNameToOpen}`
    && e.target.parentElement.dataset.modalClass !== `${this.classNameToOpen}`) return;
    
    document.querySelector(`.modal-${this.classNameToOpen}`)
    .classList.add('show');
  }

  static addDragListeners(){
    //const container = document.querySelector('.modal-container');
    document.addEventListener('dragstart', e =>this.dragModal(e));
    document.addEventListener('dragend', e => this.dropModal(e)); 

    /* problem with Firefox, can't get mouse positions from dragend event, see here https://bugzilla.mozilla.org/show_bug.cgi?id=505521 */
    document.addEventListener('drop', e =>this.saveMouseCoordinatesAfterEveryDrop(e));
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
  
    const modalNo = e.target.dataset.modalno;
    // console.log(modalNo, `.modal-${modalNo}`)
    const modal = document.querySelector(`.modal-${modalNo}`);
  
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




